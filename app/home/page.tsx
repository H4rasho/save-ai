import {Payment, columns} from './columns'
import {DataTable} from './data-table'
import {AddExpenseDialog} from './AddExpenseDialog'
import {client} from '@/database/database'
import {AddExpenseFromFile} from './add-expense-from-file'
import {unstable_cache} from 'next/cache'

const getExpenses = unstable_cache(
  async () => {
    const expenses = await client.execute({
      sql: `SELECT expenses.id, expenses.name, expenses.amount, categories.name as category, expenses.created_at as date FROM expenses
    INNER JOIN categories ON expenses.category_id = categories.id`,
    })
    return expenses.rows.map(expense => ({
      id: expense.id,
      moveType: 'expense',
      category: expense.category as string,
      description: expense.name as string,
      date: expense.date as string,
      amount: Number(expense.amount),
    }))
  },
  ['expenses'],
  {tags: ['expenses']}
)

export default async function Home() {
  const data = await getExpenses()

  const categories = await client.execute({
    sql: 'SELECT * FROM categories',
  })
  const categoriesData = categories.rows.map(category => ({
    id: Number(category.id),
    name: category.name as string,
  }))

  return (
    <div className="flex flex-col max-w-6xl mx-auto py-10">
      <div className="flex gap-4 mb-4 self-end">
        <AddExpenseDialog categories={categoriesData} />
        <AddExpenseFromFile />
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Movements</h2>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
