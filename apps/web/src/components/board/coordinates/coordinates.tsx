import type { Color } from "chess.js";

const Coordinates: React.FC<{ flip: Color }> = (props) => {
  const { flip } = props;
  const ranks: number[] = flip !== "w" ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const ranksLoc: number[] = [3.5, 15.75, 28.25, 40.75, 53.25, 65.75, 78.25, 90.75];
  const files: string[] = flip === "b" ? ["h", "g", "f", "e", "d", "c", "b", "a"] : ["a", "b", "c", "d", "e", "f", "g", "h"];
  const filesLoc: number[] = [10, 22.5, 35, 47.5, 60, 72.5, 85, 97.5];
  return (
    <svg viewBox="0 0 100 100" className="absolute left-0 top-0 select-none">
      {ranks.map((_, i) => (
        <text
          key={i}
          x="0.75" // Center the text horizontally
          y={ranksLoc[i]}
          fontSize="2.8"
          className={i % 2 === 0 ? "fill-[#000000]" : "fill-[#ffffff]"}
        >
          {ranks[i]}
        </text>
      ))}
      {files.map((letter, i) => (
        <text
          key={i}
          x={filesLoc[i]} // Center the text horizontally
          y="99"
          fontSize="2.8"
          className={i % 2 !== 0 ? "fill-[#000000]" : "fill-[#ffffff]"}
        >
          {files[i]}
        </text>
      ))}
    </svg>
  );
};

export default Coordinates;
