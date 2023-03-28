import { useEffect, useRef, useState } from "react";

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
export function useFocusedRef() {
    const ref = useRef(null as EventTarget | null);
    useEffect(() => {
        document.addEventListener('focusin', (e) => {
            ref.current = e.target;
        });
        document.addEventListener('focusout', (e) => {
            ref.current = null;
        }
        );
    }, []);
    return ref;
}
export function useDOMEvent<T extends keyof DocumentEventMap>(eventName: T, listener: (e) => void) {
    useEffect(() => {
        document.addEventListener(eventName, listener);
        return () => {
            document.removeEventListener(eventName, listener);
        }
    }, []);
}