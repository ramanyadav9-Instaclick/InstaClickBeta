'use client';

import React from 'react';
import { Booking } from './BookingsTab';

interface ShootsScheduleTabProps {
  bookings: Booking[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onTrackerUpdate: (bookingId: string, status: string, name: string) => void;
  searchQuery?: string;
}

export const ShootsScheduleTab = ({
  bookings,
  selectedDate,
  onDateChange,
  onTrackerUpdate,
  searchQuery = '',
}: ShootsScheduleTabProps) => {
  const todayDate = new Date().toISOString().split('T')[0];

  const isCancelled = (b: Booking) =>
    b.tracker_status === 'Cancelled' || b.shoot_status === 'cancelled' || b.status === 'Cancelled';

  const filterBySearch = (textArray: (string | number | undefined | null)[]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return textArray.some((t) => t !== undefined && t !== null && t.toString().toLowerCase().includes(query));
  };

  const scheduledShoots = bookings.filter((b) => {
    const eventDateVal = b.event_date || b.eventDate;
    if (eventDateVal !== selectedDate || isCancelled(b)) return false;
    return filterBySearch([b.customer_name, b.user_name, b.customer_phone, b.phone, b.id, b.package_name, b.address, b.tracker_status]);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 bg-[#18181b] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            🎥 Shoots Schedule & Location Finder
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Showing shoots for: <span className="text-white font-bold">{selectedDate === todayDate ? `TODAY (${todayDate})` : selectedDate}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-[#0f0f11] border border-cyan-400 text-cyan-300 font-bold text-xs p-2.5 rounded-xl outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        {scheduledShoots.length === 0 ? (
          <div className="text-center py-12 border border-gray-800 rounded-2xl text-gray-500 font-mono">
            No active shoots scheduled for {selectedDate}.
          </div>
        ) : (
          scheduledShoots.map((b) => (
            <div key={b.id} className="bg-[#18181b] border-2 border-cyan-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold bg-cyan-400 text-black px-2 py-0.5 rounded font-mono">
                    DATE: {b.event_date || b.eventDate}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {b.customer_name || b.user_name} ({b.customer_phone || b.phone})
                  </h3>
                  <p className="text-xs text-gray-300">Package: <span className="font-bold text-cyan-300">{b.package_name}</span></p>
                </div>
                <span className="text-sm font-bold text-cyan-400">{b.tracker_status || 'Order Placed'}</span>
              </div>

              <div className="bg-[#0f0f11] p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                📍 Venue: {b.address || 'Not specified'}
              </div>

              <div className="flex justify-between items-center bg-[#141416] p-3 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-300 font-bold">Update Tracker:</span>
                <select
                  value={b.tracker_status || 'Order Placed'}
                  onChange={(e) => onTrackerUpdate(b.id, e.target.value, b.customer_name || 'Client')}
                  className="bg-[#0f0f11] text-xs p-2 rounded-xl border border-cyan-500 text-cyan-300 font-bold cursor-pointer"
                >
                  <option value="Order Placed">1. Shoot Booked ✅</option>
                  <option value="Team Dispatched">2. Team Dispatched 🚗</option>
                  <option value="On Location">3. On Location 📍</option>
                  <option value="Shoot Completed">4. Shoot Completed 📷</option>
                  <option value="Assets Delivered">5. Assets Delivered 🌟</option>
                  <option value="Cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShootsScheduleTab;