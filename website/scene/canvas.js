import {
  Renderer,
  Box,
  Camera,
  Program,
  Plane,
  Transform,
  Texture,
  Mesh,
} from "ogl";
import { basicFrag } from "./shaders/BasicFrag";
import { basicVer } from "./shaders/BasicVer";
import { N } from "~/helpers/namhai-utils";

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
    N.BM(this, ["update", "onResize", "onScroll"]);



    // this.raf = new N.RafR(this.update);
    const { $RafR, $ROR} = useNuxtApp()
    this.raf = new $RafR(this.update);
    this.ro = new $ROR(this.onResize)
    this.ro.trigger()

    this.init();
    this.addEventListener();
  }
  async init() {
    this.raf.run();
    this.ro.on();
  }
  addEventListener() {
    // document.addEventListener('wheel', this.onScroll)
  }

  onScroll(e) {
    this.scroll.target += e.deltaY / 100;
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.sizePixel = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.camera.perspective({
      aspect: this.sizePixel.width / this.sizePixel.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;

    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.size = {
      height: height,
      width: height * this.camera.aspect,
    };
  }

  update(e) {
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    });
  }

  destroy() {
    this.raf.stop()
    this.ro.off()
  }
}