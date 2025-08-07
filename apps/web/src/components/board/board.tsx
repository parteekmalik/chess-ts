"use client";

import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";

import { cn } from "@acme/ui";

import { useBoard } from "../contexts/Board/BoardContextComponent";
import Coordinates from "./coordinates/coordinates";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import Highlight from "./piece and hints/highlight";

const icons = {
  winner: (
    <svg xmlns="http://www.w3.org/2000/svg" className="winner-icon" width="70%" height="70%" viewBox="0 0 18 19">
      <g id="winner">
        <path
          d="m 24.4334,39.6517 c 15.9034,0 22.8584,-4.7017 22.8584,-4.7017 l 0.975,-23.6167 c 0,-2.16663 -1.495,-2.79497 -3.25,-1.4083 L 34.1834,17.53 26.6868,2.66667 C 26.0151,0.911667 25.1484,0.5 24.5201,0.5 23.8918,0.5 22.9384,0.955 22.3534,2.66667 L 14.6834,17.53 3.85008,9.925 C 2.09508,8.53833 0.513416,9.16667 0.600083,11.3333 L 1.57508,34.95 c 0,0 6.955,4.55 22.85832,4.7017 z"
          fill="white"
          style={{ fill: "#ffffff", fillOpacity: 1 }}
          id="path1"
          transform="matrix(0.25173118,0,0,0.25173118,2.8497971,2.8741344)"
        ></path>
      </g>
    </svg>
  ),
  loser: (
    <svg xmlns="http://www.w3.org/2000/svg" className="loser-icon" width="70%" height="70%" viewBox="0 0 18 19">
      <g id="timeout">
        <path
          d="M 14.53306,6.65985 C 14.23406,5.94735 13.79936,5.29981 13.25316,4.75326 12.70156,4.20841 12.05256,3.77198 11.33986,3.46665 10.60046,3.15154 9.8037904,2.99267 9.0000004,3 8.1941504,2.99365 7.3955404,3.15247 6.65343,3.46665 5.94521,3.77288 5.30075,4.2093 4.75351,4.75326 4.2073,5.29981 3.77259,5.94735 3.47357,6.65985 3.15336,7.39796 2.99209,8.19521 3.00026,8.99975 c -0.00817,0.80451 0.1531,1.60181 0.47331,2.33991 0.29902,0.7125 0.73373,1.36 1.27994,1.9066 0.54921,0.5446 1.19599,0.9811 1.90659,1.2866 0.7400404,0.3133 1.5362904,0.4721 2.3399004,0.4666 0.80154,0.0064 1.5958596,-0.1524 2.3332596,-0.4666 0.7126,-0.3053 1.3616,-0.7418 1.9132,-1.2866 0.5462,-0.5466 0.981,-1.1941 1.28,-1.9066 0.317,-0.7391 0.4781,-1.5357 0.4733,-2.33991 0.0069,-0.80376 -0.1519,-1.60031 -0.4667,-2.3399 z m -1.6599,3.99981 c -0.4273,1.0054 -1.2278,1.806 -2.2332,2.2333 -0.5154,0.2234 -1.0716196,0.3369 -1.6332896,0.3333 -0.5659,0.0028 -1.12634,-0.1107 -1.6466,-0.3333 C 6.35339,12.45616 5.55527,11.64606 5.1335,10.63296 4.91346,10.11656 4.80003,9.56106 4.80003,8.99975 c 0,-0.56133 0.11343,-1.11687 0.33347,-1.63327 0.42744,-1.00301 1.22484,-1.8028 2.2265704,-2.23324 0.5182,-0.22176 1.07628,-0.33519 1.63993,-0.33331 0.5616,-0.00287 1.1176596,0.11062 1.6332596,0.33331 1.0054,0.42728 1.806,1.22782 2.2332,2.23324 0.2201,0.5164 0.3335,1.07194 0.3335,1.63327 0,0.56131 -0.1134,1.11681 -0.3335,1.63321 z"
          fill="white"
          style={{ fill: "#ffffff", fillOpacity: 1 }}
          id="path1"
        ></path>
        <path
          d="M 11.03326,10.50636 9.5666404,9.03975 V 6.70651 c 0.0025,-0.07769 -0.01099,-0.15507 -0.03966,-0.22732 -0.02867,-0.07225 -0.0719,-0.13783 -0.127,-0.19266 -0.05063,-0.05599 -0.11231,-0.10089 -0.18115,-0.13187 -0.06884,-0.03098 -0.14335,-0.04737 -0.21883,-0.04812 h -0.59998 c -0.07966,-9.1e-4 -0.15866,0.0146 -0.23206,0.04557 -0.07341,0.03096 -0.13964,0.07672 -0.19458,0.13442 -0.05599,0.0545 -0.10024,0.11987 -0.13005,0.19209 -0.0298,0.07222 -0.04453,0.14977 -0.04328,0.22789 v 2.82655 c -6.3e-4,0.079 0.01435,0.1574 0.0441,0.2306 0.02974,0.0732 0.07366,0.1398 0.12923,0.196 l 1.81325,1.82 c 0.05533,0.0572 0.12162,0.1028 0.19492,0.1339 0.07331,0.0311 0.1521096,0.0471 0.2317096,0.0471 0.0796,0 0.1585,-0.016 0.2317,-0.0471 0.0733,-0.0311 0.1396,-0.0767 0.195,-0.1339 l 0.42,-0.42 c 0.0572,-0.0553 0.1027,-0.1216 0.1338,-0.1949 0.0311,-0.0733 0.0472,-0.1521 0.0472,-0.2318 0,-0.0796 -0.0161,-0.1584 -0.0472,-0.2317 -0.0311,-0.0733 -0.0766,-0.1396 -0.1338,-0.1949 z"
          fill="white"
          style={{ fill: "#ffffff", fillOpacity: 1 }}
          id="path2"
        ></path>
      </g>
    </svg>
  ),
};
export interface BoardProps {
  className?: string;
  blackBar?: React.ReactNode;
  whiteBar?: React.ReactNode;
}

