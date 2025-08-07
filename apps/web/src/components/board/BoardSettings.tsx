import { Button } from "@acme/ui/button";

import { useBoard } from "../contexts/Board/BoardContextComponent";

const icons = {
  start: (
    <svg aria-hidden="true" data-glyph="arrow-chevron-start" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M6.07001 22H5.94001C4.34001 22 4.01001 21.67 4.01001 20.07V3.94C4.01001 2.34 4.34001 2.01 5.94001 2.01H6.07001C7.67001 2.01 8.00001 2.34 8.00001 3.94V20.07C8.00001 21.67 7.67001 22 6.07001 22ZM19.93 21.13L19.86 21.2C18.73 22.33 18.26 22.33 17.13 21.2L10.73 14.83C9.00001 13.06 9.00001 10.93 10.73 9.16L17.13 2.79C18.26 1.66 18.73 1.66 19.86 2.79L19.93 2.86C21.06 3.99 21.06 4.46 19.93 5.59L13.56 11.99L19.93 18.39C21.06 19.52 21.06 19.99 19.93 21.12V21.13Z"
      ></path>
    </svg>
  ),
  back: (
    <svg aria-hidden="true" data-glyph="arrow-chevron-left" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M16.27 21.13L16.2 21.2C15.07 22.33 14.6 22.33 13.47 21.2L7.06996 14.83C5.33996 13.06 5.33996 10.93 7.06996 9.16L13.47 2.79C14.6 1.66 15.07 1.66 16.2 2.79L16.27 2.86C17.4 3.99 17.4 4.46 16.27 5.59L9.89996 11.99L16.27 18.39C17.4 19.52 17.4 19.99 16.27 21.12V21.13Z"
      ></path>
    </svg>
  ),
  play: (
    <svg aria-hidden="true" data-glyph="media-control-play" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M20.5 12.8L7.77 21.53C6.5 22.43 6 22.16 6 20.6V3.32999C6 1.79999 6.5 1.52999 7.77 2.42999L20.5 11.2C21.33 11.77 21.33 12.23 20.5 12.8Z"
      ></path>
    </svg>
  ),
  next: (
    <svg aria-hidden="true" data-glyph="arrow-chevron-right" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M7.73007 2.87L7.80007 2.8C8.93007 1.67 9.40007 1.67 10.5301 2.8L16.9301 9.17C18.6601 10.94 18.6601 13.07 16.9301 14.84L10.5301 21.21C9.40007 22.34 8.93007 22.34 7.80007 21.21L7.73007 21.14C6.60007 20.01 6.60007 19.54 7.73007 18.41L14.1001 12.01L7.73007 5.61C6.60007 4.48 6.60007 4.01 7.73007 2.88V2.87Z"
      ></path>
    </svg>
  ),
  end: (
    <svg aria-hidden="true" data-glyph="arrow-chevron-end" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M17.9299 2H18.0599C19.6599 2 19.9899 2.33 19.9899 3.93V20.06C19.9899 21.66 19.6599 21.99 18.0599 21.99H17.9299C16.3299 21.99 15.9999 21.66 15.9999 20.06V3.93C15.9999 2.33 16.3299 2 17.9299 2ZM4.06991 2.87L4.13991 2.8C5.26991 1.67 5.73991 1.67 6.86991 2.8L13.2699 9.17C14.9999 10.94 14.9999 13.07 13.2699 14.84L6.86991 21.21C5.73991 22.34 5.26991 22.34 4.13991 21.21L4.06991 21.14C2.93991 20.01 2.93991 19.54 4.06991 18.41L10.4399 12.01L4.06991 5.61C2.93991 4.48 2.93991 4.01 4.06991 2.88V2.87Z"
      ></path>
    </svg>
  ),
  reload: (
    <svg aria-hidden="true" data-glyph="arrow-spin-redo" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M11 22.47C4.93 22.47 0.5 17.6 0.5 12C0.5 6.07 5.3 1.5 11 1.5C13.7 1.5 16.37 2.53 18.43 4.57L19.9 6.04L17.77 8.17L16.3 6.7C14.83 5.23 12.9 4.5 11 4.5C6.87 4.5 3.5 7.87 3.5 12C3.5 16.13 6.87 19.5 11 19.5C13.57 19.5 15.53 18.33 17.03 16.5C17.63 15.67 18.2 15.57 19.06 16.13L19.16 16.23C20.03 16.8 20.13 17.36 19.53 18.2C17.43 20.83 14.63 22.47 11 22.47ZM22.8 4.6L23.13 10.17C23.2 11.2 22.83 11.57 21.8 11.5L16.23 11.17C15.3 11.1 15.16 10.67 15.8 10.04L21.67 4.17C22.3 3.54 22.74 3.67 22.8 4.6Z"
      ></path>
    </svg>
  ),
  flip: (
    <svg aria-hidden="true" data-glyph="arrow-triangle-flip-vertical" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M18 8.13C18 6.53 17.47 6 15.87 6H13.44C12.41 6 12.01 5.6 12.01 4.57V4.44C12.01 3.41 12.41 3.01 13.44 3.01H15.67C19.67 3.01 21 4.34 21 8.34V17.17H18V8.13ZM10.57 21H8.34C4.34 21 3.01 19.67 3.01 15.67V6.84H6.01V15.87C6.01 17.47 6.54 18 8.14 18H10.57C11.6 18 12 18.4 12 19.43V19.56C12 20.59 11.6 20.99 10.57 20.99V21ZM0.429999 5.83L3.63 1.76C4.3 0.929997 4.76 0.929997 5.43 1.76L8.63 5.86C9.2 6.56 8.96 6.99 8.06 6.99H0.989999C0.0599991 6.99 -0.140001 6.56 0.419999 5.82L0.429999 5.83ZM23.57 18.17L20.37 22.24C19.7 23.07 19.24 23.07 18.57 22.24L15.37 18.14C14.8 17.44 15.04 17.01 15.94 17.01H23.01C23.94 17.01 24.14 17.44 23.58 18.18L23.57 18.17Z"
      ></path>
    </svg>
  ),
  share: (
    <svg aria-hidden="true" data-glyph="graph-nodes-share" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M19 8.5C17 8.5 15.5 7 15.5 5C15.5 3 17 1.5 19 1.5C21 1.5 22.5 3 22.5 5C22.5 7 21 8.5 19 8.5ZM5 15.5C3 15.5 1.5 14 1.5 12C1.5 10 3 8.5 5 8.5C7 8.5 8.5 10 8.5 12C8.5 14 7 15.5 5 15.5ZM19 22.5C17 22.5 15.5 21 15.5 19C15.5 17 17 15.5 19 15.5C21 15.5 22.5 17 22.5 19C22.5 21 21 22.5 19 22.5ZM5.45 11.11L19.45 18.11L18.56 19.9L4.56 12.9L5.45 11.11ZM19.45 5.89L5.45 12.89L4.56 11.1L18.56 4.1L19.45 5.89Z"
      ></path>
    </svg>
  ),
};

