import { Button } from '@/components/ui/button'

import { Heart, XIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useMemo, useState } from 'react'
import { cn } from '@/utils/tw'

const ResultsList = ({
  matchedWords,
  selectedWord,
  setSelectedWord,
  requiredLength
}: {
  matchedWords: string[]
  selectedWord: string | null
  setSelectedWord: (word: string | null) => void
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

  const handleLike = (word: string): void => {
    setLikedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : prev.concat(word)
    )
  }

  const handleHide = (word: string): void => {
    setHiddenWords((prev) => prev.concat(word))
  }

  return matchedWords.length === 0 ? null : (
    <ul className="h-full flex flex-col gap-0.5 items-start">
      {selectedWord && (
        <>
          <li className="uppercase tracking-wide text-xs font-medium mb-1">Selected</li>
          <ResultListItem
            word={selectedWord}
            index={0}
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            isLikedWord={likedWords.includes(selectedWord)}
            handleLikedWords={() => handleLike(selectedWord)}
            handleHiddenWords={() => handleHide(selectedWord)}
          />
          <li className="h-[1px] w-full border-t mt-3" />
        </>
      )}

      {likedWords.length > 0 && (
        <>
          <li
            className={cn(
              'uppercase tracking-wide text-xs font-medium flex justify-between w-full px-1 sticky -top-px bg-muted pb-1.5',
              selectedWord ? 'pt-2.5' : 'pt-1'
            )}
          >
            Favorited
            <span>{likedWords.length}</span>
          </li>
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
                handleLikedWords={() => handleLike(word)}
                handleHiddenWords={() => handleHide(word)}
              />
            )
          })}
          <li className="h-[1px] w-full border-t mt-3" />
        </>
      )}

      {filteredMatchedWords.length > 0 && (
        <>
          <li
            className={cn(
              'uppercase tracking-wide text-xs font-medium flex justify-between w-full px-1 sticky -top-px bg-muted pb-1.5',
              likedWords.length > 0 ? 'pt-2.5' : 'pt-1'
            )}
          >
            All Words
            <span>{filteredMatchedWords.length}</span>
          </li>
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
                handleLikedWords={() => handleLike(word)}
                handleHiddenWords={() => handleHide(word)}
              />
            )
          })}
        </>
      )}
    </ul>
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
