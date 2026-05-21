"use client";

import { useEffect, useRef } from "react";

const useTradingViewWidget = (scriptUrl, config, height = 600) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent duplicate widget loading
    if (containerRef.current.dataset.loaded) return;

    containerRef.current.innerHTML = `
      <div 
        class="tradingview-widget-container__widget" 
        style="width:100%; height:${height}px"
      ></div>
    `;

    const script = document.createElement("script");

    script.src = scriptUrl;
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      ...config,
      height,
    });

    script.onload = () => {
      containerRef.current.dataset.loaded = "true";
    };

    script.onerror = () => {
      delete containerRef.current.dataset.loaded;
    };

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        delete containerRef.current.dataset.loaded;
      }
    };
  }, [scriptUrl, config, height]);

  return containerRef;
};

export default useTradingViewWidget;
