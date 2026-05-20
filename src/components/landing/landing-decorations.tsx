/** Hand-drawn accent SVGs matching reference scrapbook style */

export function SketchArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M42 12H8M8 12L14 6M8 12L14 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SketchArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 12H40M40 12L34 6M40 12L34 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SketchLeaves({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="64"
      height="40"
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 28C4 20 6 8 16 6C12 14 10 22 8 28Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M32 32C28 22 30 10 42 8C38 18 34 26 32 32Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M52 24C50 16 54 8 60 10C56 16 54 20 52 24Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M20 34 Q24 30 28 34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SketchBranch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="48"
      viewBox="0 0 120 48"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 40 Q30 8 60 24 T116 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="28" cy="18" rx="8" ry="5" fill="currentColor" opacity="0.5" />
      <ellipse cx="72" cy="14" rx="7" ry="4" fill="currentColor" opacity="0.45" />
      <ellipse cx="98" cy="16" rx="6" ry="4" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function PlayCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <path d="M17 14L27 20L17 26V14Z" fill="currentColor" />
    </svg>
  );
}
