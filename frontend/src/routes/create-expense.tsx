import { createFileRoute } from '@tanstack/react-router'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useForm } from '@tanstack/react-form'
import { api } from '@/lib/api'

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
})

function CreateExpense() {
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0
    },
    onSubmit: async ({ value }) => {
      // do something with the form data like send it to the db
      console.log(value)
      const res = await api.expenses.$post({json: value});  // saying that it is json that we are passing to the server which is the correct type that it is expecting (in the backend)
      if(!res.ok)  {
        throw new Error("server error")
      }
    }
  })

  return (<div className="p-2">
    <h2>Create Expense</h2>
    {/* <form.Provider> */}
      <form
        className='max-w-xl w-full'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field 
          name="title" 
          children={(field) => (
          <>
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.touchedErrors ? (
              <em>{field.state.meta.touchedErrors}</em>
            ) : null}
          </>
        )}
        />
        <form.Field 
          name="amount" 
          children={(field) => (
          <>
            <Label htmlFor={field.name}>Amount</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              type="number"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            {field.state.meta.touchedErrors ? (
              <em>{field.state.meta.touchedErrors}</em>
            ) : null}
          </>
        )}
        />
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (      // ! this will make the submit button unclickable untile the the onSubmit function in CreateExpense doesn't finish execution so that the form isn't submitted multiple times while the first time is being written to the db
              <Button className='mt-4' type='submit' disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            )}
          />

        {/* <Button className='mt-4' type='submit'>Create Expense</Button> */}
      </form>
    {/* </form.Provider> */}
  </div>
  );
}

