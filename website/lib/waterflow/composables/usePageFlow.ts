import { EffectScope, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useFlowProvider } from "../FlowProvider";
import type { RouteLocationNormalized } from "#vue-router";
import { onLeave } from "./onFlow";

export type FlowFunction<T> = (props: T, resolve: () => void) => void

type FlowKey = `default` | `${string} => ${string}`;

type PageFlowOptions<T> = {
  props: T,
  flowOut?: FlowFunction<T>,
  flowOutMap?: Map<FlowKey, FlowFunction<T>>,
  flowIn?: FlowFunction<T>,
  flowInMap?: Map<FlowKey, FlowFunction<T>>,
}

export function usePageFlow<T>({
  props,
  flowOutMap,
  flowInMap,
}: PageFlowOptions<T>) {

  const { flowIsHijackedPromise, flowInPromise, startFlowIn, routeFrom, routeTo } = useFlowProvider()

  const scopeIn = effectScope()
  const resolver = startFlowIn()
  onMounted(() => {
    if (!flowIsHijackedPromise.value) return resolver && resolver()
    scopeIn.run(async () => {
      await createFlow<T>(routeFrom.value, routeTo.value, flowInMap, props)
      resolver && resolver()
    })
  })

  onLeave(async (from, to) => {
    scopeIn.stop()

    const scope = effectScope(true)
    await new Promise<void>((res, rej) => {
      scope.run(async () => {
        await createFlow<T>(from, to, flowOutMap, props)
        res()
      })
    })

    scope.stop()

  })
}

function createFlow<T>(from: RouteLocationNormalized, to: RouteLocationNormalized, flowMap: Map<string, FlowFunction<T>> | undefined, props: T): Promise<void> {
  const fromName = from.name?.toString(), toName = to.name?.toString()
  const key: string = fromName + ' => ' + toName
  const keyDefaultIn = fromName + " => any"
  const keyDefaultOut = "any => " + toName

  const FlowFunction = flowMap?.get(key) || flowMap?.get(keyDefaultIn) || flowMap?.get(keyDefaultOut) || flowMap?.get('default') || undefined
  return new Promise<void>(cb => {
    if (!FlowFunction) cb()
    else FlowFunction(props, cb)
  })
}