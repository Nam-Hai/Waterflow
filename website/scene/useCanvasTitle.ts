import { createContext } from "~/../src/util/apiInject";
import CanvasTitle from "./CanvasTitle";

export const [provideCanvasTitle, useCanvasTitle] = createContext<CanvasTitle>('canvas-title');
