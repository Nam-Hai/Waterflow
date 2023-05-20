import { RouteLocationNormalized, useRoute } from 'vue-router';
import { DefineComponent, Ref, ShallowRef, nextTick, ref } from 'vue';
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

  // bufferRouteState?: ShallowRef;
  bufferTopZState?: ShallowRef;
  bufferPageRef!: ShallowRef;
  currentPageRef!: ShallowRef;

  props: FlowProps = {}

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
  swapWrapper!: () => void;
  flowIsHijacked = ref(false)

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
  public connectBuffer(currentPageRef: ShallowRef, bufferPageRef: ShallowRef, bufferTopZState: ShallowRef, swapWrapper: () => void) {
    this.bufferTopZState = bufferTopZState
    this.bufferPageRef = bufferPageRef
    this.currentPageRef = currentPageRef
    this.swapWrapper = swapWrapper
    // this.currentPageRef.value = this.routeFrom.
    this.currentPageRef.value = this.routerMap.get(this.routeTo.name!.toString())
  }

  // to add global props, like layout component or a webGL context
  public addProps(key: string, prop: Ref<any>) {
    if (!this.props[key]) {
      this.props[key] = prop
    }
  }

  public unMountBufferPage() {
    // this.bufferRouteState && (this.bufferRouteState.value = undefined)
    this.swapWrapper()
    let temp = this.currentPageRef

    this.currentPageRef = this.bufferPageRef
    this.bufferPageRef = temp
    this.bufferPageRef.value = undefined
    this.bufferTopZState && (this.bufferTopZState.value = false)
  }

  public onChangeRoute(routeTo: RouteLocationNormalized) {
    this.routeFrom = this.routeTo
    this.routeTo = routeTo

    this.bufferPageRef.value = this.routerMap.get(this.routeTo.name!.toString())
  }

  public setCrossfadeMode(crossfadeMode: boolean | 'TOP' | 'UNDER' | 'BOTTOM') {

    this.bufferTopZState && (this.bufferTopZState.value = crossfadeMode == 'TOP')
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
      this.flowIsHijacked.value = false
      this.flowHijackResolver = undefined
    }
  }

  public hijackFlow() {
    this.flowIsHijacked.value = true
    this.flowHijacked = new Promise<void>((resolve) => {
      this.flowHijackResolver = resolve;
    });
    return this.flowHijacked
  }
}

export const [provideFlowProvider, useFlowProvider] = createContext<FlowProvider>('flow-provider');
