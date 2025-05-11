import {Input} from '@/components/ui/input'

interface CheckYourCurrencyProps {
  currency: string
  onCurrencyChange: (currency: string) => void
}

export const CheckYourCurrency = ({
  currency,
  onCurrencyChange,
}: CheckYourCurrencyProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="currency" className="text-sm font-medium text-start">
          Currency
        </label>
        <Input
          id="currency"
          placeholder={currency}
          className="w-full"
          onChange={e => onCurrencyChange(e.target.value)}
        />
      </div>
    </div>
  )
}
