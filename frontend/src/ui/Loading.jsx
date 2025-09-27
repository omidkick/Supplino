"use client";

import { ThreeDots } from "react-loader-spinner";

function Loading({ width = "75", height = "40", color = "#4a6dff" }) {
  return (
    <ThreeDots
      height={height}
      width={width}
      radius="9"
      color="#4a6dff"
      ariaLabel="three-dots-loading"
      wrapperStyle={{
        display: "flex",
        justifyContent: "center",
      }}
      visible={false}
    />
  );
}
export default Loading;
