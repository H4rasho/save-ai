'use client'

import {X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Separator} from '@/components/ui/separator'
import {SignIn as ClerkSignIn} from '@clerk/nextjs'
import {defineStepper} from '@stepperize/react'
import {Fragment, useState} from 'react'

const {useStepper, steps, utils} = defineStepper(
  {
    id: 'signIn',
    title: 'Sign In',
    description: 'Sign in to your account',
  },
  {
    id: 'checkYourCurrency',
    title: 'Check your Currency',
    description: 'Enter your payment details',
  },
  {
    id: 'selectYourCategories',
    title: 'Select your Categories',
    description: 'Select your Categories',
  }
)

interface StepperOnboardingProps {
  currency: string
}

export function StepperOnboarding({currency}: StepperOnboardingProps) {
  const stepper = useStepper()

  const currentIndex = utils.getIndex(stepper.current.id)

  return (
    <div className="space-y-6 p-6 border rounded-lg w-[500px]">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Welcome to Save IA</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <div />
        </div>
      </div>
      <nav aria-label="Checkout Steps" className="group my-4">
        <ol className="flex flex-col gap-2">
          {stepper.all.map((step, index, array) => (
            <Fragment key={step.id}>
              <li className="flex items-center gap-4 flex-shrink-0">
                <Button
                  type="button"
                  role="tab"
                  variant={index <= currentIndex ? 'default' : 'secondary'}
                  aria-current={
                    stepper.current.id === step.id ? 'step' : undefined
                  }
                  aria-posinset={index + 1}
                  aria-setsize={steps.length}
                  aria-selected={stepper.current.id === step.id}
                  className="flex size-10 items-center justify-center rounded-full"
                  onClick={() => stepper.goTo(step.id)}
                >
                  {index + 1}
                </Button>
                <span className="text-sm font-medium">{step.title}</span>
              </li>
              <div className="flex gap-4">
                {index < array.length - 1 && (
                  <div
                    className="flex justify-center"
                    style={{
                      paddingInlineStart: '1.25rem',
                    }}
                  >
                    <Separator
                      orientation="vertical"
                      className={`w-[1px] h-full ${
                        index < currentIndex ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  </div>
                )}
                <div className="flex-1 my-4">
                  {stepper.current.id === step.id &&
                    stepper.switch({
                      signIn: () => <SignIn />,
                      checkYourCurrency: () => (
                        <CheckYourCurrency currency={currency} />
                      ),
                      selectYourCategories: () => <SelectYourCategories />,
                    })}
                </div>
              </div>
            </Fragment>
          ))}
        </ol>
      </nav>
      <div className="space-y-4">
        {!stepper.isLast ? (
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={stepper.prev}
              disabled={stepper.isFirst}
            >
              Back
            </Button>
            <Button onClick={stepper.next}>
              {stepper.isLast ? 'Complete' : 'Next'}
            </Button>
          </div>
        ) : (
          <Button onClick={stepper.reset}>Reset</Button>
        )}
      </div>
    </div>
  )
}

const SignIn = () => {
  return <ClerkSignIn />
}

const CheckYourCurrency = ({currency}: StepperOnboardingProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="currency" className="text-sm font-medium text-start">
          Currency
        </label>
        <Input id="currency" placeholder={currency} className="w-full" />
      </div>
    </div>
  )
}

const categories = [
  {
    id: 'food',
    name: 'Food',
  },
  {
    id: 'transport',
    name: 'Transport',
  },
  {
    id: 'health',
    name: 'Health',
  },
  {
    id: 'education',
    name: 'Education',
  },
]

const SelectYourCategories = () => {
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(categories)

  const handleSelectCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c.id !== category))
  }

  const handleAddCategory = ({category}: {category: string}) => {
    setSelectedCategories(prev => [...prev, {id: category, name: category}])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {selectedCategories.map(category => (
          <Button
            size="sm"
            key={category.id}
            onClick={() => handleSelectCategory(category.id)}
          >
            <X />
            {category.name}
          </Button>
        ))}
      </div>
      <Input
        placeholder="Add Category"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
      />
      <Button onClick={() => handleAddCategory({category: newCategory})}>
        Add Category
      </Button>
    </div>
  )
}
