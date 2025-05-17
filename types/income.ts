export interface Income {
  source: string
  amount: string
}

export interface UserCreateProfile {
  selectedCurrency: string
  categories: string[]
  incomeSources: Income[]
  fixedExpenses: string[]
}

export interface CreateExpense {
  description: string
  amount: string
  category: string
}
