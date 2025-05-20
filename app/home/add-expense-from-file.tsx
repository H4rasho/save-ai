'use client'

import {addExpensesFromFile} from '@/actions/add-expense'
import {useActionState, useRef, useState} from 'react'

export const AddExpenseFromFile = () => {
  const [form, formAction, isPending] = useActionState(
    //@ts-ignore
    addExpensesFromFile,
    null
  )

  return (
    <form
      action={formAction}
      style={{display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400}}
    >
      <label style={{fontWeight: 500}}>Subir comprobante (PDF):</label>
      <input
        type="file"
        name="file"
        accept="application/pdf"
        style={{padding: 8}}
      />
      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: 10,
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        {isPending ? 'Cargando...' : 'Subir PDF'}
      </button>
    </form>
  )
}
