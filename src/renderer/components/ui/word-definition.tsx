import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import React from 'react'

const WordDefinition = ({
  word,
  definitions,
  wordType
}: {
  word: string | null
  definitions: string[] | null
  wordType: 'adj' | 'n'
}): React.ReactNode =>
  word && (
    <Accordion type="single" collapsible className="h-min basis-1/2">
      <AccordionItem
        value="TODO"
        className="rounded-lg border bg-card text-card-foreground shadow-sm text-left relative"
      >
        <AccordionTrigger className="leading-none font-sentient pl-4 pr-2 py-0 h-14 [&_svg]:ml-1 [&_svg]:mr-2 hover:no-underline group">
          <span className="capitalize text-3xl tracking-tight font-semibold group-hover:underline">
            {word.toLowerCase()}
          </span>
          <span className="mr-auto ml-2.5 font-sentient font-medium text-lg leading-none text-muted-foreground mt-0.5">
            ({wordType}.)
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-0 px-4">
          {definitions ? (
            <>
              <hr className="border-t border-border h-px mb-2" />
              <ul className="px-1 space-y-2.5">
                {definitions.map((definition, i) => (
                  <li key={i} className="flex gap-1.5">
                    {definitions.length > 0 && (
                      <span className="text-sm mt-px text-muted-foreground font-medium font-sentient">
                        {i + 1}.
                      </span>
                    )}
                    <p className="leading-tight text-pretty">{definition}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No definitions found.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

export { WordDefinition }
