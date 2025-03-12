import { ActionDispatch, createContext } from "react";
import { action, initialState, State } from "./AppReducer";

export const AppContext = createContext<State>(initialState);
export const AppDispatchContext = createContext<
  ActionDispatch<[action: action]>
>(() => {});
