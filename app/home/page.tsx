import {Payment, columns} from './columns'
import {DataTable} from './data-table'
import {AddExpenseDialog} from './AddExpenseDialog'
import {client} from '@/database/database'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
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
}

export default async function Home() {
  const data = await getData()

  const categories = await client.execute({
    sql: 'SELECT * FROM categories',
  })
  const categoriesData = categories.rows.map(category => ({
    id: Number(category.id),
    name: category.name as string,
  }))

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <AddExpenseDialog categories={categoriesData} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
