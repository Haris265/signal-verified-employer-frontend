import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "rounded-md px-3 py-1.5 text-xs",
        size === "md" && "rounded-lg px-4 py-2.5 text-sm",
        size === "lg" && "rounded-lg px-5 py-3 text-sm uppercase tracking-wide",
        variant === "primary" && "bg-primary text-white hover:bg-primary-dark",
        variant === "secondary" &&
          "border border-primary/25 bg-white/60 text-primary hover:border-primary/50 hover:bg-white/80",
        variant === "ghost" && "text-primary hover:bg-primary/5",
        variant === "danger" && "bg-destructive text-white hover:bg-destructive/90",
        className
      )}
      {...props}
    />
  );
}
