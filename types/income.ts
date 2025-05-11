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
