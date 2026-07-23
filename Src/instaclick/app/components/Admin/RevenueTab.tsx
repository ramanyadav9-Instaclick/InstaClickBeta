'use client';

import React from 'react';

interface Payment {
  id: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
}

interface RevenueTabProps {
  payments: Payment[];
  isSuperAdmin: boolean;
}

export const RevenueTab = ({ payments, isSuperAdmin }: RevenueTabProps) => {
  const totalReceived = payments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalDues = payments.reduce((acc, p) => acc + p.dueAmount, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">💳 Payments & Revenue Overview</h2>

      {/* Super Admin Profit Cards */}
      {isSuperAdmin && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
            <p className="text-xs text-gray-400">Total Received</p>
            <p className="text-2xl font-bold text-green-400">₹{totalReceived.toLocaleString()}</p>
          </div>

          <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
            <p className="text-xs text-gray-400">Total Outstanding Dues</p>
            <p className="text-2xl font-bold text-red-400">₹{totalDues.toLocaleString()}</p>
          </div>

          <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
            <p className="text-xs text-gray-400">Weekly Earnings</p>
            <p className="text-2xl font-bold text-cyan-400">₹1,15,000</p>
          </div>

          <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
            <p className="text-xs text-gray-400">Weekly Net Profit</p>
            <p className="text-2xl font-bold text-emerald-300">₹45,000</p>
          </div>
        </div>
      )}

      {/* Customer Wise Payment Table */}
      <div className="bg-[#18181b] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#141416] text-gray-400 text-xs uppercase border-b border-gray-800">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Paid Amount</th>
              <th className="p-4">Due Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-gray-800 hover:bg-[#1c1c1f]">
                <td className="p-4 font-bold text-white">{p.customerName}</td>
                <td className="p-4">₹{p.totalAmount.toLocaleString()}</td>
                <td className="p-4 text-green-400 font-semibold">₹{p.paidAmount.toLocaleString()}</td>
                <td className="p-4 text-red-400 font-semibold">₹{p.dueAmount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueTab;