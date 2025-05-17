'use client'

import {ColumnDef} from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  moveType: string
  category: string
  description: string
  date: string
  amount: number
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'moveType',
    header: 'Type',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
]
