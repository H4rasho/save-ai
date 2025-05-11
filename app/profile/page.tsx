import {currentUser} from '@clerk/nextjs/server'
import {client} from '@/database/database'

export default async function Profile() {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const userResult = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [user.emailAddresses[0].emailAddress],
  })

  const userId = userResult.rows[0].id

  const categories = await client.execute({
    sql: 'SELECT * FROM categories WHERE user_id = ?',
    args: [userId],
  })

  const incomeSources = await client.execute({
    sql: 'SELECT * FROM income_sources WHERE user_id = ?',
    args: [userId],
  })

  const fixedExpenses = await client.execute({
    sql: 'SELECT * FROM fixed_expenses WHERE user_id = ?',
    args: [userId],
  })

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.firstName}</p>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
      <p>Categories: {categories.rows.length}</p>
      <p>Income Sources: {incomeSources.rows.length}</p>
      <p>Fixed Expenses: {fixedExpenses.rows.length}</p>
    </div>
  )
}
