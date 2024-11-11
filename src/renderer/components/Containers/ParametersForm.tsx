import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import useMeasure from 'react-use-measure'
import { useTransition, animated, config } from '@react-spring/web'

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
import { AlertCircle, RotateCcw, Search } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectSearchParameters, updateSearchParameters } from '@/store/searchParametersSlice'

const formSchema = z.object({
  charCount: z
    .number()
    .int({ message: 'Only whole numbers allowed in these parts' })
    .gte(4, { message: "C'mon, its gotta be at least 4 letters" })
    // TODO: determine the actual limit that julietta would need
    .lte(50, { message: "Woah there, let's not get out of control" }),

  letters: z.array(z.string()).refine((val) => val.some(Boolean), {
    message: 'Gotta enter at least one letter'
  }),

  includeNouns: z.boolean(),
  includeCompoundNouns: z.boolean(),
  includeHypenatedNouns: z.boolean(),
  includeAdjectives: z.boolean(),
  includeCompoundAdjectives: z.boolean()
})

const ParametersForm = (): JSX.Element => {
  const searchParametersState = useAppSelector(selectSearchParameters) as z.infer<typeof formSchema>

  // Form Definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: searchParametersState
  })

  // TODO: Submission Handler
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const onSubmit = (values: z.infer<typeof formSchema>): void => {
    appDispatch(updateSearchParameters(values))
    navigate('/results')
  }

  const charCount = form.watch('charCount')
  const letters = form.watch('letters')

  const searchOptions = [
    form.watch('includeNouns'),
    form.watch('includeCompoundNouns'),
    form.watch('includeHypenatedNouns'),
    form.watch('includeAdjectives'),
    form.watch('includeCompoundAdjectives')
  ]

  const handleEnableAllSwitch = (): void => {
    const isAllChecked = searchOptions.every(Boolean)
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

  const lettersError = form.formState.errors.letters?.root?.message
  const errorMessageTransition = useTransition(lettersError, {
    from: { y: -24, scale: 0.8 },
    enter: { y: 2, scale: 1 },
    leave: { y: -24, scale: 0.8 },
    config: config.stiff
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-8">
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

        {/*  */}

        <div className="relative">
          <Label>Enter the letters you need to search around</Label>
          <div className="mt-1 flex gap-3 w-full items-center justify-center bg-muted relative z-10">
            {transitions((style, index) => (
              <animated.div
                style={style}
                className="dynamic-font-size-container grow min-w-12 max-w-36"
                ref={ref}
              >
                <FormField
                  control={form.control}
                  name={`letters.${index}`}
                  render={({ field }) => (
                    <FormControl>
                      <LetterInput
                        {...field}
                        onChange={(val) => {
                          field.onChange(val)
                          form.trigger('letters')
                        }}
                        className="shadow-sm"
                        index={index}
                        maxIndex={charCount - 1}
                        value={field.value || ''}
                        setFocus={(newIndex) => form.setFocus(`letters.${newIndex}`)}
                      />
                    </FormControl>
                  )}
                />
              </animated.div>
            ))}
          </div>

          {errorMessageTransition((style, item) => (
            <animated.div
              style={style}
              className="absolute w-full flex items-center justify-center"
            >
              <p className="flex items-center gap-1.5 font-medium text-sm bg-destructive pl-2 pr-2.5 py-1 text-destructive-foreground rounded-full leading-none">
                <AlertCircle className="size-4" />
                {item}
              </p>
            </animated.div>
          ))}
        </div>

        {/*  */}

        <Card>
          <CardHeader>
            <CardTitle>Additional Search Options</CardTitle>
            <CardDescription>
              Choose which types of words may appear in the results. Spaces and Hypens will not
              affect if the word fits the above template.
            </CardDescription>
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
                <Label className="text-base" htmlFor="enable-all-search-options-switch">
                  Enable All
                </Label>
                <Switch
                  id="enable-all-search-options-switch"
                  className="ml-4"
                  checked={searchOptions.every(Boolean)}
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
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              size="lg"
              disabled={!searchOptions.some(Boolean)}
              className="h-12 text-base"
            >
              <Search /> Search
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default ParametersForm
