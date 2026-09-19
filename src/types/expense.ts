export type Expense = {
  id: string
  created_at: string
  date: string
  paid_by: 'Hardik Patil' | 'Vishal Shelke'
  category: string
  description: string
  vendor: string | null
  amount: number
  payment_method: string
  business_purpose: string | null
  screenshot_url: string | null
  created_by: string
}

export const CATEGORIES = [
  'Company Registration',
  'Laboratory Supplies',
  'Travel',
  'Equipment',
  'Software',
  'Office Supplies',
  'Marketing',
  'Legal & Compliance',
  'Samples',
  'Utilities',
  'Other'
] as const

export const PAYMENT_METHODS = [
  'UPI',
  'Bank Transfer',
  'Cash',
  'Card',
  'Cheque'
] as const
