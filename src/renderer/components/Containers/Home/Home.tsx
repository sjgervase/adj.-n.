import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import useMeasure from 'react-use-measure'
import { useTransition, animated } from '@react-spring/web'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { LetterInput, NumberInput } from '@/components/ui/input'
import {
  ChevronDown,
  Heart,
  HeartIcon,
  Plus,
  RotateCcw,
  Search,
  ThumbsDown,
  ThumbsUp,
  XIcon
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import adjectives from '../../../assets/words/adjectives/single_word_adjectives_array.json'
import compoundAdjectives from '../../../assets/words/adjectives/compound_adjectives_array.json'

import nouns from '../../../assets/words/nouns/single_word_nouns_array.json'
import compoundNouns from '../../../assets/words/nouns/multi_word_nouns_array.json'
import hyphenatedNouns from '../../../assets/words/nouns/hyphenated_nouns_array.json'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

//
//
//

const formSchema = z.object({
  charCount: z
    .number()
    .int({ message: 'Only whole numbers allowed in these parts' })
    .gte(4, { message: "C'mon, its gotta be at least 4 letters" })
    // TODO: determine the actual limit that julietta would need
    .lte(50, { message: "Woah there, let's not get out of control" }),
  letters: z.array(z.string()),

  //
  includeNouns: z.boolean(),
  includeCompoundNouns: z.boolean(),
  includeHypenatedNouns: z.boolean(),
  includeAdjectives: z.boolean(),
  includeCompoundAdjectives: z.boolean(),

  //
  selectedNoun: z.string().nullable(),
  selectedAdjective: z.string().nullable(),

  //
  likedNouns: z.array(z.string()),
  hiddenNouns: z.array(z.string()),
  likedAdjectives: z.array(z.string()),
  hiddenAdjectives: z.array(z.string())
})

const Home = (): JSX.Element => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      // charCount: 7,
      // letters: ['', '', '', '', '', '', ''],

      charCount: 9,
      letters: ['F', '', '', 'Z', '', 'B', '', 'L', ''],

      includeNouns: true,
      includeCompoundNouns: false,
      includeHypenatedNouns: false,
      includeAdjectives: true,
      includeCompoundAdjectives: false,

      likedNouns: [],
      hiddenNouns: [],
      likedAdjectives: [],
      hiddenAdjectives: []
    }
  })

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>): void => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const charCount = form.watch('charCount')
  const letters = form.watch('letters')

  const selectedNoun = form.watch('selectedNoun')
  const resultNoun = `${'_'.repeat(letters.length - (selectedNoun ?? '').length)}${selectedNoun ?? ''}`

  const selectedAdjective = form.watch('selectedAdjective')
  const resultAdjective = `${selectedAdjective ?? ''}${'_'.repeat(letters.length - (selectedAdjective ?? '').length)}`

  const likedNouns = form.watch('likedNouns')
  const likedAdjectives = form.watch('likedAdjectives')

  const hiddenNouns = form.watch('hiddenNouns')
  const hiddenAdjectives = form.watch('hiddenAdjectives')

  const allChecked = [
    form.watch('includeNouns'),
    form.watch('includeCompoundNouns'),
    form.watch('includeHypenatedNouns'),
    form.watch('includeAdjectives'),
    form.watch('includeCompoundAdjectives')
  ]

  const handleEnableAllSwitch = (): void => {
    const isAllChecked = allChecked.every(Boolean)
    form.setValue('includeNouns', !isAllChecked)
    form.setValue('includeCompoundNouns', !isAllChecked)
    form.setValue('includeHypenatedNouns', !isAllChecked)
    form.setValue('includeAdjectives', !isAllChecked)
    form.setValue('includeCompoundAdjectives', !isAllChecked)
  }

  const [ref, { width }] = useMeasure()

  const transitions = useTransition(
    letters.map((_, i) => i),
    {
      from: { opacity: 0, x: ~width, scale: 0.5, zIndex: 2 },
      enter: { opacity: 1, x: 0, scale: 1, zIndex: 3, position: 'unset' },
      leave: { opacity: 0, x: 0, scale: 0, zIndex: 1, position: 'absolute', right: '33%' }
    }
  )

  //
  const [matchedNouns, setMatchedNouns] = useState<string[]>([])
  const [matchedAdjectives, setMatchedAdjectives] = useState<string[]>([])

  const handleSearch = (): void => {
    // generate regex by letter size
    const regex = new RegExp(
      letters.map((l) => (l ? `[${l.toUpperCase()}_]` : `[A-Z_]`)).join(''),
      'g'
    )

    // initial filtering to get array of words that fit the template
    const filteredNouns = nouns.filter((noun) => {
      // if word is too long, remove
      if (noun.length > letters.length) return false
      // front-fill with underscores to equate length, return those that match
      return regex.test(`${'_'.repeat(letters.length - noun.length)}${noun}`)
    })

    const filteredAdjectives = adjectives.filter((adj) => {
      // if word is too long, remove
      if (adj.length > letters.length) return false
      // front-fill with underscores to equate length, return those that match
      return regex.test(`${adj}${'_'.repeat(letters.length - adj.length)}`)
    })

    // get array of unique sizes
    const nounSizes = [...new Set(filteredNouns.map((n) => n.length))]
    const adjectiveSizes = [...new Set(filteredAdjectives.map((n) => n.length))]

    // final filter to ensure every noun has at least one pairing adjective and vice versa
    setMatchedNouns(
      filteredNouns.filter((noun) => adjectiveSizes.includes(letters.length - noun.length))
    )
    setMatchedAdjectives(
      filteredAdjectives.filter((adj) => nounSizes.includes(letters.length - adj.length))
    )
  }

  //

  const handleHeart = (word: string, type: 'noun' | 'adj') => {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 items-center">
        <FormField
          control={form.control}
          name="charCount"
          render={({ field }) => (
            <FormItem className="items-center flex flex-col">
              <FormLabel className="select-none">How many letters?</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  type="number"
                  placeholder="5"
                  className="font-sentient text-5xl font-medium h-20 w-40 text-center pt-2 px-6"
                  min={4}
                  onChange={(value) => {
                    field.onChange(value)
                    form.setValue(
                      'letters',
                      Array.from({ length: value }, (_, i) => letters[i] || '')
                    )
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex gap-3 h-fit bg-muted justify-center p-3 rounded-lg border relative">
          {transitions((style, index) => (
            <animated.div style={style} className="max-w-32 min-w-16 grow" ref={ref}>
              <FormField
                control={form.control}
                name={`letters.${index}`}
                render={({ field }) => (
                  <FormItem className="dynamic-font-size-container w-full grow max-w-32 min-w-16 space-y-0">
                    <FormLabel className="sr-only">Letter {index + 1}</FormLabel>
                    <FormControl>
                      <LetterInput
                        {...field}
                        index={index}
                        maxIndex={charCount - 1}
                        value={field.value || ''}
                        setFocus={(newIndex) => form.setFocus(`letters.${newIndex}`)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </animated.div>
          ))}
        </div>

        <Card className="basis-1/2">
          <CardHeader>
            <CardTitle>Additional Search Options</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="includeNouns"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 pt-2 space-y-0">
                    <div>
                      <FormLabel className="text-base">Single Word Nouns</FormLabel>
                      <FormDescription>
                        e.g. <b>Raven</b>, <b>Advice</b>, <b>Toadstool</b>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="ml-4"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeCompoundNouns"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 pt-2 space-y-0">
                    <div>
                      <FormLabel className="text-base">Compound Nouns</FormLabel>
                      <FormDescription>
                        e.g. <b>Air Pump</b>, <b>Sea Moss</b>, <b>Blood Vessel</b>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="ml-4"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeHypenatedNouns"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 pt-2 space-y-0">
                    <div>
                      <FormLabel className="text-base">Hyphenated Nouns</FormLabel>
                      <FormDescription>
                        e.g. <b>Would-Be</b>, <b>Half-Mast</b>, <b>Self-Discipline</b>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="ml-4"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="w-[1px] border-l" />

            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="includeAdjectives"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 pt-2 space-y-0">
                    <div>
                      <FormLabel className="text-base">Single Word Adjectives</FormLabel>
                      <FormDescription>
                        e.g. <b>Fuzzy</b>, <b>Aqueous</b>, <b>Malicious</b>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="ml-4"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeCompoundAdjectives"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 pt-2 space-y-0">
                    <div>
                      <FormLabel className="text-base">Hypenated Adjectives</FormLabel>
                      <FormDescription>
                        e.g. <b>Dry-Eyed</b>, <b>Long-Armed</b>, <b>Self-Taught</b>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="ml-4"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="h-[1px] border-t my-auto" />

              <div className="mt-auto flex flex-row items-center justify-between rounded-lg border p-3">
                <Label className="text-base">Enable All</Label>
                <Switch
                  className="ml-4"
                  checked={allChecked.every(Boolean)}
                  onCheckedChange={handleEnableAllSwitch}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center items-center gap-3">
            <Button
              type="reset"
              size="lg"
              variant="outline"
              onClick={() => form.reset()}
              className="h-12 text-base"
            >
              <RotateCcw /> Reset
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={!allChecked.some(Boolean)}
              onClick={handleSearch}
              className="h-12 text-base"
            >
              <Search /> Search
            </Button>
          </CardFooter>
        </Card>

        {/*  */}
        {/*  */}
        {/*  */}
        {matchedAdjectives.length > 0 && matchedNouns.length > 0 && (
          <div className="w-full flex flex-col gap-3 h-fit bg-muted justify-center p-3 rounded-lg border">
            {/*  */}

            <Card className="basis-1/2">
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg border h-min w-full flex p-2 gap-2">
                  {letters
                    .map((_, i) => {
                      if (resultAdjective[i] !== '_') return resultAdjective[i]
                      if (resultNoun[i] !== '_') return resultNoun[i]
                      return ''
                    })
                    .map((letter, i) => (
                      <p key={i} className="dynamic-font-size-container w-full grow ">
                        <span className="flex items-center justify-center bg-background font-sentient text-center uppercase w-full rounded-lg border border-input shadow-sm">
                          {letter}
                        </span>
                      </p>
                    ))}
                </div>

                <div className="flex w-full gap-3">
                  {selectedAdjective && (
                    <div className="rounded-lg border h-min basis-1/2 p-3">
                      <div className="flex gap-2  items-center">
                        {selectedAdjective.split('').map((letter, i) => (
                          <p key={i} className="dynamic-font-size-container w-full grow ">
                            <span className="flex items-center justify-center bg-background font-sentient text-center uppercase w-full rounded-lg border border-input shadow-sm">
                              {letter}
                            </span>
                          </p>
                        ))}
                        <p className="font-sentient font-medium ml-1">adj.</p>
                      </div>

                      <div>definition: todo</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/*  */}

            <div className="w-full flex gap-3 h-fit justify-center">
              {matchedAdjectives.length > 0 && (
                <Card className="basis-1/2 h-min">
                  <CardHeader>
                    <CardTitle>Matching Adjectives</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/*  */}
                    {/*  */}
                    {/*  */}

                    <FormField
                      control={form.control}
                      name="selectedAdjective"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <ul className="flex flex-col gap-0.5 items-start bg-muted rounded-lg p-2">
                              {likedAdjectives.map((adj, i) => (
                                <li
                                  key={`${adj}_${i}`}
                                  className="w-full flex items-center gap-1 p-1 pl-3 bg-background rounded-md border"
                                >
                                  <Checkbox
                                    id={`${adj}-${i}-checkbox`}
                                    checked={field.value === adj}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked ? adj : null)
                                    }
                                  />
                                  <Label
                                    htmlFor={`${adj}-${i}-checkbox`}
                                    className="ml-1 mr-auto tracking-wide capitalize text-lg leading-none mt-[1px]"
                                  >
                                    {adj.toLowerCase()}
                                  </Label>
                                  <FormField
                                    control={form.control}
                                    name="likedAdjectives"
                                    render={({ field: { value, onChange } }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              onChange(
                                                value.includes(adj)
                                                  ? value.filter((a) => a !== adj)
                                                  : value.concat(adj)
                                              )
                                            }
                                            className="active:scale-110 text-rose-600 hover:text-rose-400"
                                          >
                                            <Heart
                                              fill={value.includes(adj) ? 'currentColor' : 'none'}
                                            />
                                          </Button>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="hiddenAdjectives"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => field.onChange(field.value.concat(adj))}
                                            className="hover:bg-destructive hover:text-destructive-foreground"
                                          >
                                            <XIcon />
                                          </Button>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </li>
                              ))}

                              {likedAdjectives.length > 0 && (
                                <li className="h-[1px] w-full border-t my-3" />
                              )}

                              {matchedAdjectives.map((adj, i) =>
                                (!selectedNoun ||
                                  selectedNoun.length + adj.length === letters.length) &&
                                !hiddenAdjectives.includes(adj) ? (
                                  <li
                                    key={`${adj}_${i}`}
                                    className="w-full flex items-center gap-1 p-1 pl-3 bg-background rounded-md border"
                                  >
                                    <Checkbox
                                      id={`${adj}-${i}-checkbox`}
                                      checked={field.value === adj}
                                      onCheckedChange={(checked) =>
                                        field.onChange(checked ? adj : null)
                                      }
                                    />
                                    <Label
                                      htmlFor={`${adj}-${i}-checkbox`}
                                      className="ml-1 mr-auto tracking-wide capitalize text-lg leading-none mt-[1px]"
                                    >
                                      {adj.toLowerCase()}
                                    </Label>
                                    <FormField
                                      control={form.control}
                                      name="likedAdjectives"
                                      render={({ field: { value, onChange } }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Button
                                              type="button"
                                              size="icon"
                                              variant="ghost"
                                              onClick={() =>
                                                onChange(
                                                  value.includes(adj)
                                                    ? value.filter((a) => a !== adj)
                                                    : value.concat(adj)
                                                )
                                              }
                                              className="active:scale-110 text-rose-600 hover:text-rose-400"
                                            >
                                              <Heart
                                                fill={value.includes(adj) ? 'currentColor' : 'none'}
                                              />
                                            </Button>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="hiddenAdjectives"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Button
                                              type="button"
                                              size="icon"
                                              variant="ghost"
                                              onClick={() =>
                                                field.onChange(field.value.concat(adj))
                                              }
                                              className="hover:bg-destructive hover:text-destructive-foreground"
                                            >
                                              <XIcon />
                                            </Button>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </li>
                                ) : null
                              )}
                            </ul>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
                </Card>
              )}

              {matchedNouns.length > 0 && (
                <Card className="basis-1/2 h-min">
                  <CardHeader>
                    <CardTitle>Matching Nouns</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="selectedNoun"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <ul className="flex flex-col gap-0.5 items-start bg-muted rounded-lg p-2">
                              {likedNouns.map((noun, i) => (
                                <li
                                  key={`${noun}_${i}`}
                                  className="w-full flex items-center gap-1 p-1 pl-3 bg-background rounded-md border"
                                >
                                  <Checkbox
                                    id={`${noun}-${i}-checkbox`}
                                    checked={field.value === noun}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked ? noun : null)
                                    }
                                  />
                                  <Label
                                    htmlFor={`${noun}-${i}-checkbox`}
                                    className="ml-1 mr-auto tracking-wide capitalize text-lg leading-none mt-[1px]"
                                  >
                                    {noun.toLowerCase()}
                                  </Label>
                                  <FormField
                                    control={form.control}
                                    name="likedNouns"
                                    render={({ field: { value, onChange } }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              onChange(
                                                value.includes(noun)
                                                  ? value.filter((a) => a !== noun)
                                                  : value.concat(noun)
                                              )
                                            }
                                            className="active:scale-110 text-rose-600 hover:text-rose-400"
                                          >
                                            <Heart
                                              fill={value.includes(noun) ? 'currentColor' : 'none'}
                                            />
                                          </Button>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="hiddenNouns"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => field.onChange(field.value.concat(noun))}
                                            className="hover:bg-destructive hover:text-destructive-foreground"
                                          >
                                            <XIcon />
                                          </Button>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </li>
                              ))}

                              {likedNouns.length > 0 && (
                                <li className="h-[1px] w-full border-t my-3" />
                              )}

                              {matchedNouns.map((noun, i) =>
                                (!selectedAdjective ||
                                  selectedAdjective.length + noun.length === letters.length) &&
                                !hiddenNouns.includes(noun) ? (
                                  <li
                                    key={`${noun}_${i}`}
                                    className="w-full flex items-center gap-1 p-1 pl-3 bg-background rounded-md border"
                                  >
                                    <Checkbox
                                      id={`${noun}-${i}-checkbox`}
                                      checked={field.value === noun}
                                      onCheckedChange={(checked) =>
                                        field.onChange(checked ? noun : null)
                                      }
                                    />
                                    <Label
                                      htmlFor={`${noun}-${i}-checkbox`}
                                      className="ml-1 mr-auto tracking-wide capitalize text-lg leading-none mt-[1px]"
                                    >
                                      {noun.toLowerCase()}
                                    </Label>
                                    <FormField
                                      control={form.control}
                                      name="likedNouns"
                                      render={({ field: { value, onChange } }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Button
                                              type="button"
                                              size="icon"
                                              variant="ghost"
                                              onClick={() =>
                                                onChange(
                                                  value.includes(noun)
                                                    ? value.filter((a) => a !== noun)
                                                    : value.concat(noun)
                                                )
                                              }
                                              className="active:scale-110 text-rose-600 hover:text-rose-400"
                                            >
                                              <Heart
                                                fill={
                                                  value.includes(noun) ? 'currentColor' : 'none'
                                                }
                                              />
                                            </Button>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="hiddenNouns"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Button
                                              type="button"
                                              size="icon"
                                              variant="ghost"
                                              onClick={() =>
                                                field.onChange(field.value.concat(noun))
                                              }
                                              className="hover:bg-destructive hover:text-destructive-foreground"
                                            >
                                              <XIcon />
                                            </Button>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </li>
                                ) : null
                              )}
                            </ul>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}

export default Home
