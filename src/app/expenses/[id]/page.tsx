import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Building2, CreditCard, FileText, Target } from 'lucide-react'
import { format } from 'date-fns'
import DeleteExpenseButton from '@/components/DeleteExpenseButton'

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: expense, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !expense) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-slate-800">Expense Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Amount header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-8 text-white">
            <p className="text-blue-100 text-sm mb-1">Amount</p>
            <p className="text-4xl font-bold">
              ₹{Number(expense.amount).toLocaleString('en-IN')}
            </p>
            <p className="mt-2 text-blue-100">{expense.description}</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            <DetailRow
              icon={<Calendar className="w-5 h-5" />}
              label="Date"
              value={format(new Date(expense.date), 'dd MMMM yyyy')}
            />
            <DetailRow
              icon={<User className="w-5 h-5" />}
              label="Paid by"
              value={expense.paid_by}
              highlight={expense.paid_by === 'Hardik Patil' ? 'blue' : 'teal'}
            />
            <DetailRow
              icon={<Tag className="w-5 h-5" />}
              label="Category"
              value={expense.category}
            />
            {expense.vendor && (
              <DetailRow
                icon={<Building2 className="w-5 h-5" />}
                label="Vendor"
                value={expense.vendor}
              />
            )}
            <DetailRow
              icon={<CreditCard className="w-5 h-5" />}
              label="Payment Method"
              value={expense.payment_method}
            />
            {expense.business_purpose && (
              <DetailRow
                icon={<Target className="w-5 h-5" />}
                label="Business Purpose"
                value={expense.business_purpose}
              />
            )}
            {expense.description && (
              <DetailRow
                icon={<FileText className="w-5 h-5" />}
                label="Description"
                value={expense.description}
              />
            )}
          </div>

          {/* Screenshot */}
          {expense.screenshot_url && (
            <div className="px-6 pb-6">
              <p className="text-sm font-medium text-slate-700 mb-3">Payment Screenshot</p>
              <a
                href={expense.screenshot_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={expense.screenshot_url}
                  alt="Payment screenshot"
                  className="w-full rounded-xl border border-slate-200 max-h-96 object-contain bg-slate-50"
                />
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <DeleteExpenseButton expenseId={expense.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: 'blue' | 'teal'
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p
          className={`font-medium ${
            highlight === 'blue'
              ? 'text-blue-600'
              : highlight === 'teal'
              ? 'text-teal-600'
              : 'text-slate-800'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
