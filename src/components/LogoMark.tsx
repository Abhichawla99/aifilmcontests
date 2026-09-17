// Logo mark: flat indigo film frame, corner perforations, white play triangle.
// Flat since 2026-09-14; the indigo-to-violet gradient was a dark-theme leftover.
// Shared by the homepage header (2026-09-17) and InnerLayout's header and footer,
// so the two headers draw the same mark instead of two near-copies.
export default function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="30" height="30" rx="7" fill="#4F46E5" />
      {/* Perforation marks */}
      <rect x="3" y="4" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="3" y="11" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="3" y="18" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="24" y="4" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="24" y="11" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="24" y="18" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      {/* Play triangle */}
      <polygon points="12,9 22,15 12,21" fill="white" />
    </svg>
  )
}
