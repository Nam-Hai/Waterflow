import { getCurrentInstance, onMounted, watch } from "vue";
import { FlowProps, FlowProvider, useFlowProvider } from "../FlowProvider";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

export type FlowFunction<T> = (props: T, resolve: () => void, flowProps: FlowProps) => void

// TODO cancel animation if a new route is taken early
type PageFlowOptions<T> = {
  props: T,
  flowOut?: FlowFunction<T>,
  flowOutMap?: Map<string, FlowFunction<T>>,
  flowInCrossfade?: FlowFunction<T>,
  flowInCrossfadeMap?: Map<string, FlowFunction<T>>,

  // should probably not use this yet, if you click on a link in the buffer things break
  disablePointerEvent?: boolean,

  // true && 'BOTTOM' are the same
  enableCrossfade?: false | true | 'TOP' | 'BOTTOM'
}


export function usePageFlow<T>({
  props,
  flowOutMap,
  flowOut,
  flowInCrossfade,
  flowInCrossfadeMap,
  enableCrossfade = false,
  disablePointerEvent = true
}: PageFlowOptions<T>) {
  const provider = useFlowProvider();
  let crossfade = enableCrossfade;

  const flowProps = provider.props

  onMounted(async() => {
    provider.flowIsHijacked && flowCrossfade() 
  })

  const flowIn = async () => {
    // provider.unMountBufferPage()
  }

  const flowCrossfade = async () => {
    console.log('release');
    await createFlow<T>(provider, flowInCrossfadeMap, flowInCrossfade, props, flowProps)
    console.log('release');
    provider.releaseHijackFlow()
  }

  const router = useRouter()
  console.log(router);
  router.beforeEach(async (to, _from, next) => {
    if (disablePointerEvent) {
      document.body.style.pointerEvents = 'none'
    }
    provider.scrollFlow.stop()

    // mount next page
    provider.onChangeRoute(to)

    crossfade && provider.triggerCrossfade(crossfade)

    let promiseOut = createFlow<T>(provider, flowOutMap, flowOut, props, flowProps)
    let flowPromise = crossfade ? provider.hijackFlow() : null
    await Promise.all([promiseOut, flowPromise])
    provider.unMountBufferPage()

    next()
    if (disablePointerEvent) {
      document.body.style.pointerEvents = 'all'
    }
    provider.scrollFlow.resume()
    provider.scrollFlow.scrollToTop()
  })

  
}

function createFlow<T>(provider: FlowProvider, flowMap: Map<string, FlowFunction<T>> | undefined, flow: FlowFunction<T> | undefined, props: T, flowProps: FlowProps): Promise<void> {
  const from = provider.getRouteFrom();
  const to = provider.getRouteTo();

  const key: string = from.name?.toString() + ' => ' + to.name?.toString()

  let FlowFunction = getFlowFunction(key, flowMap, flow)
  return new Promise<void>(cb => {
    if (!FlowFunction) cb()
    else FlowFunction(props, cb, flowProps)
  })
}

// getter for FlowFunction between the Map, and fallback function
function getFlowFunction<T>(key: string, map?: Map<string, FlowFunction<T>>, fallback?: FlowFunction<T>) {
  return map?.get(key) || map?.get('default') || fallback || undefined
}
