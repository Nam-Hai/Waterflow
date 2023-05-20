import {
  Renderer,
  Camera,
  Transform,
} from "ogl";

import { N } from "~/helpers/namhai-utils";
import { ROR } from "~/plugins/core/resize";
import TitleMSDF from "./Components/TitleMSDF";
import indexCanvas from "./Pages/indexCanvas";
import example2Canvas from "./Pages/example2Canvas";
import { useFlowProvider } from "~/waterflow/FlowProvider";

const CanvasRouteMap = new Map([
  ['example2', example2Canvas],
  ['index', indexCanvas],
])
export default class Canvas {
  constructor() {
    this.pages = {
      index: null,
      example2: null
    }
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: devicePixelRatio,
    });

    this.gl = this.renderer.gl


    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;

    this.scene = new Transform();
    N.BM(this, ["resize"]);


    this.size = ref({ width: 0, height: 0 })

    this.ro = new ROR(this.resize)
  }

  async init() {
    this.titleMSDF = new TitleMSDF(this.gl)
    this.ro.on();
    const flowProvider = useFlowProvider()
    this.onChange(flowProvider.getRouteFrom())
    this.currentCanvasPage = this.nextCanvasPage
    await this.titleMSDF.init()
  }

  resize({ vh, vw, scale }) {
    this.renderer.setSize(vw, vh);

    this.camera.perspective({
      // aspect: this.sizePixel.width / this.sizePixel.height,
      aspect: vw / vh
    });
    const fov = (this.camera.fov * Math.PI) / 180;

    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;

    this.size.value = {
      height: height,
      width: height * this.camera.aspect,
    }
  }

  onChange(route) {
    const page = CanvasRouteMap.get(route.name)
    if (!page) return
    this.nextCanvasPage = new page({ gl: this.gl, scene: this.scene, camera: this.camera, titleMSDF: this.titleMSDF })
    this.pages[route.name] = this.nextCanvasPage
    // this.pages[route.name] = this.nextCanvasPage
  }

  destroy() {
    this.ro.off()
  }
};
