import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchCode, TriangleAlert } from 'lucide-react'

import adjectives from '../../../assets/words/adjectives/single_word_adjectives_array.json'
import adjDefinitions from '../../../assets/words/adjectives/single_word_adjectives.json'
import compoundAdjectives from '../../../assets/words/adjectives/compound_adjectives_array.json'
import compoundAdjDefinition from '../../../assets/words/adjectives/compound_adjectives.json'

import nouns from '../../../assets/words/nouns/single_word_nouns_array.json'
import nounDefinitions from '../../../assets/words/nouns/single_word_nouns.json'
import compoundNouns from '../../../assets/words/nouns/multi_word_nouns_array.json'
import compoundNounDefinitions from '../../../assets/words/nouns/multi_word_nouns.json'
import hyphenatedNouns from '../../../assets/words/nouns/hyphenated_nouns_array.json'
import hyphenatedNounDefinitions from '../../../assets/words/nouns/hyphenated_nouns.json'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import ResultsList from './ResultsList'
import { LetterTiles } from '@/components/ui/letter-tiles'

import { useAppSelector } from '@/store/hooks'
import { selectSearchParameters } from '@/store/searchParametersSlice'
import { ScrollArea } from '@/components/ui/scroll-area'
import { WordDefinition } from '@/components/ui/word-definition'

type WordState = {
  word: string | null
  definition: string[] | null
}

const stripNonLetter = (word: string | null): string =>
  word ? word.replace(/[^0-9a-z]/gi, '') : ''

const Results = (): JSX.Element => {
  const {
    charCount,
    letters,
    includeNouns,
    includeCompoundNouns,
    includeHypenatedNouns,
    includeAdjectives,
    includeCompoundAdjectives
  } = useAppSelector(selectSearchParameters)

  const showResults = letters.filter(Boolean).length > 0

  // states
  const [selectedNoun, setSelectedNoun] = useState<WordState>({
    word: null,
    definition: null
  })
  const [selectedAdjective, setSelectedAdjective] = useState<WordState>({
    word: null,
    definition: null
  })

  const formattedNoun = stripNonLetter(selectedNoun.word)
  const formattedAdjective = stripNonLetter(selectedAdjective.word)

  const resultNoun = `${'_'.repeat(charCount - formattedNoun.length)}${formattedNoun}`
  const resultAdjective = `${formattedAdjective}${'_'.repeat(charCount - formattedAdjective.length)}`

  const { matchedNouns, matchedAdjectives } = useMemo(() => {
    // dont fetch
    if (!showResults) return { matchedNouns: [], matchedAdjectives: [] }

    // generate regex by letter size
    const regex = new RegExp(
      letters.map((l) => (l ? `[${l.toUpperCase()}_]` : `[A-Z_]`)).join(''),
      'g'
    )

    // determine lists to read from
    const allNouns = [
      ...(includeNouns ? nouns : []),
      ...(includeCompoundNouns ? compoundNouns : []),
      ...(includeHypenatedNouns ? hyphenatedNouns : [])
    ]
    const allAdjectives = [
      ...(includeAdjectives ? adjectives : []),
      ...(includeCompoundAdjectives ? compoundAdjectives : [])
    ]

    // initial filtering to get array of words that fit the template
    const filteredNouns = allNouns.filter((n) => {
      // strip non a-z chars for proper filtering
      const noun = stripNonLetter(n)
      // if word is too long, remove
      if (noun.length > charCount) return false
      // front-fill with underscores to equate length, return those that match
      return regex.test(`${'_'.repeat(charCount - noun.length)}${noun}`)
    })

    const filteredAdjectives = allAdjectives.filter((a) => {
      // strip non a-z chars for proper filtering
      const adj = stripNonLetter(a)
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
  }, [
    charCount,
    letters,
    showResults,
    includeNouns,
    includeCompoundNouns,
    includeHypenatedNouns,
    includeAdjectives,
    includeCompoundAdjectives
  ])

  const handleSelection = (selection: string | null, type: 'noun' | 'adj'): void => {
    const setSelection = type === 'adj' ? setSelectedAdjective : setSelectedNoun

    if (!selection) return setSelection({ word: null, definition: null })

    const wordList =
      type === 'adj'
        ? [
            ...(includeAdjectives
              ? (adjDefinitions as { word: string; definitions: string[] }[])
              : []),
            ...(includeCompoundAdjectives ? compoundAdjDefinition : [])
          ]
        : [
            ...(includeNouns ? (nounDefinitions as { word: string; definitions: string[] }[]) : []),
            ...(includeCompoundNouns ? compoundNounDefinitions : []),
            ...(includeHypenatedNouns ? hyphenatedNounDefinitions : [])
          ]

    setSelection({
      word: selection,
      definition: wordList.find((w: { word: string }) => w.word === selection)?.definitions || null
    })
  }

  return !showResults ? (
    <div className="flex h-[calc(100vh-9rem)] items-center justify-center">
      <div className="flex items-center gap-1.5 text-xl text-muted-foreground">
        <TriangleAlert />
        First, you must define{' '}
        <Link
          to="/form"
          className="inline-flex gap-1 items-center [&>svg]:w-6 text-primary underline-offset-4 hover:underline font-medium"
        >
          <SearchCode />
          Search Parameters
        </Link>
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col gap-3 h-[calc(100vh-11rem)]">
      <Card className="basis-auto">
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

          <div className="flex w-full gap-3 mt-3">
            <WordDefinition
              word={selectedAdjective.word}
              definitions={selectedAdjective.definition}
              wordType="adj"
            />
            <WordDefinition
              word={selectedNoun.word}
              definitions={selectedNoun.definition}
              wordType="n"
            />
          </div>
        </CardContent>
      </Card>

      <div className="basis-full overflow-hidden h-full flex gap-3">
        <Card className="w-1/2 h-full flex flex-col">
          <CardHeader className="h-min">
            <CardTitle>Matching Adjectives</CardTitle>
            <CardDescription>{matchedAdjectives.length} total adjectives</CardDescription>
          </CardHeader>
          <CardContent className="h-full overflow-hidden">
            <ScrollArea className="h-full border rounded-lg bg-muted px-3 [&_ul]:pb-3 [&_ul]:pt-1.5">
              <ResultsList
                matchedWords={matchedAdjectives}
                selectedWord={selectedAdjective.word}
                setSelectedWord={(selection) => handleSelection(selection, 'adj')}
                requiredLength={selectedNoun.word ? charCount - formattedNoun.length : null}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="w-1/2 h-full flex flex-col">
          <CardHeader className="h-min">
            <CardTitle>Matching Nouns</CardTitle>
            <CardDescription>{matchedNouns.length} total nouns</CardDescription>
          </CardHeader>
          <CardContent className="h-full overflow-hidden">
            <ScrollArea className="h-full border rounded-lg bg-muted px-3 [&_ul]:pb-3 [&_ul]:pt-1.5">
              <ResultsList
                matchedWords={matchedNouns}
                selectedWord={selectedNoun.word}
                setSelectedWord={(selection) => handleSelection(selection, 'noun')}
                requiredLength={
                  selectedAdjective.word ? charCount - formattedAdjective.length : null
                }
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Results
