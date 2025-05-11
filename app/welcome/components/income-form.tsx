import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

interface Income {
  source: string
  amount: string
}

interface IncomeFormProps {
  incomeSources: Income[]
  onIncomeSourcesChange: (incomeSources: Income[]) => void
}

export function IncomeForm({
  incomeSources,
  onIncomeSourcesChange,
}: IncomeFormProps) {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')

  const handleAddIncome = () => {
    if (!source.trim() || !amount.trim()) return
    setIncomes([...incomes, {source, amount}])
    setSource('')
    setAmount('')
    onIncomeSourcesChange([...incomeSources, {source, amount}])
  }

  const handleRemoveIncome = (index: number) => {
    setIncomes(incomes.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium text-base">Income</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Income source"
          value={source}
          onChange={e => setSource(e.target.value)}
        />
        <Input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <Button onClick={handleAddIncome}>Add</Button>
      </div>
      <ul className="flex flex-col gap-2">
        {incomes.map((income, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              {income.source}: ${income.amount}
            </span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRemoveIncome(idx)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
