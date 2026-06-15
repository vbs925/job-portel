"use client";

import Home from "../page";
import { useEffect } from "react";

export default function DarkRoute() {
  useEffect(() => {
    document.body.classList.add("dark-mode-override");
    return () => {
      document.body.classList.remove("dark-mode-override");
    };
  }, []);

  return (
    <>
      <style>{`
        .dark-mode-override {
          --background: #0a0a0a;
          --foreground: #ffffff;
          background-color: var(--background);
          color: var(--foreground);
        }
      `}</style>
      <Home />
    </>
  );
}
