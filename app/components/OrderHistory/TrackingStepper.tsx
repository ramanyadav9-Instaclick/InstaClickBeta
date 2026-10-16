"use client";
import React from "react";
import { Clock, Truck, MapPin, Camera, Target, XCircle } from "lucide-react";

type StepStatus = "upcoming" | "active" | "completed";

const steps = [
  { key: "booked", label: "Shoot Booked ✅", icon: Clock },
  { key: "dispatch", label: "Team Dispatched 🚗", icon: Truck },
  { key: "location", label: "On Location 📍", icon: MapPin },
  { key: "shoot_done", label: "Shoot Completed 📷", icon: Camera },
  { key: "delivered", label: "Assets Delivered 🌟", icon: Target },
];

interface TrackingStepperProps {
  currentStatus: "booked" | "dispatch" | "location" | "shoot_done" | "completed" | "delivered" | "cancelled" | string;
  isCancelled?: boolean;
}

export default function TrackingStepper({ currentStatus, isCancelled = false }: TrackingStepperProps) {
  const isOrderCancelled = isCancelled || currentStatus === "cancelled";

  const getStatus = (stepKey: string, current: string): StepStatus => {
    // Normalization mapping taaki koi bhi string aaye toh sahi step identify ho
    let normalized = current;
    if (current === "dispatched") normalized = "dispatch";
    if (current === "completed") normalized = "shoot_done";

    const keys = steps.map((s) => s.key);
    const currentIndex = keys.indexOf(normalized);
    const stepIndex = keys.indexOf(stepKey);

    if (currentIndex === -1) {
      if ((current === "dispatched" || current === "dispatch") && stepKey === "dispatch") return "active";
      if (current === "location" && stepKey === "location") return "active";
      if ((current === "completed" || current === "shoot_done") && stepKey === "shoot_done") return "active";
      if (current === "delivered" && stepKey === "delivered") return "active";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  if (isOrderCancelled) {
    return (
      <div className="max-w-4xl mx-auto py-4 w-full">
        <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/30 shrink-0">
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
    <div className="max-w-4xl mx-auto py-6 w-full">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const status = getStatus(step.key, currentStatus);
          const isLast = idx === steps.length - 1;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center shrink-0 relative group z-10">
                <div className="w-12 sm:w-14 h-12 sm:h-14 flex flex-col items-center justify-center text-center px-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      status === "completed"
                        ? "bg-[#00E5FF] text-black shadow-[0_0_15px_#00E5FF]"
                        : status === "active"
                        ? "bg-black text-[#00E5FF] border-2 border-dashed border-[#00E5FF] animate-pulse"
                        : "bg-neutral-900 border-2 border-neutral-700 text-gray-400"
                    }`}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${status === "active" ? "animate-bounce" : ""}`} />
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold mt-2 text-center max-w-[75px] sm:max-w-[100px] leading-tight truncate ${
                      status === "upcoming" ? "text-gray-500" : "text-white"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 -mt-6 rounded transition-all duration-500 relative">
                  <div
                    className={`h-full w-full ${
                      status === "completed" ? "bg-[#00E5FF]" : "bg-neutral-800"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}