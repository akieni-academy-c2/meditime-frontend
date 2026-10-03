const symbols = {
  general: <>
    <path d="M8 5v7a6 6 0 0 0 12 0V5" fill="#ddd1ff" stroke="#6935d3" />
    <path d="M14 18v4a5 5 0 0 0 10 0v-3" fill="none" stroke="#6935d3" />
    <rect x="5" y="3" width="5" height="6" rx="2" fill="#9c7ce8" stroke="none" />
    <rect x="18" y="3" width="5" height="6" rx="2" fill="#9c7ce8" stroke="none" />
    <circle cx="24" cy="17" r="4" fill="#69cfc2" stroke="#27786f" />
    <circle cx="24" cy="17" r="1.3" fill="#27786f" stroke="none" />
  </>,
  skin: <>
    <rect x="3" y="12" width="26" height="16" rx="4" fill="#f5b799" stroke="#a35443" />
    <path d="M4 19c3-3 5 3 8 0s5 3 8 0 5 3 8 0" fill="none" stroke="#d67f68" />
    <path d="M4 13c3-3 5 3 8 0s5 3 8 0 5 3 8 0" fill="none" stroke="#a35443" />
    <circle cx="12" cy="9" r="6" fill="#eadfff" stroke="#6935d3" />
    <circle cx="10.5" cy="8" r="1" fill="#bd8a78" stroke="none" />
    <circle cx="14" cy="10" r="1.4" fill="#bd8a78" stroke="none" />
    <path d="m17 13 4 4" fill="none" stroke="#6935d3" strokeWidth="3" />
  </>,
  child: <>
    <circle cx="16" cy="17" r="11" fill="#e9bc91" stroke="#a36a43" />
    <path d="M14 6c0-4 6-4 5-1-.3 1-1.5 1.7-3 1" fill="none" stroke="#a36a43" />
    <circle cx="12" cy="16" r="1.3" fill="#5c3d32" stroke="none" />
    <circle cx="20" cy="16" r="1.3" fill="#5c3d32" stroke="none" />
    <circle cx="9" cy="20" r="2" fill="#ec9f8e" stroke="none" />
    <circle cx="23" cy="20" r="2" fill="#ec9f8e" stroke="none" />
    <ellipse cx="16" cy="22" rx="4" ry="3" fill="#ddd1ff" stroke="#6935d3" />
    <path d="M14 22h4" stroke="#6935d3" />
  </>,
  heart: <>
    <path d="M16 28 5 17C-3 8 9-1 16 8c7-9 19 0 11 9Z" fill="#ef8caa" stroke="#a63b62" />
    <path d="M5 16h6l3-5 4 11 3-6h6" fill="none" stroke="white" strokeWidth="2.2" />
  </>,
};

export default function SpecialtyIcon({ kind, size = 36 }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{symbols[kind]}</svg>;
}
