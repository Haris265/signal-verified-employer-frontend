import Image from "next/image";
import { cn } from "@/lib/cn";

type SpinnerProps = {
  className?: string;
  /** brand = circle ring + logo (admin portal); inline = compact ring for buttons */
  variant?: "brand" | "inline";
};

/** SignalVerified loader — spinning circle with logo centered inside (admin portal parity). */
export function Spinner({ className, variant = "brand" }: SpinnerProps) {
  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary",
          className
        )}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
      role="status"
      aria-label="Loading"
    >
      <span
        aria-hidden
        className="h-40 w-40 animate-spin rounded-full border-4 border-primary/30 border-t-primary-dark bg-white"
      />
      <Image
        src="/loader.png"
        alt=""
        width={120}
        height={120}
        className="absolute h-[7.5rem] w-[7.5rem] rounded-full object-contain shadow-lg"
        priority
      />
    </span>
  );
}
