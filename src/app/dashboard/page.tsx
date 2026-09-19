import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, LogOut, IndianRupee } from 'lucide-react'
import { format } from 'date-fns'
import { Expense } from '@/types/expense'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error(error)
  }

  const list: Expense[] = expenses || []

  const hardikTotal = list
    .filter((e) => e.paid_by === 'Hardik Patil')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const vishalTotal = list
    .filter((e) => e.paid_by === 'Vishal Shelke')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const grandTotal = hardikTotal + vishalTotal

  const userEmail = (user.email || '').toLowerCase()
  const displayName =
    userEmail === 'patilhardik367@gmail.com'
      ? 'Hardik Patil'
      : userEmail === 'shelkevpatil@gmail.com'
      ? 'Vishal Shelke'
      : user.email

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">Lumagen Life Sciences</h1>
              <p className="text-xs text-slate-500">Expense Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">{displayName}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Hardik spent</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{hardikTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Vishal spent</p>
            <p className="text-2xl font-bold text-teal-600">
              ₹{vishalTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Total spent</p>
            <p className="text-2xl font-bold text-slate-800">
              ₹{grandTotal.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Recent Expenses</h2>
          <Link
            href="/expenses/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md shadow-blue-100 transition"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </Link>
        </div>

        {/* Expense List */}
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <IndianRupee className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No expenses yet</p>
            <p className="text-sm text-slate-400 mt-1">Add your first expense to get started</p>
            <Link
              href="/expenses/new"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl"
            >
              <Plus className="w-5 h-5" />
              Add First Expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((expense) => (
              <Link
                key={expense.id}
                href={`/expenses/${expense.id}`}
                className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                      <span>{format(new Date(expense.date), 'dd MMM yyyy')}</span>
                      <span>•</span>
                      <span
                        className={
                          expense.paid_by === 'Hardik Patil'
                            ? 'text-blue-600 font-medium'
                            : 'text-teal-600 font-medium'
                        }
                      >
                        {expense.paid_by}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 truncate">
                      {expense.description || expense.category}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {expense.category}
                      </span>
                      {expense.vendor && (
                        <span className="text-sm text-slate-500 truncate">
                          {expense.vendor}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-slate-800">
                      ₹{Number(expense.amount).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{expense.payment_method}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
