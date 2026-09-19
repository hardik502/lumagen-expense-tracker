'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteExpenseButton({ expenseId }: { expenseId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense? This cannot be undone.')) {
      return
    }

    setLoading(true)
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId)

    if (error) {
      alert('Failed to delete: ' + error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium transition disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Trash2 className="w-5 h-5" />
          Delete Expense
        </>
      )}
    </button>
  )
}
