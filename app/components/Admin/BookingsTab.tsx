'use client';

import React, { useState } from 'react';

export interface Booking {
  id: string;
  user_name?: string;
  customer_name?: string;
  phone?: string;
  customer_phone?: string;
  package_name?: string;
  packageName?: string;
  amount?: number;
  total_amount?: number;
  total_price?: number;
  advance_paid?: number;
  event_date?: string;
  eventDate?: string;
  address?: string;
  status?: string;
  status_step?: number;
  tracker_status?: string;
  shoot_status?: string;
  cancelled_by?: string;
  cancel_reason?: string;
  created_at?: string;
}

interface BookingsTabProps {
  bookings: Booking[];
  todayDate: string;
  onRefresh: () => void;
  onInitiateCancel: (b: Booking) => void;
  searchQuery?: string;
}

export const BookingsTab = ({
  bookings,
  todayDate,
  onRefresh,
  onInitiateCancel,
  searchQuery = '',
}: BookingsTabProps) => {
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'TODAY' | 'COMPLETED' | 'PENDING' | 'CANCELLED'>('ALL');

  const isCancelled = (b: Booking) =>
    b.tracker_status === 'Cancelled' || b.shoot_status === 'cancelled' || b.status === 'Cancelled';
  const isCompleted = (b: Booking) =>
    !isCancelled(b) && (b.tracker_status === 'Assets Delivered' || b.status === 'Completed' || b.shoot_status === 'delivered');
  const isPending = (b: Booking) => !isCancelled(b) && !isCompleted(b);
  const isCreatedToday = (b: Booking) => (b.created_at ? b.created_at.split('T')[0] === todayDate : false);

  const filterBySearch = (textArray: (string | number | undefined | null)[]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return textArray.some((t) => t !== undefined && t !== null && t.toString().toLowerCase().includes(query));
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'TODAY' && !isCreatedToday(b)) return false;
    if (bookingFilter === 'COMPLETED' && !isCompleted(b)) return false;
    if (bookingFilter === 'PENDING' && !isPending(b)) return false;
    if (bookingFilter === 'CANCELLED' && !isCancelled(b)) return false;

    return filterBySearch([
      b.customer_name,
      b.user_name,
      b.customer_phone,
      b.phone,
      b.id,
      b.package_name,
      b.packageName,
      b.address,
      b.event_date,
      b.eventDate,
      b.tracker_status,
      b.cancelled_by,
    ]);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">📅 Bookings Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Cancellation Policy: Cancellable within 3 days and strictly before team dispatch.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold cursor-pointer hover:bg-cyan-500/30 transition"
        >
          🔄 Refresh Live Data
        </button>
      </div>

      {/* 5 FILTER CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <button
          onClick={() => setBookingFilter('ALL')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            bookingFilter === 'ALL' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">ALL Bookings</p>
          <p className="text-2xl font-bold text-white">{bookings.length}</p>
        </button>

        <button
          onClick={() => setBookingFilter('TODAY')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            bookingFilter === 'TODAY' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">Booked Today</p>
          <p className="text-2xl font-bold text-cyan-400">{bookings.filter(isCreatedToday).length}</p>
        </button>

        <button
          onClick={() => setBookingFilter('COMPLETED')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            bookingFilter === 'COMPLETED' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-400">{bookings.filter(isCompleted).length}</p>
        </button>

        <button
          onClick={() => setBookingFilter('PENDING')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            bookingFilter === 'PENDING' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{bookings.filter(isPending).length}</p>
        </button>

        <button
          onClick={() => setBookingFilter('CANCELLED')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            bookingFilter === 'CANCELLED' ? 'bg-rose-500/20 border-rose-500' : 'bg-[#18181b] border-gray-800'
          }`}
        >
          <p className="text-xs text-rose-400 font-bold">❌ Cancelled</p>
          <p className="text-2xl font-bold text-rose-400">{bookings.filter(isCancelled).length}</p>
        </button>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-10 border border-gray-800 rounded-2xl text-gray-500 font-mono">
            No matching bookings found in this filter.
          </div>
        ) : (
          filteredBookings.map((b) => {
            const clientName = b.customer_name || b.user_name || 'Client';
            const clientPhone = b.customer_phone || b.phone || 'N/A';
            const pkgName = b.package_name || b.packageName || 'Shoot Package';
            const eventDateVal = b.event_date || b.eventDate || 'N/A';
            const bookingAmt = b.total_amount || b.total_price || b.amount || 0;
            const orderCancelled = isCancelled(b);

            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4 border transition ${
                  orderCancelled
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-[#18181b] border-gray-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">
                      {clientName} ({clientPhone})
                    </h3>
                    {orderCancelled && (
                      <span className="text-[10px] bg-rose-500 text-white font-mono font-bold px-2 py-0.5 rounded">
                        CANCELLED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Package: <span className="text-gray-200 font-semibold">{pkgName}</span> | Shoot Date:{' '}
                    <span className="text-cyan-400 font-bold">{eventDateVal}</span>
                  </p>
                  {b.address && <p className="text-xs text-gray-300 mt-1">📍 Venue Location: {b.address}</p>}
                  <p className="text-xs text-green-400 font-bold mt-2">Amount: ₹{bookingAmt.toLocaleString()}</p>

                  {orderCancelled && (
                    <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 font-mono">
                      Cancelled by: <strong className="text-white">{b.cancelled_by || 'User (Customer)'}</strong>
                      {b.cancel_reason && (
                        <span className="text-gray-400 text-[11px] block mt-0.5">Reason: {b.cancel_reason}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs bg-[#0f0f11] p-3 rounded-xl border border-gray-800 text-right">
                    <p className="text-gray-400">Tracker Status:</p>
                    <p className={`font-bold ${orderCancelled ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {orderCancelled ? 'Cancelled' : b.tracker_status || 'Order Placed'}
                    </p>
                  </div>

                  {!orderCancelled && (
                    <button
                      onClick={() => onInitiateCancel(b)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      ❌ Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookingsTab;