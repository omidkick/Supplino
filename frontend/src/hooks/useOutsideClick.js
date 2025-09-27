"use client";
import { useEffect, useRef } from "react";

export default function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClick, listenCapturing);
    }

    return () => {
      if (typeof document !== "undefined") {
        return document.removeEventListener(
          "click",
          handleClick,
          listenCapturing
        );
      }
    };
  }, [handler, listenCapturing]);

  return ref;
}


