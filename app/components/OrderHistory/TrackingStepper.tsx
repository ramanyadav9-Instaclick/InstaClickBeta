"use client";
import React from "react";
import { Clock, Truck, MapPin, Target, XCircle } from "lucide-react";

type StepStatus = "upcoming" | "active" | "completed";

const steps = [
  { key: "booked", label: "Team allocated ✅", icon: Clock },
  { key: "dispatch", label: "Team on the Way", icon: Truck },
  { key: "location", label: "Reached Location", icon: MapPin },
  { key: "completed", label: "Framework Completed 🌟", icon: Target },
];

interface TrackingStepperProps {
  currentStatus: "booked" | "dispatch" | "location" | "completed" | "cancelled" | string;
  isCancelled?: boolean;
}

export default function TrackingStepper({ currentStatus, isCancelled = false }: TrackingStepperProps) {
  const isOrderCancelled = isCancelled || currentStatus === "cancelled";

  const getStatus = (stepKey: string, current: string): StepStatus => {
    const keys = steps.map((s) => s.key);
    const currentIndex = keys.indexOf(current);
    const stepIndex = keys.indexOf(stepKey);

    if (currentIndex === -1) {
      if (current === "dispatched" && stepKey === "dispatch") return "active";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  if (isOrderCancelled) {
    return (
      <div className="max-w-4xl mx-auto py-4">
        <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/30">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider font-mono">
                Booking Cancelled ❌
              </h4>
              <p className="text-xs text-gray-300 font-medium">
                This order has been cancelled. Refund process initiated.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const status = getStatus(step.key, currentStatus);
          const isLast = idx === steps.length - 1;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1 relative group">
                <div className="w-14 h-14 flex flex-col items-center justify-center text-center px-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      status === "completed"
                        ? "bg-[#00E5FF] text-black shadow-[0_0_15px_#00E5FF]"
                        : status === "active"
                        ? "bg-black text-[#00E5FF] border-2 border-dashed border-[#00E5FF] animate-pulse"
                        : "bg-neutral-900 border-2 border-neutral-700 text-gray-400"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${status === "active" ? "animate-bounce" : ""}`} />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 truncate w-full tracking-tight ${
                      status === "upcoming" ? "text-gray-500" : "text-white"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 w-full -mt-7 rounded transition-all duration-500 ${
                    status === "completed" ? "bg-[#00E5FF]" : "bg-neutral-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}