import { Button } from '@/components/ui/button'
import { Minus, Square, X } from 'lucide-react'

const TitleBar = (): JSX.Element => {
  return (
    <header
      className="flex h-10 items-center justify-between gap-4 border-b bg-muted/40 pr-1"
      id="title-bar"
    >
      <h1 className="lowercase font-sentient text-2xl font-semibold pl-2.5 h-8">adj.+n.</h1>

      <div className="flex gap-0.5">
        <Button size="icon" variant="ghost">
          <Minus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost">
          <Square className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => {}}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

export default TitleBar
