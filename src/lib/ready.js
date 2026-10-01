import { createContext, useContext } from "react";

// True once the preloader has started lifting, so the hero can play its intro.
export const ReadyContext = createContext(true);

export const useReady = () => useContext(ReadyContext);
