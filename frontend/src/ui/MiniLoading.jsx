"use client";

import { ThreeDots } from "react-loader-spinner";

function MiniLoading({ width = "40", height = "20", color = "#ffffff" }) {
  return (
    <ThreeDots
      height={height}
      width={width}
      radius="6"
      color={color}
      ariaLabel="mini-loading"
      wrapperStyle={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      visible={true}
    />
  );
}

export default MiniLoading;