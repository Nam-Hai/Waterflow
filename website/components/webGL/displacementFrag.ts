import { csin } from "~/lib/webGL/ogl.renderer/scene/shaders/math";
import { noiseCommon } from "~/lib/webGL/ogl.renderer/scene/shaders/noise-common";
import { noise2d } from "~/lib/webGL/ogl.renderer/scene/shaders/noise2d";
import { noise3d } from "~/lib/webGL/ogl.renderer/scene/shaders/noise3d";

export const displacementFrag = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 uId;
uniform sampler2D tMap;
uniform float uTime;
uniform float uSeed;

in vec2 vUv;
out vec4 FragColor[2];

${noiseCommon}
${noise2d}
${csin}

void main() {

    // float fine = 5.;
    // float coarse = 1.;
    // float fineNoise = noise3d(vec3(vUv * fine, uTime * 0.08));
    // float coarseNoise = noise3d(vec3(vUv * coarse, uTime * 0.05));

    // fineNoise += noise3d(vec3(vUv.x * fine, vUv.y * fine - uTime * 0.05, uTime  * 0.08 + uSeed));
    // coarseNoise += noise3d(vec3(vUv.x * coarse, vUv.y * coarse + uTime * 0.05, uTime  * 0.07 + uSeed));

    // // float noise = mix(fineNoise, coarseNoise, 0.7);
    // float noise = fineNoise * 0.1 + coarseNoise * 0.5;
    // noise = mix(mix(0.05, 0.15, csin(uTime)), 1., clamp(noise, 0., 0.6) / 0.6);
    // vec4 texture = texture(tMap, vUv + vec2(noise * 0.025, -coarseNoise * 0.05));

    float noise = snoise(vec2(vUv.x * 2. + uSeed + uTime * 0.01, vUv.y * 2. + uTime * 0.01));
    vec4 texture = texture(tMap, vUv + vec2(noise * 0.025, -noise * 0.05));

    vec4 color = 1. - (1. - texture);
    // vec4 color = texture;

    FragColor[0] = vec4(color.r, color.g, color.b, 1.);
    FragColor[1] = uId;
}
`