import type { ReactNode } from 'react'

export type IconName =
  | 'back'
  | 'sound'
  | 'chart'
  | 'plus'
  | 'arrow'
  | 'close'
  | 'menu'
  | 'check'
  | 'wifi'
  | 'share'

const paths: Record<IconName, ReactNode> = {
  back: <path d="m15 18-6-6 6-6" />,
  sound: (
    <>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
    </>
  ),
  chart: <path d="M5 19V9M12 19V5M19 19v-7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="m9 18 6-6-6-6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  menu: <path d="M5 7h14M5 12h14M5 17h14" />,
  check: <path d="m5 12 4 4L19 6" />,
  wifi: (
    <>
      <path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15a4 4 0 0 1 6 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="m8 11 8-5M8 13l8 5" />
    </>
  ),
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
