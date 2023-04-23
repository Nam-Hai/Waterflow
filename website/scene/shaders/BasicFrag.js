const basicFrag = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;

in vec2 vUv;
out vec4 FragColor;

void main() {
  vec4 color = texture(tMap, vUv);
  FragColor = color;
}
`

export { basicFrag }
