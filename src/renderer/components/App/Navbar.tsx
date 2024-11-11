import { useState } from 'react'
import { NavLink as NavLinkRoot } from 'react-router-dom'
import { ArrowLeft, SearchCode, TextSearch, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/tw'

const routes: Array<{ label: string; route: string; Icon: LucideIcon; hoverClassName: string }> = [
  {
    label: 'Search Parameters',
    route: '/form',
    Icon: SearchCode,
    hoverClassName: 'hover:w-52'
  },
  {
    label: 'Results',
    route: '/results',
    Icon: TextSearch,
    hoverClassName: 'hover:w-32'
  }
]

const Navbar = (): JSX.Element => {
  const [isSmall, setIsSmall] = useState<boolean>(false)

  return (
    <nav
      className={cn(
        'h-full w-52 flex flex-col p-1 gap-1 items-start border-r bg-muted/40 transition-all ease-out duration-300',
        isSmall && 'w-14 w-'
      )}
    >
      {routes.map((route) => (
        <NavLinkItem {...route} key={route.route} isSmall={isSmall} />
      ))}

      <Button
        className="mt-auto size-12 group relative overflow-hidden duration-500"
        size="icon"
        variant="outline"
        onClick={() => setIsSmall((prev) => !prev)}
      >
        <ArrowLeft
          className={cn(
            'size-4 group-hover:transition',
            isSmall
              ? 'rotate-180 translate-x-0 group-hover:translate-x-[180%]'
              : 'translate-x-0 group-hover:-translate-x-[180%]'
          )}
        />
        <ArrowLeft
          className={cn(
            'size-4 absolute group-hover:transition',
            isSmall
              ? 'rotate-180 -translate-x-[180%] group-hover:translate-x-0'
              : 'translate-x-[180%] group-hover:translate-x-0'
          )}
        />
      </Button>
    </nav>
  )
}
export default Navbar

const NavLinkItem = ({
  label,
  route,
  Icon,
  isSmall,
  hoverClassName
}: (typeof routes)[number] & { isSmall: boolean }): JSX.Element => (
  <NavLinkRoot
    key={`${route}`}
    to={route}
    className={({ isActive }) =>
      cn(
        'whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent py-3.5 h-12 w-[12.5rem] flex items-center gap-3.5 px-3.5 rounded-lg relative z-10 transition-all ease-out duration-300 overflow-hidden justify-start',
        isSmall && `w-12 ${hoverClassName}`,
        isActive && 'bg-emerald-700 text-primary-foreground hover:bg-emerald-800'
      )
    }
  >
    <Icon className="size-5 shrink-0" />
    {label}
  </NavLinkRoot>
)
