import { Color } from 'ogl'
export default class ComposerPass {
  constructor({ enabled = true, target,   }) {
    this.enabled = enabled
    // this.textures = textures

    this.target = target
  }

  toggleEffect() {
    this.enabled = !this.enabled
    this.pass.enabled = this.enabled
  }
  addPassRef(addPass) {
    this.pass = addPass({
      enabled: this.enabled,
      fragment: fragmentComposer,
      uniforms: {
        tMap: { value: this.target.textures[0] },
        tAlpha: { value: this.target.textures[1] },
        tNoise: { value: null },
      },
      textureUniform: 'tNoise'
    })

    return { resizeCallback: this.resize.bind(this) }
  }

  resize({ width, height }) {
    this.size.width = width
    this.size.height = height
  }
}


const fragmentComposer = /* glsl */ `#version 300 es
precision lowp float;
in vec2 vUv;

uniform sampler2D tMap;
uniform sampler2D tAlpha;
uniform sampler2D tNoise;

out vec4 FragColor;
void main() {

  vec4 color = texture(tMap, vUv);
  vec4 alpha = texture(tAlpha, vUv);
  vec4 noise = texture(tNoise, vUv);
  FragColor = color + noise * (1. - alpha);
}`;