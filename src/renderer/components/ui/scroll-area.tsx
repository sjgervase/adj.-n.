/* eslint-disable react/prop-types */
import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/utils/tw'

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    viewportRef?: React.Ref<HTMLDivElement> // added optional prop for setting controlling scrolling
    header?: React.ReactNode
  }
>(({ className, children, viewportRef, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]" ref={viewportRef}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

const ScrollAreaWithHeading = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    // viewportRef?: React.RefObject<HTMLDivElement> // added optional prop for setting controlling scrolling
    // heading: (isScrolled: boolean) => React.ReactNode
    header: string
    headingClassName?: string
    headingScrollClassName?: string
    viewportClassName?: string
  }
>(
  (
    {
      className,
      header,
      headingClassName,
      headingScrollClassName,
      viewportClassName,
      children,
      ...props
    },
    ref
  ) => {
    const viewportRef = React.useRef<HTMLDivElement>(null)
    const headingRef = React.useRef<HTMLHeadingElement>(null)

    // Handler when page is scrolled
    const handleScroll = React.useCallback((): void => {
      if (typeof viewportRef?.current?.scrollTop === 'number' && headingRef && headingRef.current) {
        headingRef.current.className = cn(
          headingClassName,
          viewportRef.current.scrollTop > 10 && headingScrollClassName
        )
      }
    }, [headingClassName, headingScrollClassName])

    React.useEffect(() => {
      // Adding the scroll listener
      if (viewportRef && viewportRef.current) {
        viewportRef.current.addEventListener('scroll', handleScroll, { passive: true })
      }
      // Removing listener
      return (): void => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, [handleScroll])

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        <h2 ref={headingRef} className={headingClassName}>
          {header}
        </h2>

        <ScrollAreaPrimitive.Viewport
          className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
          ref={viewportRef}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    )
  }
)
ScrollAreaWithHeading.displayName = 'ScrollAreaTitle'

export { ScrollArea, ScrollBar, ScrollAreaWithHeading }
