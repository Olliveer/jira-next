/** @format */

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
  dotShape?: "circle" | "square";
  dotOpacity?: number; // 0 to 1
}

export function DottedSeparator({
  className,
  color = "#d4d4d8",
  height = "2px",
  dotSize = "2px",
  gapSize = "6px",
  direction = "horizontal",
  dotShape = "circle",
  dotOpacity = 1,
}: Props) {
  const isHorizontal = direction === "horizontal";
  const size = `calc(${dotSize} + ${gapSize})`;
  const gradientShape = dotShape === "circle" ? "circle" : "";
  const alphaHex =
    dotOpacity < 1
      ? Math.round(dotOpacity * 255)
          .toString(16)
          .padStart(2, "0")
      : "";
  const dotColor = color + alphaHex;
  const backgroundImage = `repeating-radial-gradient(${gradientShape}, ${dotColor} 0 ${dotSize}, transparent ${dotSize} 100%)`;

  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
      role="separator"
      aria-orientation={isHorizontal ? "horizontal" : "vertical"}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage,
          backgroundSize: isHorizontal
            ? `${size} ${height}`
            : `${height} ${size}`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: isHorizontal ? "center left" : "top center",
        }}
      ></div>
    </div>
  );
}
