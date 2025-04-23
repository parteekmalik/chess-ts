import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function InfoHover({
  children,
  info,
  options = { position: "center", isHoverEnabled: true },
}: {
  info: string | ReactNode;
  children?: ReactNode;
  options?: {
    isClickEnabled?: boolean;
    isHoverEnabled?: boolean;
    isHoverEnabledOnChild?: boolean;
    paddingFromTop?: number | string;
    position?: "center" | "left" | "right";
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const iframes = document.querySelectorAll("iframe");
    const iframePointerEventsCache: string[] = [];

    // Disable pointer events on all iframe elements
    iframes.forEach((iframe) => {
      iframePointerEventsCache.push(iframe.style.pointerEvents);
      iframe.style.pointerEvents = "none";
    });

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      console.log(event);
      setIsOpen(false);
      setIsTooltipVisible(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Restore pointer events on cleanup
      iframes.forEach((iframe, index) => {
        iframe.style.pointerEvents = iframePointerEventsCache[index] ?? "auto";
      });
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (options?.isHoverEnabled) {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (options?.isHoverEnabled) {
      setIsTooltipVisible(false);
    }
  };

  return (
    <div className="relative touch-none">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={options?.isClickEnabled ? () => setIsOpen((prev) => !prev) : () => setIsTooltipVisible(false)}
      >
        {info}
      </div>
      <div
        className={twMerge(
          isOpen || isTooltipVisible ? "visible" : "invisible",
          options.position === "right" ? "right-0" : options.position === "left" ? "left-0" : "left-1/2 -translate-x-1/2",
          "absolute top-full flex flex-col items-center p-2 pt-0 text-background",
        )}
        style={{ zIndex: 101, paddingTop: options?.paddingFromTop }}
        onClick={() => setIsOpen(false)}
        onMouseEnter={options?.isHoverEnabledOnChild ? handleMouseEnter : undefined}
        onMouseLeave={options?.isHoverEnabledOnChild ? handleMouseLeave : undefined}
      >
        {typeof children === "string" ? <span className="mt-3 text-nowrap rounded-md bg-foreground px-2">{children}</span> : children}
      </div>
    </div>
  );
}

export default InfoHover;
