import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

interface FixedExpense {
  name: string
  amount: string
}

export function FixedExpensesForm() {
  const [expenses, setExpenses] = useState<FixedExpense[]>([])
  const [expenseName, setExpenseName] = useState('')
  const [amount, setAmount] = useState('')

  const handleAddExpense = () => {
    if (!expenseName.trim() || !amount.trim()) return
    setExpenses([...expenses, {name: expenseName, amount}])
    setExpenseName('')
    setAmount('')
  }

  const handleRemoveExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium text-base">Fixed Expenses</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Expense name"
          value={expenseName}
          onChange={e => setExpenseName(e.target.value)}
        />
        <Input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <Button onClick={handleAddExpense}>Add</Button>
      </div>
      <ul className="flex flex-col gap-2">
        {expenses.map((expense, idx) => (
          <li key={idx} className="flex justify-between items-center border p-2 rounded">
            <span>{expense.name}: ${expense.amount}</span>
            <Button size="sm" variant="destructive" onClick={() => handleRemoveExpense(idx)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
