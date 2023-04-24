import {
  Renderer,
  Camera,
  Transform,
} from "ogl";
import { useFlowProvider } from "~/../src/FlowProvider";
import indexCanvas from "./Pages/indexCanvas";

import { N } from "~/helpers/namhai-utils";

const CanvasRouteMap = new Map([
  ['index', indexCanvas]
])
export default class Canvas {
  constructor({ canvas }) {
    this.renderer = new Renderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      dpr: devicePixelRatio,
    });
    this.gl = this.renderer.gl;

    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;

    this.scene = new Transform();
    N.BM(this, ["resize"]);

    // this.raf = new N.RafR(this.update);
    this.ro = new N.ROR(this.resize)
    this.ro.trigger()

    const flowProvider = useFlowProvider()
    this.onChange(flowProvider.getRouteFrom())
    this.currentCanvasPage = this.nextCanvasPage

    
    this.init();
  }

  
  async init() {
    this.ro.on();
  }

  resize({vh, vw}) {
    this.renderer.setSize(vw, vh);

    this.camera.perspective({
      // aspect: this.sizePixel.width / this.sizePixel.height,
      aspect: vw / vh
    });
    const fov = (this.camera.fov * Math.PI) / 180;

    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.size = {
      height: height,
      width: height * this.camera.aspect,
    };
    this.currentCanvasPage && (this.currentCanvasPage.canvasSize = this.size)
  }

  onChange(route) {
    const page = CanvasRouteMap.get(route.name)
    this.nextCanvasPage = new page({gl: this.gl, scene:this.scene, camera: this.camera, canvasSize: this.canvasSize})
  }

  destroy() {
    this.raf.stop()
    this.ro.off()
  }
}