export const ChessBoardWrapper: React.FC<BoardProps> = ({ whiteBar, blackBar, className }) => {
  const { PieceLogic, lastMove, playerTurn, flip, game, selectedPiece, movesUndone, result } = useBoard();
  const style = { width: `min(100%,calc(100vh ${whiteBar ? "- 96px" : ""} - 3rem))` };
  const boardRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={cn("mx-auto flex h-[calc(100vh-3rem)] flex-col gap-2", className)} style={style}>
      {flip === "w" ? blackBar : whiteBar}
      <div className="flex-1" style={style}>
        <div
          className={twMerge(`relative aspect-square`)}
          style={{
            backgroundImage: `url('/images/blank_board_img.png')`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
          onClick={PieceLogic}
          ref={boardRef}
        >
          {(result?.winner === "BLACK" || result?.winner === "WHITE") && !movesUndone.length && (
            <>
              <span
                className="absolute z-10 flex h-[5%] w-[5%] items-center justify-center rounded-full bg-primary [&_svg]:size-6"
                style={{
                  transform: scaleTranslate(boardRef.current?.querySelector<HTMLElement>(result.winner === "BLACK" ? ".bk" : ".wk")!.style.transform),
                }}
              >
                {icons.winner}
              </span>
              <span
                className="absolute z-10 flex h-[5%] w-[5%] items-center justify-center rounded-full bg-red-500 [&_svg]:size-6"
                style={{
                  transform: scaleTranslate(boardRef.current?.querySelector<HTMLElement>(result.winner === "WHITE" ? ".bk" : ".wk")!.style.transform),
                }}
              >
                {icons.loser}
              </span>
            </>
          )}
          <Coordinates flip={flip} />
          <Highlight selectedPiece={selectedPiece} flip={flip} lastMove={lastMove} />
          <ChessBoard game={flip === "w" ? game.board() : game.board().reverse()} />
          {playerTurn === game.turn() && selectedPiece && !movesUndone.length && (
            <ChessBoardHints game={game} selectedPiece={selectedPiece} flip={flip} />
          )}
        </div>
      </div>
      {flip === "w" ? whiteBar : blackBar}
    </div>
  );
};

function scaleTranslate(str?: string, factor = 2.5): string | undefined {
  let matchCount = 0;

  return str?.replace(/-?\d+\.?\d*/g, (match) => {
    const num = parseFloat(match);
    let result: number;

    if (matchCount === 0) {
      result = num * factor + 100 * factor - 50;
    } else {
      result = num * factor - 50;
    }

    result = Math.max(0, Math.min(result, factor * 100 * 7));
    matchCount++;
    return result.toString();
  });
}
