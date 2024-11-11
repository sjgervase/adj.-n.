import * as React from 'react'

import { cn } from '@/utils/tw'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'min'> {
  onChange: (value: number) => void
  min: number
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value = 0, min, onChange, ...props }, forwardedRef) => {
    // merge forwared ref with accessible ref
    const ref = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(forwardedRef, () => ref.current as HTMLInputElement)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      onChange(Number(e.target.value))
    }

    const handleScroll = (e: React.WheelEvent<HTMLDivElement>): void => {
      const newValue = e.deltaY > 0 ? (value as number) - 1 : (value as number) + 1
      if (newValue >= min) {
        onChange(newValue)
      }
    }

    const handleButton = (amount: number): void => {
      onChange((value as number) + amount)
      if (typeof ref !== 'function' && ref?.current) {
        ref.current.focus()
      }
    }

    return (
      <div className="w-fit h-min relative">
        <input
          type="number"
          className={cn(
            'h-10 w-full rounded-md border border-input bg-background px-3 pr-8 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <div
          className="absolute top-0 right-0 p-0.5 min-w-8 h-full flex flex-col justify-center gap-0.5 items-center"
          onWheel={handleScroll}
        >
          <button
            className="text-muted-foreground hover:text-primary transition-all active:scale-110 grow flex items-end"
            onClick={() => handleButton(1)}
            type="button"
          >
            <ChevronUp className="max-h-4" />
          </button>
          <button
            className="text-muted-foreground hover:text-primary transition-all active:scale-110 grow flex items-start"
            onClick={() => handleButton(-1)}
            type="button"
          >
            <ChevronDown className="h-4" />
          </button>
        </div>
      </div>
    )
  }
)
NumberInput.displayName = 'NumberInput'

export interface LetterInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  index: number
  maxIndex: number
  // clearAll: () => void
  setFocus: (newIndex: number) => void
  onChange: (val: string) => void
}

const LetterInput = React.forwardRef<HTMLInputElement, LetterInputProps>(
  ({ value: currentValue, index, maxIndex, setFocus, onChange, className, ...props }, ref) => {
    const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
      const cleaned = value.replace(/[^a-zA-Z]/g, '')
      if (!/[a-zA-Z]/.test(cleaned)) return
      if (cleaned.length === 2) {
        onChange(
          (
            [...cleaned].filter((v) => v !== currentValue)[0] ||
            currentValue ||
            ''
          ).toUpperCase() as string
        )
      } else {
        onChange(cleaned.toUpperCase())
      }
      setFocus(index + 1)
    }

    const handleKeyDown = ({
      key,
      ctrlKey,
      metaKey,
      shiftKey
    }: React.KeyboardEvent<HTMLInputElement>): void => {
      const isExtraKey = ctrlKey || metaKey || shiftKey

      // if number key, set focus to input at that index
      if (!isNaN(+key)) {
        return setFocus(+key - 1)
      }

      switch (key) {
        case ' ':
        case 'ArrowRight':
        case 'ArrowDown':
          return setFocus(isExtraKey ? maxIndex : index + 1)

        case 'ArrowLeft':
        case 'ArrowUp':
          return setFocus(isExtraKey ? 0 : index - 1)

        case 'Delete':
        case 'Backspace': {
          onChange('')
          return setFocus(index - 1)
        }

        case 'Home':
        case 'PageUp':
          return setFocus(0)

        case 'End':
        case 'PageDown':
          return setFocus(4)
      }
    }

    return (
      <input
        {...props}
        value={currentValue}
        type="text"
        maxLength={2}
        className={cn(
          'font-sentient text-center uppercase selection:bg-transparent w-full rounded-lg border border-input shadow-sm transition-[box-shadow] transition-colors ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring',
          currentValue && 'caret-transparent',
          className
        )}
        ref={ref}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
    )
  }
)
LetterInput.displayName = 'LetterInput'

export { Input, NumberInput, LetterInput }
