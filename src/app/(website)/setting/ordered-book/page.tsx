import OrderedBooksPage from '@/components/setting/ordered-books/MainOrder'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-400">Loading...</div>}>
      <OrderedBooksPage />
    </Suspense>
  );
}

export default page
