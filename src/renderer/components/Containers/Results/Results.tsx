import { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import ResultsList from './ResultsList'
import { LetterTiles } from '@/components/ui/letter-tiles'

import adjectives from '../../../assets/words/adjectives/single_word_adjectives_array.json'
// import adjDefinitions from '../../../assets/words/adjectives/single_word_adjectives.json'
// import compoundAdjectives from '../../../assets/words/adjectives/compound_adjectives_array.json'

import nouns from '../../../assets/words/nouns/single_word_nouns_array.json'
import { useAppSelector } from '@/store/hooks'
import { selectSearchParameters } from '@/store/searchParametersSlice'
// import compoundNouns from '../../../assets/words/nouns/multi_word_nouns_array.json'
// import hyphenatedNouns from '../../../assets/words/nouns/hyphenated_nouns_array.json'

//
//
//

const Results = (): JSX.Element => {
  const { charCount, letters } = useAppSelector(selectSearchParameters)

  //
  const [selectedNoun, setSelectedNoun] = useState<string | null>(null)
  const [selectedAdjective, setSelectedAdjective] = useState<string | null>(null)

  const resultNoun = `${'_'.repeat(charCount - (selectedNoun ?? '').length)}${selectedNoun ?? ''}`
  const resultAdjective = `${selectedAdjective ?? ''}${'_'.repeat(charCount - (selectedAdjective ?? '').length)}`

  const { matchedNouns, matchedAdjectives } = useMemo(() => {
    // generate regex by letter size
    const regex = new RegExp(
      letters.map((l) => (l ? `[${l.toUpperCase()}_]` : `[A-Z_]`)).join(''),
      'g'
    )

    // initial filtering to get array of words that fit the template
    const filteredNouns = nouns.filter((noun) => {
      // if word is too long, remove
      if (noun.length > charCount) return false
      // front-fill with underscores to equate length, return those that match
      return regex.test(`${'_'.repeat(charCount - noun.length)}${noun}`)
    })

    const filteredAdjectives = adjectives.filter((adj) => {
      // if word is too long, remove
      if (adj.length > charCount) return false
      // front-fill with underscores to equate length, return those that match
      return regex.test(`${adj}${'_'.repeat(charCount - adj.length)}`)
    })

    // get array of unique sizes
    const nounSizes = [...new Set(filteredNouns.map((n) => n.length))]
    const adjectiveSizes = [...new Set(filteredAdjectives.map((n) => n.length))]

    // final filter to ensure every noun has at least one pairing adjective and vice versa
    return {
      matchedNouns: filteredNouns.filter((noun) =>
        adjectiveSizes.includes(charCount - noun.length)
      ),
      matchedAdjectives: filteredAdjectives.filter((adj) =>
        nounSizes.includes(charCount - adj.length)
      )
    }
  }, [charCount, letters])

  return (
    <div className="w-full flex flex-col gap-3 h-fit bg-muted justify-center p-3 rounded-lg border">
      <Card className="basis-1/2">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Select</CardDescription>
        </CardHeader>
        <CardContent>
          <LetterTiles
            word={letters.map((_, i) => {
              if (resultAdjective[i] !== '_') return resultAdjective[i]
              if (resultNoun[i] !== '_') return resultNoun[i]
              return ''
            })}
          />

          <div className="flex w-full gap-3">
            {selectedAdjective && (
              <Card className="h-min basis-1/2">
                <CardHeader className="flex-row justify-between gap-2">
                  <CardTitle className="capitalize text-3xl leading-none">
                    {selectedAdjective.toLowerCase()}
                  </CardTitle>
                  <CardDescription className="font-sentient font-medium text-base leading-none">
                    adj.
                  </CardDescription>
                </CardHeader>
                <CardContent>definition: todo</CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="w-full flex gap-3 h-fit justify-center">
        <div className="basis-1/2">
          <ResultsList
            cardTitle="Matching Adjectives"
            cardDescription="TODO: desc for matching adjectives"
            matchedWords={matchedAdjectives}
            selectedWord={selectedAdjective}
            setSelectedWord={(selection: string | null) => setSelectedAdjective(selection)}
            requiredLength={selectedNoun ? charCount - selectedNoun.length : null}
          />
        </div>

        <div className="basis-1/2">
          <ResultsList
            cardTitle="Matching Nouns"
            cardDescription="TODO: desc for matching nouns"
            matchedWords={matchedNouns}
            selectedWord={selectedNoun}
            setSelectedWord={(selection: string | null) => setSelectedNoun(selection)}
            requiredLength={selectedAdjective ? charCount - selectedAdjective.length : null}
          />
        </div>
      </div>
    </div>
  )
}

export default Results
