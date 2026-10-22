import type { ZipMemberFile } from "@/lib/library/api";
import { FILE_KIND_THEME, formatTypeLabel, getFileKind, type FileKind } from "@/lib/library/fileType";

function ThumbLines({ color }: { color: string }) {
  return (
    <div className="mt-2.5 flex w-full flex-col gap-1 px-0.5">
      <div className="h-1 w-full rounded-full opacity-40" style={{ backgroundColor: color }} />
      <div className="h-1 w-[85%] rounded-full opacity-30" style={{ backgroundColor: color }} />
      <div className="h-1 w-[70%] rounded-full opacity-20" style={{ backgroundColor: color }} />
    </div>
  );
}

function KindGlyph({ kind, color }: { kind: FileKind; color: string }) {
  if (kind === "xlsx") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <rect x="4" y="6" width="24" height="20" rx="2" fill={color} opacity="0.15" />
        <path d="M4 12h24M4 18h24M12 6v20" stroke={color} strokeWidth="1.5" fill="none" />
        <rect x="4" y="6" width="8" height="20" fill={color} opacity="0.35" />
      </svg>
    );
  }
  if (kind === "pdf") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path
          d="M8 4h12l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          fill={color}
          opacity="0.15"
        />
        <path d="M20 4v6h6" stroke={color} strokeWidth="1.5" fill="none" />
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill={color}
        >
          PDF
        </text>
      </svg>
    );
  }
  if (kind === "docx") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path
          d="M8 4h12l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          fill={color}
          opacity="0.15"
        />
        <path d="M20 4v6h6" stroke={color} strokeWidth="1.5" fill="none" />
        <path
          d="M10 20l2.5-8h2L17 20h-1.6l-.5-1.8h-2.8L11.6 20H10zm2.5-3h2.2l-1.1-3.6L12.5 17z"
          fill={color}
        />
      </svg>
    );
  }
  if (kind === "ppt") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <rect x="5" y="7" width="22" height="16" rx="2" fill={color} opacity="0.15" />
        <rect x="8" y="10" width="10" height="7" rx="1" fill={color} opacity="0.45" />
        <rect x="20" y="10" width="4" height="2" rx="0.5" fill={color} opacity="0.35" />
        <rect x="20" y="14" width="4" height="2" rx="0.5" fill={color} opacity="0.25" />
        <rect x="8" y="19" width="16" height="1.5" rx="0.5" fill={color} opacity="0.3" />
      </svg>
    );
  }
  if (kind === "py") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path
          d="M16 5c-4 0-5 2-5 5v3h6v1H9c-3 0-5 2-5 5s2 5 5 5h2v-3c0-3 2-5 5-5h5V10c0-3-2-5-5-5h0zm-2.5 2.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z"
          fill={color}
          opacity="0.85"
        />
        <path
          d="M16 27c4 0 5-2 5-5v-3h-6v-1h8c3 0 5-2 5-5s-2-5-5-5h-2v3c0 3-2 5-5 5h-5v3c0 3 2 5 5 5h0zm2.5-2.2a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"
          fill={color}
          opacity="0.45"
        />
      </svg>
    );
  }
  if (kind === "txt") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path
          d="M8 4h12l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          fill={color}
          opacity="0.12"
        />
        <path d="M20 4v6h6" stroke={color} strokeWidth="1.5" fill="none" />
        <path
          d="M10 15h12M10 19h10M10 23h8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <path
        d="M8 4h12l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        fill={color}
        opacity="0.15"
      />
      <path d="M20 4v6h6" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/** Visual file-type thumbnail for library cards / list rows */
export function FileTypeThumb({
  file,
  size = "lg",
}: {
  file: ZipMemberFile;
  size?: "lg" | "sm";
}) {
  const kind = getFileKind(file);
  const theme = FILE_KIND_THEME[kind];
  const label = formatTypeLabel(file);

  if (size === "sm") {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
        style={{
          backgroundColor: theme.soft,
          borderColor: `${theme.accent}22`,
          color: theme.accent,
        }}
        title={label}
      >
        <KindGlyph kind={kind} color={theme.accent} />
      </div>
    );
  }

  return (
    <div
      className="relative flex h-36 w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.soft }}
    >
      <div
        className="absolute inset-x-0 top-0 h-2"
        style={{ backgroundColor: theme.accent }}
      />
      <div className="flex w-full flex-1 flex-col items-center justify-center px-5 pt-3">
        <div className="scale-125">
          <KindGlyph kind={kind} color={theme.accent} />
        </div>
        <div className="mt-3 w-full max-w-[11rem]">
          <ThumbLines color={theme.accent} />
        </div>
      </div>
      <span
        className="mb-3 rounded-md px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white"
        style={{ backgroundColor: theme.accent }}
      >
        {label}
      </span>
    </div>
  );
}
