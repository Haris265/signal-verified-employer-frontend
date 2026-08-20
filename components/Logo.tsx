import Image from "next/image";

export function Logo({
  className = "",
  height = 32,
}: {
  className?: string;
  light?: boolean;
  height?: number;
}) {
  const width = Math.round(height * (1140 / 629));
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/brand/signalverified-logo.png"
        alt="SignalVerified"
        width={width}
        height={height}
        className="h-full w-auto object-contain"
        style={{ height, width: "auto" }}
        priority
      />
    </span>
  );
}
