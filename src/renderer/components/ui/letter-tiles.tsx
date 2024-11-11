import { cn } from '@/utils/tw'
import { useTransition, animated } from '@react-spring/web'
import { useMemo } from 'react'

const LetterTiles = ({
  word,
  className
}: {
  word: string | string[]
  className?: string
}): JSX.Element => {
  const letters = useMemo(
    () =>
      (typeof word === 'string' ? word.split('') : word).map((letter, i) => ({
        letter,
        key: i
      })),
    [word]
  )

  const transitions = useTransition(letters, {
    keys: (letter): number => letter.key,
    trail: 50,
    from: { y: -100, opacity: 0, scale: 0.6 },
    enter: { y: 0, opacity: 1, scale: 0.9 },
    update: ({ letter }) => ({ scale: letter ? 1 : 0.9 })
  })

  return (
    <div
      className={cn(
        'w-full flex p-2 gap-1.5 bg-muted rounded-lg border overflow-hidden',
        className
      )}
    >
      {transitions((style, { letter }) => (
        <animated.p style={style} className="dynamic-font-size-container grow max-w-32 min-w-12">
          <span className="flex items-center justify-center bg-background font-sentient text-center uppercase w-full rounded-lg border border-input shadow-sm">
            {letter}
          </span>
        </animated.p>
      ))}
    </div>
  )
}

export { LetterTiles }
