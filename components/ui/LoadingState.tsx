import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

/** Centered page loader — spinning circle + logo (admin portal parity). */
export function LoadingState({
  className,
  fullScreen = false,
}: {
  className?: string;
  fullScreen?: boolean;
}) {
  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm",
          className
        )}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center py-12", className)}>
      <Spinner />
    </div>
  );
}
