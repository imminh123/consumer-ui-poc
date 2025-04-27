"use client"

import { ChevronDown, ChevronUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface JourneyProgressProps {
  steps: string[]
  currentStep: number
  onToggle?: () => void
}

export function JourneyProgress({ steps, currentStep, onToggle }: JourneyProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium flex items-center gap-1">
          Journey Progress
          <span className="text-xs text-muted-foreground">
            ({currentStep + 1}/{steps.length})
          </span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-6 w-6 p-0">
          {onToggle &&
            (currentStep < steps.length - 1 ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />)}
        </Button>
      </div>

      <div className="w-full bg-secondary rounded-full h-2 mb-2">
        <motion.div
          className="bg-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${
                  index <= currentStep ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
            >
              {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
            </div>
            <span
              className={`text-xs mt-1 hidden md:block ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
