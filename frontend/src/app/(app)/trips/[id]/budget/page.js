'use client';
export const dynamic = 'force-dynamic';

import React, { use } from 'react';
import BudgetPage from '@/app/(app)/budget/[tripId]/page';

export default function TripBudgetRoutePage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;

  // Pass tripId as param to BudgetPage
  return <BudgetPage params={Promise.resolve({ tripId })} />;
}
