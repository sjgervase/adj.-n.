import { Outlet, useLocation } from 'react-router-dom'

import { ScrollAreaWithHeading } from '@/components/ui/scroll-area'
import TitleBar from './TitleBar'
import Navbar from './Navbar'

const Container = (): JSX.Element => {
  const header = useContainerHeader()

  return (
    <section className="h-screen w-screen flex flex-col">
      <TitleBar />
      <main className="h-full flex overflow-hidden">
        <Navbar />
        <div className="grow flex flex-col pr-2">
          <ScrollAreaWithHeading
            className="h-screen pr-4 pl-6 pb-6 flex flex-col"
            header={header}
            headingClassName="font-sentient flex items-center pt-6 pb-5 text-4xl font-semibold leading-none transition-all ease-out"
            headingScrollClassName="text-2xl pt-3 pb-2.5"
            viewportClassName="bg-muted/40 border rounded-lg p-4"
          >
            <Outlet />
          </ScrollAreaWithHeading>
        </div>
      </main>
    </section>
  )
}
export default Container

const useContainerHeader = (): string => {
  const location = useLocation().pathname

  const pathnameMap = {
    '/home': 'Home'
  }

  return location in pathnameMap ? pathnameMap[location] : 'Unknown Path'
}
