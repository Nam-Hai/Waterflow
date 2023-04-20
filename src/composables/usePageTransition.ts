import { onMounted } from "vue";
import { FlowProps, FlowProvider, useFlowProvider } from "../FlowProvider";
import { onBeforeRouteLeave } from "vue-router";

export type transitionFunction<T> = (props: T, resolve: () => void, flowProps?: FlowProps) => void

// TODO cancel animation if a new route is taken early
type PageTranstionOptions<T> = {
  props: T,
  transitionOutMap?: Map<string, transitionFunction<T>>,
  transitionOut?: transitionFunction<T>,
  transitionInCrossfade?: transitionFunction<T>,
  transitionInCrossfadeMap?: Map<string, transitionFunction<T>>,

  // should probably not use this yet, if you click on a link in the buffer things break
  disablePointerEvent?: boolean,

  // true && 'BOTTOM' && 'UNDER' are the same
  enableCrossfade?: false | true | 'TOP' | 'BOTTOM' | 'UNDER'
}


export default function usePageTransition<T>({
  props,
  transitionOutMap,
  transitionOut,
  transitionInCrossfade,
  transitionInCrossfadeMap,
  enableCrossfade = false,
  disablePointerEvent = true
}: PageTranstionOptions<T>) {
  const provider = useFlowProvider();
  let crossfade = enableCrossfade;

  const flowProps = provider.props

  onMounted(() => {
    provider.flowIsHijacked ? flowCrossfade() : flowIn()
  })

  const flowIn = async () => {
    provider.unMountBufferPage()
  }

  const flowCrossfade = async () => {
    await createFlow<T>(provider, transitionInCrossfadeMap, transitionInCrossfade, props, flowProps)
    provider.releaseHijackFlow()
  }

  if (provider.flowIsHijacked) return
  onBeforeRouteLeave(async (to, _from, next) => {
    if(disablePointerEvent) {
      document.body.style.pointerEvents = 'none'
    }
    provider.scrollFlow.stop()

    provider.onChangeRoute(to)

    let crossfadeExist = false
    crossfade && (crossfadeExist = provider.triggerCrossfade(crossfade))
    console.log({ crossfadeExist })

    let promiseOut = createFlow<T>(provider, transitionOutMap, transitionOut, props, flowProps)

    let flowPromise = crossfadeExist ? provider.hijackFlow() : null
    await Promise.all([promiseOut, flowPromise])


    next()
    if(disablePointerEvent) {
      document.body.style.pointerEvents = 'all'
    }
    provider.scrollFlow.resume()
    provider.scrollFlow.scrollToTop()
  })
}

function createFlow<T>(provider: FlowProvider, transitionMap: Map<string, transitionFunction<T>> | undefined, transition: transitionFunction<T> | undefined, props: T, flowProps: FlowProps): Promise<void> {
  const from = provider.getRouteFrom();
  const to = provider.getRouteTo();

  const key: string = from.name?.toString() + ' => ' + to.name?.toString()

  let waterFlow = getWater(key, transitionMap, transition)
  return new Promise<void>(cb => {
    if (!waterFlow) cb()
    else waterFlow(props, cb, flowProps)
  })
}

// getter for TransitionFunction between the Map, and fallback function
function getWater<T>(key: string, map?: Map<string, transitionFunction<T>>, fallback?: transitionFunction<T>) {
  return map?.get(key) || map?.get('default') || fallback || undefined
}
