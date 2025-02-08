// import { SearchPageClient } from '@/components/SearchComponents';

// export default function Page() {
//   return <SearchPageClient />;
// }

'use client';
import { SearchPageClient } from '@/components/SearchComponents';
import Header from '@/components/ui/Header'

export default function Page() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {<SearchPageClient />}
      </main>
    </>
  )
}