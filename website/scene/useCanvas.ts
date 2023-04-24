import { createContext } from "~/../src/util/apiInject";
import Canvas from "./canvas";

export const [provideCanvas, useCanvas] = createContext<Canvas>('canvas');
