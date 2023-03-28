import { useEffect, useState } from "react";

export function useGameState<T>(getState: ()=>T, screenUpdater: EventTarget) {
    const [state, setState] = useState(getState());
    useEffect(() => {
        const listener = () => setState(getState());
        screenUpdater.addEventListener('updated', listener);
        return () => {
            screenUpdater.removeEventListener('updated', listener);
        }
    }, []);
    return state;
} 