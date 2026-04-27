type IconName =
  | 'home' | 'search' | 'bell' | 'user' | 'plus' | 'heart' | 'paw'
  | 'pin' | 'calendar' | 'stethoscope' | 'shield' | 'scissors' | 'walk'
  | 'chat' | 'star' | 'arrow' | 'check' | 'x' | 'syringe' | 'cart'
  | 'filter' | 'eye' | 'lock' | 'building' | 'menu' | 'bookmark' | 'share'
  | 'logout' | 'edit' | 'trash' | 'upload' | 'image' | 'file' | 'qr'

interface IconProps {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

const paths: Record<IconName, React.ReactNode> = {
  home: <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
  bell: <><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  heart: <path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11z"/>,
  paw: (
    <>
      <ellipse cx="5" cy="10" rx="2" ry="2.5"/>
      <ellipse cx="19" cy="10" rx="2" ry="2.5"/>
      <ellipse cx="9" cy="5" rx="2" ry="2.5"/>
      <ellipse cx="15" cy="5" rx="2" ry="2.5"/>
      <path d="M12 12c-3 0-6 3-6 6a3 3 0 003 3c1 0 2-1 3-1s2 1 3 1a3 3 0 003-3c0-3-3-6-6-6z"/>
    </>
  ),
  pin: <><path d="M12 22s7-7 7-12a7 7 0 00-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
  stethoscope: (
    <>
      <path d="M6 3v6a4 4 0 008 0V3"/>
      <path d="M10 14c0 4 3 7 7 7s4-3 4-5"/>
      <circle cx="21" cy="13" r="2"/>
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/>,
  scissors: (
    <>
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4" r="2"/>
      <path d="M13 8l-2 5 3 3v5M11 13L8 16l1 5M14 13l3-1 2 3"/>
    </>
  ),
  chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/>,
  star: <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z"/>,
  arrow: <path d="M5 12h14M13 5l7 7-7 7"/>,
  check: <path d="M5 12l5 5L20 7"/>,
  x: <path d="M6 6l12 12M18 6L6 18"/>,
  syringe: (
    <>
      <path d="M18 2l4 4M16 4l4 4-9 9-4 1 1-4 8-8z"/>
      <path d="M10 14l-5 5-1-1"/>
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="21" r="1.5"/>
      <circle cx="18" cy="21" r="1.5"/>
      <path d="M3 3h3l2.7 12.5a2 2 0 002 1.5h8a2 2 0 002-1.5L23 7H6"/>
    </>
  ),
  filter: <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>,
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1"/>
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"/>
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3z"/>,
  share: (
    <>
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>
    </>
  ),
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></>,
  edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
  upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
  file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <path d="M14 14h3v3M20 14v7M14 20h3"/>
    </>
  ),
}

export default function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  )
}
