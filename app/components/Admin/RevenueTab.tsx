'use client';

import React from 'react';

interface Booking {
  id: string;
  customer_name?: string;
  user_name?: string;
  total_amount?: number;
  total_price?: number;
  amount?: number;
  advance_paid?: number;
  tracker_status?: string;
  shoot_status?: string;
  status?: string;
}

interface RevenueTabProps {
  bookings: Booking[];
  isSuperAdmin: boolean;
}

export const RevenueTab = ({ bookings, isSuperAdmin }: RevenueTabProps) => {
  const isCancelled = (b: Booking) => 
    b.tracker_status === 'Cancelled' || b.shoot_status === 'cancelled' || b.status === 'Cancelled';

  const activeBookings = bookings.filter((b) => !isCancelled(b));

  const totalRevenue = activeBookings.reduce(
    (acc, b) => acc + (Number(b.total_amount || b.total_price || b.amount) || 0),
    0
  );

  const totalReceived = activeBookings.reduce(
    (acc, b) => acc + (Number(b.advance_paid) || (Number(b.total_amount || b.total_price || b.amount) || 0)),
    0
  );

  const totalDues = Math.max(0, totalRevenue - totalReceived);
  const estimatedProfit = Math.round(totalRevenue * 0.4);

  if (!isSuperAdmin) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 Weekly Revenue & Net Profit</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-400 font-mono">Total Revenue (Active)</p>
          <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-400 font-mono">Total Received</p>
          <p className="text-2xl font-bold text-cyan-400">₹{totalReceived.toLocaleString()}</p>
        </div>

        <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-400 font-mono">Outstanding Dues</p>
          <p className="text-2xl font-bold text-amber-400">₹{totalDues.toLocaleString()}</p>
        </div>

        <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-400 font-mono">Estimated Net Profit</p>
          <p className="text-2xl font-bold text-emerald-300">₹{estimatedProfit.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;