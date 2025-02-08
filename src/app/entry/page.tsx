'use client';
import { EntryPageClient } from '@/components/EntryComponents';
import Header from '@/components/ui/Header'

export default function Page() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {<EntryPageClient />}
      </main>
    </>
  )
}