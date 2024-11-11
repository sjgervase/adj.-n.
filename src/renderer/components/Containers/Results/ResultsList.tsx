import { Button } from '@/components/ui/button'

import { Heart, XIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useMemo, useState } from 'react'

const ResultsList = ({
  matchedWords,
  selectedWord,
  setSelectedWord,
  cardTitle,
  cardDescription,
  requiredLength
}: {
  matchedWords: string[]
  selectedWord: string | null
  setSelectedWord: (word: string | null) => void
  cardTitle: string
  cardDescription: string
  requiredLength: number | null
}): JSX.Element | null => {
  // states to handle internal managements of liked and hidden words
  const [likedWords, setLikedWords] = useState<string[]>([])
  const [hiddenWords, setHiddenWords] = useState<string[]>([])

  const filteredMatchedWords = useMemo(
    () =>
      matchedWords.filter((word) => {
        if (hiddenWords.includes(word)) return false

        if (requiredLength && word.length !== requiredLength) return false

        return true
      }),
    [matchedWords, hiddenWords, requiredLength]
  )

  return matchedWords.length === 0 ? null : (
    <Card className="basis-1/2 h-min">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-0.5 items-start bg-muted rounded-lg p-2">
          {likedWords.map((word, i) => {
            const isLikedWord = likedWords.includes(word)
            return (
              <ResultListItem
                key={`${word}_${i}`}
                word={word}
                index={i}
                selectedWord={selectedWord}
                setSelectedWord={setSelectedWord}
                isLikedWord={isLikedWord}
                handleLikedWords={() =>
                  setLikedWords(
                    isLikedWord ? likedWords.filter((w) => w !== word) : likedWords.concat(word)
                  )
                }
                handleHiddenWords={() => setHiddenWords((prev) => prev.concat(word))}
              />
            )
          })}

          {likedWords.length > 0 && <li className="h-[1px] w-full border-t my-3" />}

          {filteredMatchedWords.map((word, i) => {
            const isLikedWord = likedWords.includes(word)
            return (
              <ResultListItem
                key={`${word}_${i}`}
                word={word}
                index={i}
                selectedWord={selectedWord}
                setSelectedWord={setSelectedWord}
                isLikedWord={isLikedWord}
                handleLikedWords={() =>
                  setLikedWords(
                    isLikedWord ? likedWords.filter((w) => w !== word) : likedWords.concat(word)
                  )
                }
                handleHiddenWords={() => setHiddenWords((prev) => prev.concat(word))}
              />
            )
          })}
        </ul>
      </CardContent>

      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

export default ResultsList

const ResultListItem = ({
  word,
  index,
  selectedWord,
  setSelectedWord,
  isLikedWord,
  handleLikedWords,
  handleHiddenWords
}: {
  word: string
  index: number
  selectedWord: string | null
  setSelectedWord: (word: string | null) => void
  isLikedWord: boolean
  handleLikedWords: () => void
  handleHiddenWords: () => void
}): JSX.Element => (
  <li className="w-full flex items-center gap-1 p-1 pl-3 bg-background rounded-md border">
    {/* Checkbox to set result word */}
    <Checkbox
      id={`${word}-${index}-checkbox`}
      checked={selectedWord === word}
      onCheckedChange={(checked) => setSelectedWord(checked ? word : null)}
    />
    <Label
      htmlFor={`${word}-${index}-checkbox`}
      className="ml-1 mr-auto tracking-wide capitalize text-lg leading-none mt-[1px]"
    >
      {word.toLowerCase()}
    </Label>

    {/* "Like" Button */}
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={handleLikedWords}
      className="active:scale-110 text-rose-600 hover:text-rose-400"
    >
      <Heart fill={isLikedWord ? 'currentColor' : 'none'} />
    </Button>

    {/* "Hide" Button */}
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={handleHiddenWords}
      className="hover:bg-destructive hover:text-destructive-foreground"
    >
      <XIcon />
    </Button>
  </li>
)
