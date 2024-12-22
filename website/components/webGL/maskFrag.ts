import { csin } from "~/lib/webGL/ogl.renderer/scene/shaders/math";
import { noiseCommon } from "~/lib/webGL/ogl.renderer/scene/shaders/noise-common";
import { noise3d } from "~/lib/webGL/ogl.renderer/scene/shaders/noise3d";

export const maskFrag = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 uId;
uniform sampler2D tMap;
uniform float uTime;
uniform float uSeed;

in vec2 vUv;
out vec4 FragColor[2];

${noiseCommon}
${noise3d}
${csin}

void main() {
    vec4 texture = texture(tMap, vUv);

    float fine = 10.;
    float coarse = 1.;
    float fineNoise = noise3d(vec3(vUv * fine, uTime * 0.08));
    float coarseNoise = noise3d(vec3(vUv * coarse, uTime * 0.05));

    fineNoise += noise3d(vec3(vUv.x * fine, vUv.y * fine - uTime * 0.2, uTime  * 0.08 + uSeed));
    coarseNoise += noise3d(vec3(vUv.x * coarse, vUv.y * coarse + uTime * 0.2, uTime  * 0.07 + uSeed));

    float noise = clamp(fineNoise * .5 + coarseNoise * 1., 0., 1.);
    // float noise = noise3d(vec3(vUv.x * 4., vUv.y * 1., uTime * 0.4)) * 2.;

    vec4 color = 1. - (1. - texture) * (1. - noise);
    // vec4 color = texture;

    FragColor[0] = vec4(color.r, color.g, color.b, 1.);
    FragColor[1] = uId;
}
`