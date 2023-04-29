import { RouteLocationNormalized, useRoute } from 'vue-router';
import { DefineComponent, Ref, ShallowRef } from 'vue';
import { createContext } from './util/apiInject';

export type FlowProps = Record<string, any>

const preventScroll = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

export class FlowProvider {
  // public transitionOut!: Promise<void>;
  public flowHijacked!: Promise<void>;
  private flowHijackResolver?: () => void;
  private routeTo!: RouteLocationNormalized;
  private routeFrom!: RouteLocationNormalized;

  bufferRouteState?: ShallowRef;
  bufferTopZState?: ShallowRef;

  props: FlowProps = {}
  flowIsHijacked: boolean = false;

  routerMap: Map<string, DefineComponent<{}, {}, any>>
  scrollFlow = {
    stop: () => {
      document.addEventListener('wheel', preventScroll, { passive: false });
    },
    resume: () => {
      document.removeEventListener('wheel', preventScroll);
    },
    scrollToTop: () => {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
  }

  constructor() {
    const route = useRoute()
    this.routeTo = route
    this.routeFrom = route

    this.routerMap = new Map()
  }

  registerPage(path: string, pageComponent: DefineComponent<{}, {}, any>) {
    this.routerMap.set(path, pageComponent)
  }

  registerScrollInterface(api: { stop: () => void, resume: () => void, scrollToTop: () => void } | undefined) {
    if (!api) return
    this.scrollFlow = api
  }

  // connect the BufferPage in the Layout for crossfade animations
  public connectBuffer(bufferRouteState: ShallowRef, bufferTopZState: ShallowRef) {
    this.bufferTopZState = bufferTopZState
    this.bufferRouteState = bufferRouteState
  }

  // to add global props, like layout component or a webGL context
  public addProps(key: string, prop: Ref<any>) {
    if (!this.props[key]) {
      this.props[key] = prop
    }
  }

  public unMountBufferPage() {
    this.bufferRouteState && (this.bufferRouteState.value = undefined)
    this.bufferTopZState && (this.bufferTopZState.value = false)
  }

  public onChangeRoute(routeTo: RouteLocationNormalized) {
    this.routeFrom = this.routeTo
    this.routeTo = routeTo
  }

  public triggerCrossfade(crossfadeMode: boolean | 'TOP' | 'UNDER' | 'BOTTOM') {
    // console.log(crossfadeMode, 'alloooo', this.routeTo.name, this.routeTo.path, this.routerMap)
    this.bufferRouteState && (this.bufferRouteState.value = this.routerMap.get(this.routeTo.name!.toString()));
    if (!!this.bufferRouteState?.value) {
      this.bufferTopZState && (this.bufferTopZState.value = crossfadeMode == 'TOP')
    }

    let a = !(crossfadeMode == false) && !!this.bufferRouteState?.value
    return a
  }

  public getRouteFrom(): RouteLocationNormalized {
    return this.routeFrom;
  }

  public getRouteTo(): RouteLocationNormalized {
    return this.routeTo;
  }

  public releaseHijackFlow(): void {
    if (this.flowHijackResolver) {
      this.flowHijackResolver();
      this.flowIsHijacked = false
      this.flowHijackResolver = undefined
    }
  }

  public hijackFlow() {
    this.flowIsHijacked = true
    this.flowHijacked = new Promise<void>((resolve) => {
      this.flowHijackResolver = resolve;
    });
    return this.flowHijacked
  }
}

export const [provideFlowProvider, useFlowProvider] = createContext<FlowProvider>('flow-provider');
