'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
      title="Logout"
    >
      <LogOut className="w-5 h-5" />
    </button>
  )
}
