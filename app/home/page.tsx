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

import {HomeServerPagination} from './page-server-pagination'
import {redirect} from 'next/navigation'

export default async function Home({
  searchParams,
}: {
  searchParams: {page?: string; pageSize?: string}
}) {
  const page = Math.max(1, parseInt(searchParams?.page || '1', 10))
  const pageSize = Math.max(1, parseInt(searchParams?.pageSize || '10', 10))

  // Fetch paginated expenses
  const expensesResult = await client.execute({
    sql: `SELECT expenses.id, expenses.name, expenses.amount, categories.name as category, expenses.created_at as date FROM expenses
      INNER JOIN categories ON expenses.category_id = categories.id
      ORDER BY expenses.created_at DESC
      LIMIT ? OFFSET ?`,
    args: [pageSize, (page - 1) * pageSize],
  })
  const data = expensesResult.rows.map(expense => ({
    id: expense.id,
    moveType: 'expense',
    category: expense.category as string,
    description: expense.name as string,
    date: expense.date as string,
    amount: Number(expense.amount),
  }))

  // Fetch total count
  const totalCountResult = await client.execute({
    sql: `SELECT COUNT(*) as count FROM expenses`,
  })
  const totalCount = Number(totalCountResult.rows[0]?.count || 0)

  const categories = await client.execute({
    sql: 'SELECT * FROM categories',
  })
  const categoriesData = categories.rows.map(category => ({
    id: Number(category.id),
    name: category.name as string,
  }))

  // Redirect to first page if page is out of range
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  if (page > totalPages && totalPages > 0) {
    redirect(`?page=1&pageSize=${pageSize}`)
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto py-10">
      <div className="flex gap-4 mb- self-end">
        <AddExpenseDialog categories={categoriesData} />
        <AddExpenseFromFile />
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Movements</h2>
      </div>
      <HomeServerPagination
        data={data}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
      />
    </div>
  )
}
