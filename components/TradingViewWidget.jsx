"use client";

import useTradingViewWidget from "@/hooks/useTradingVeiwWidget";
import React, { memo } from "react";

function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height = 600,
  className = "",
}) {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-semibold text-2xltext-gray-100 mb-5">{title}</h3>
      )}
      <div
        className={`tradingview-widget-container ${className}`}
        ref={containerRef}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{
            height,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
