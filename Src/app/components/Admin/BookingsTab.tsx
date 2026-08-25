'use client';

import React, { useState } from 'react';

interface Booking {
  id: string;
  customerName: string;
  date: string;
  assetDetails: string;
  status: 'Pending' | 'Completed';
  trackerStatus: string;
}

interface BookingsTabProps {
  bookings: Booking[];
  todayDate: string;
}

export const BookingsTab = ({ bookings, todayDate }: BookingsTabProps) => {
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'COMPLETED' | 'PENDING'>('ALL');

  // Filter & Sort (Alphabetical Order A to Z)
  const filteredBookings = bookings
    .filter((b) => {
      if (filter === 'TODAY') return b.date === todayDate;
      if (filter === 'COMPLETED') return b.status === 'Completed';
      if (filter === 'PENDING') return b.status === 'Pending';
      return true;
    })
    .sort((a, b) => a.customerName.localeCompare(b.customerName));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📅 Bookings Management (Alphabetical Order)</h2>

      {/* Clickable Filter Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`p-4 rounded-xl border text-left transition ${
            filter === 'ALL' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">ALL Bookings</p>
          <p className="text-2xl font-bold text-white">{bookings.length}</p>
        </button>

        <button
          onClick={() => setFilter('TODAY')}
          className={`p-4 rounded-xl border text-left transition ${
            filter === 'TODAY' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">Today's Bookings</p>
          <p className="text-2xl font-bold text-cyan-400">
            {bookings.filter((b) => b.date === todayDate).length}
          </p>
        </button>

        <button
          onClick={() => setFilter('COMPLETED')}
          className={`p-4 rounded-xl border text-left transition ${
            filter === 'COMPLETED' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-400">
            {bookings.filter((b) => b.status === 'Completed').length}
          </p>
        </button>

        <button
          onClick={() => setFilter('PENDING')}
          className={`p-4 rounded-xl border text-left transition ${
            filter === 'PENDING' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">
            {bookings.filter((b) => b.status === 'Pending').length}
          </p>
        </button>
      </div>

      {/* Customer Booking Cards */}
      <div className="space-y-4">
        {filteredBookings.map((b) => (
          <div key={b.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-white">{b.customerName}</h3>
              <p className="text-xs text-gray-400">Assets: {b.assetDetails} | Date: {b.date}</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-2 ${b.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {b.status}
              </span>
            </div>
            <div className="text-xs bg-[#0f0f11] p-3 rounded-xl border border-gray-800">
              <p className="text-gray-400">Tracker Status:</p>
              <p className="text-cyan-400 font-bold">{b.trackerStatus}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsTab;