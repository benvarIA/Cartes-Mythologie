import { useMemo } from 'react'

/** Drifting dust motes — adds atmospheric depth */
export default function Dust({ count = 18 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 25,
        duration: 18 + Math.random() * 22,
        size: 1 + Math.random() * 2.5,
        key: i,
      })),
    [count],
  )

  return (
    <div className="dust" aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.key}
          style={{
            left: `${m.left}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
