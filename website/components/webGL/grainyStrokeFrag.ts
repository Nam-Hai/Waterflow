import { csin, shaderEase } from "~/lib/webGL/ogl.renderer/scene/shaders/math";

export const grainyStrokeFrag = /* glsl */ `#version 300 es
precision mediump float;

uniform vec4 uId;
uniform sampler2D tMap;
uniform float uTime;
uniform float uSeed;

in vec2 vUv;
out vec4 FragColor[2];

float random(vec2 uv) {
    return fract(sin(dot(uv.xy / 1000., vec2(12.9898, 78.233))) * 43758.5453123);
}

${csin}
${shaderEase.i1}
${shaderEase.io2}
${shaderEase.i5}
${shaderEase.o5}

void main() {
    vec4 texture = texture(tMap, vUv);
    // float nf = noise3d(vec3(vUv.x, vUv.y, uTime * 0.4)) * 2.;
    float grayscale = texture.r;

    // float a = mix(0.5, 1., (sin(uTime * .1 + uSeed) + 1.) * 0.5);
    float a = .5;

    float stroke = 0.;
    int iteration = 1;
    for(int i=0;i<iteration;++i)
    {
        float linePattern =  mod(vUv.x * 20.0 + vUv.y * 50.0 + float(i) * a / float(iteration), a);
        // linePattern = mix(linePattern, io2(linePattern), csin(uTime));
        // linePattern = o5(linePattern);


        float noise = random(floor(gl_FragCoord.xy));

        // float stroke = step(linePattern * 1. + mix(0.4, 1., csin(uTime)) * 1. * noise * 0.5, 1. - io2(grayscale));
        // float stroke = step(linePattern * 1. + mix(0., 1., csin(uTime)) * 1. * noise * 0.5, 1. - grayscale);
        stroke += step(clamp(linePattern * 1. + noise * linePattern * 0., 0., 1.), 1. -  grayscale);
    }

    vec4 color = vec4(vec3(stroke), 1.0);

    // FragColor[0] = vec4(nf, nf, nf, 1.);
    FragColor[0] = color;
    FragColor[1] = uId;
}
`