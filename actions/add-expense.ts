'use server'

import {client} from '@/database/database'
import {currentUser} from '@clerk/nextjs/server'
import {CreateExpense} from '@/types/income'

export async function addExpense(
  prevState: {
    message: string
  },
  formData: FormData
): Promise<void> {
  const user = await currentUser()
  const userEmail = user?.emailAddresses[0].emailAddress
  if (!userEmail) {
    throw new Error('User not found')
  }
  const userDb = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [userEmail],
  })
  const userId = userDb.rows[0].id

  //TODO: use zod to validate form data
  const form = Object.fromEntries(
    formData.entries()
  ) as unknown as CreateExpense

  const {description, amount, category} = form

  await client.execute({
    sql: 'INSERT INTO expenses (user_id, name, amount, category_id) VALUES (?, ?, ?, ?)',
    args: [userId, description, amount, category],
  })
}
