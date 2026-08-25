import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "font-sans uppercase text-button inline-flex items-center justify-center border border-black transition-colors disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-white hover:text-black",
        secondary: "bg-white text-black hover:bg-black hover:text-white",
        ghost: "border-transparent hover:border-black",
      },
      size: {
        md: "px-6 py-3",
        sm: "px-4 py-2",
        full: "w-full px-6 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(button({ variant, size }), className)} {...props} />
  );
}
