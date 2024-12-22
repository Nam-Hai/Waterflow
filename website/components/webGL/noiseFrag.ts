import { csin } from "~/lib/webGL/ogl.renderer/scene/shaders/math";
import { noiseCommon } from "~/lib/webGL/ogl.renderer/scene/shaders/noise-common";
import { noise3d } from "~/lib/webGL/ogl.renderer/scene/shaders/noise3d";

export const noiseFrag = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 uId;
uniform float uTime;
uniform float uSeed;

in vec2 vUv;
out vec4 FragColor[2];

${noiseCommon}
${noise3d}
${csin}

void main() {
    // float noise = noise3d(vec3(vUv.x * 3. + uTime * 0.15, vUv.y * 2. + uTime * 0.05, uSeed + uTime * 0.15));
    // noise = mix(mix(0.05, 0.15, csin(uTime)), 1., clamp(noise, 0., 0.6) / 0.6);

    float fine = 5.;
    float coarse = 3.;
    float fineNoise = noise3d(vec3(vUv * fine, uTime * 0.2));
    float coarseNoise = noise3d(vec3(vUv * coarse, uTime * 0.1));

    fineNoise += noise3d(vec3(vUv.x * fine, vUv.y * fine - uTime * 0.3, uTime  * 0.2));
    coarseNoise += noise3d(vec3(vUv.x * coarse, vUv.y * coarse + uTime * 0.5, uTime  * 0.1));
    float noise = mix(fineNoise, coarseNoise, 0.5);
    noise = mix(mix(0.05, 0.15, csin(uTime)), 1., clamp(noise, 0., 0.6) / 0.6);


    vec3 color = vec3(noise);
    // vec4 color = texture;

    FragColor[0] = vec4(color.r, color.g, color.b, 1.);
    FragColor[1] = uId;
}
`