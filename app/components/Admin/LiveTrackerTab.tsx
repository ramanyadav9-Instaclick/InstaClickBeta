'use client';

import React from 'react';
import { Booking } from './BookingsTab';

interface LiveTrackerTabProps {
  bookings: Booking[];
  onTrackerUpdate: (bookingId: string, status: string, name: string) => void;
  searchQuery?: string;
}

export const LiveTrackerTab = ({
  bookings,
  onTrackerUpdate,
  searchQuery = '',
}: LiveTrackerTabProps) => {
  const isCancelled = (b: Booking) =>
    b.tracker_status === 'Cancelled' || b.shoot_status === 'cancelled' || b.status === 'Cancelled';

  const filterBySearch = (textArray: (string | number | undefined | null)[]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return textArray.some((t) => t !== undefined && t !== null && t.toString().toLowerCase().includes(query));
  };

  const filteredBookings = bookings.filter((b) =>
    filterBySearch([b.customer_name, b.user_name, b.customer_phone, b.phone, b.id, b.package_name, b.tracker_status, b.address])
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">📍 Live Dot Tracker System</h2>
      {filteredBookings.length === 0 ? (
        <div className="text-center py-10 border border-gray-800 rounded-2xl text-gray-500 font-mono">
          No bookings found.
        </div>
      ) : (
        filteredBookings.map((b) => {
          const cancelled = isCancelled(b);
          return (
            <div key={b.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-white text-lg">
                  {b.customer_name || b.user_name} ({b.package_name || 'Package'})
                </h3>
                <p className="text-xs text-cyan-400">Current: {b.tracker_status || 'Order Placed'}</p>
                {b.address && <p className="text-xs text-gray-400 mt-1">📍 {b.address}</p>}
              </div>

              <select
                value={b.tracker_status || 'Order Placed'}
                disabled={cancelled}
                onChange={(e) => onTrackerUpdate(b.id, e.target.value, b.customer_name || 'Client')}
                className={`text-xs p-2.5 rounded-xl border font-bold cursor-pointer ${
                  cancelled
                    ? 'bg-neutral-900 border-neutral-800 text-gray-600 cursor-not-allowed'
                    : 'bg-[#0f0f11] border-cyan-500 text-cyan-300'
                }`}
              >
                <option value="Order Placed">1. Shoot Booked ✅</option>
                <option value="Team Dispatched">2. Team Dispatched 🚗</option>
                <option value="On Location">3. On Location 📍</option>
                <option value="Shoot Completed">4. Shoot Completed 📷</option>
                <option value="Assets Delivered">5. Assets Delivered 🌟</option>
                <option value="Cancelled">❌ Cancelled</option>
              </select>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LiveTrackerTab;