export function BoardSettings() {
  const {
    reloadGame,
    boardFunctions: { doMove, undoMove, goEnd, goStart, setFlip },
  } = useBoard();
  return (
    <div className="space-y-3 bg-black/15 p-3 dark:fill-white/80 [&_svg]:size-6">
      <div className="flex gap-2">
        <Button className="h-12 flex-1 bg-white/15 text-xl hover:bg-white/10" onClick={goStart}>
          {icons.start}
        </Button>
        <Button className="h-12 flex-1 bg-white/15 text-xl hover:bg-white/10" onClick={undoMove}>
          {icons.back}
        </Button>
        <Button className="h-12 flex-1 bg-white/15 text-xl hover:bg-white/10">{icons.play}</Button>
        <Button className="h-12 flex-1 bg-white/15 text-xl hover:bg-white/10" onClick={doMove}>
          {icons.next}
        </Button>
        <Button className="h-12 flex-1 bg-white/15 text-xl hover:bg-white/10" onClick={goEnd}>
          {icons.end}
        </Button>
      </div>
      <div className="flex justify-between dark:fill-white/60">
        <div>
          <Button variant="ghost" className="p-0 px-2" onClick={reloadGame}>
            {icons.share}
          </Button>
        </div>
        <div>
          <Button variant="ghost" className="p-0 px-2" onClick={reloadGame}>
            {icons.reload}
          </Button>
          <Button
            variant="ghost"
            className="p-0 pl-2 text-xl"
            onClick={() => {
              setFlip((flip) => (flip === "w" ? "b" : "w"));
            }}
          >
            {icons.flip}
          </Button>
        </div>
      </div>
    </div>
  );
}
