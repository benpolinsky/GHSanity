import { createContext } from "react";
import { initialState, State } from "./AppReducer";

export const AppContext = createContext<State>(initialState);
export const AppDispatchContext = createContext<any>(null);