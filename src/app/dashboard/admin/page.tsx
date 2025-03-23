'use client'

import AdminHeader from '@/components/dashboard/admin/Header'
import AdminPanel from '@/components/dashboard/admin/AdminPanel'

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-[#F5F6F8] px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <AdminPanel />
        </div>
      </div>
    </>
  )
}
