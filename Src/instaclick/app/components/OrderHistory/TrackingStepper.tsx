"use client";
import React from "react";
import { Clock, Truck, MapPin, CheckCircle, Target } from "lucide-react";

// Track states for Step Status
type StepStatus = "upcoming" | "active" | "completed";

// Steps definition with Icons
const steps = [
  { key: "booked", label: "Team allocated ✅", icon: Clock },
  { key: "dispatch", label: "Team on the Way", icon: Truck },
  { key: "location", label: "Reached Location", icon: MapPin },
  { key: "completed", label: "Framework Completed 🌟", icon: Target },
];

interface TrackingStepperProps {
  currentStatus: "booked" | "dispatch" | "location" | "completed";
}

export default function TrackingStepper({ currentStatus }: TrackingStepperProps) {
  
  const getStatus = (stepKey: string, current: string): StepStatus => {
    const keys = steps.map(s => s.key);
    const currentIndex = keys.indexOf(current);
    const stepIndex = keys.indexOf(stepKey);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-center space-x-1">
        {steps.map((step, idx) => {
          const status = getStatus(step.key, currentStatus);
          const isLast = idx === steps.length - 1;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1 relative group">
                <div className="w-14 h-14 flex flex-col items-center justify-center text-center px-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner ${status === 'completed' ? 'bg-[#00E5FF] text-black' : status === 'active' ? 'bg-black text-[#00E5FF] border-2 border-dashed border-[#00E5FF] animate-pulse' : 'bg-white border-2 border-neutral-200 text-gray-300'}`}>
                        <Icon className={`w-6 h-6 ${status === 'active' ? 'animate-bounce' : ''}`} />
                    </div>
                    <span className={`text-[10px] font-bold mt-2 lowercase truncate w-full tracking-tight ${status === 'upcoming' ? 'text-gray-400' : 'text-black'}`}>{step.label}</span>
                </div>
              </div>
              {!isLast && (
                <div className={`h-0.5 w-full -mt-7 -translate-x-1 rounded ${status === 'completed' ? 'bg-[#00E5FF]' : 'bg-neutral-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}