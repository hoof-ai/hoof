// Spotlight functionality taken from tauri-macos-spotlight-example
// https://github.com/ahkohd/tauri-macos-spotlight-example/blob/main/src/hooks/useEscape.tsx
// Copyright 2022 Victor Aremu - MIT Licensed
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";

const useEscape = () => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      invoke("hide_spotlight");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);
};

export default useEscape;
