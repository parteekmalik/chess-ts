import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cva } from "class-variance-authority";

import { cn } from ".";

const toastVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-primary bg-background text-primary shadow hover:text-primary/80",
        destructive: "border-destructive text-destructive shadow hover:text-destructive/80",
        success: "border-green-600 text-green-600 shadow hover:text-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {}

export function Toast({ children, className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        toastVariants({ variant }),
        "animate-slidein relative m-[0px_10px_10px_0px] flex max-w-[400px] flex-col items-start rounded border-[0.677px] border-l-[20px] bg-background p-[10px_20px_15px_15px]",
        className,
      )}
      style={{ wordWrap: "break-word" }}
      {...props}
    >
      {children}
    </div>
  );
}
export function ToastHeader({ children, ...props }: { children?: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("m-[5px_0px_10px_0px] text-[16px] font-bold", props.className)} {...props}>
      {children}
    </div>
  );
}
export function ToastContent({ children, ...props }: { children?: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}
