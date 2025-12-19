export function getProgressTheme(progress) {
  if (progress === 0) {
    return {
      bar: "bg-red-500",
      text: "text-red-500",
      stroke: "stroke-red-500",
      glow: "bg-red-400/30",
    };
  }

  if (progress === 100) {
    return {
      bar: "bg-green-500",
      text: "text-green-500",
      stroke: "stroke-green-500",
      glow: "bg-green-400/40 animate-pulse",
    };
  }

  if (progress >= 70) {
    return {
      bar: "bg-blue-500",
      text: "text-blue-500",
      stroke: "stroke-blue-500",
      glow: "bg-blue-400/30",
    };
  }

  if (progress >= 40) {
    return {
      bar: "bg-yellow-400",
      text: "text-yellow-500",
      stroke: "stroke-yellow-500",
      glow: "bg-yellow-400/30",
    };
  }

  return {
    bar: "bg-orange-500",
    text: "text-orange-500",
    stroke: "stroke-orange-500",
    glow: "bg-orange-400/30",
  };
}
