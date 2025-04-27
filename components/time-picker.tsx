"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface TimePickerDemoProps {
  setTime: (time: string) => void
}

export function TimePickerDemo({ setTime }: TimePickerDemoProps) {
  const [hours, setHours] = React.useState("12")
  const [minutes, setMinutes] = React.useState("00")
  const [ampm, setAmPm] = React.useState("PM")

  React.useEffect(() => {
    setTime(`${hours}:${minutes} ${ampm}`)
  }, [hours, minutes, ampm, setTime])

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={1}
        max={12}
        value={hours}
        onChange={(e) => setHours(e.target.value.padStart(2, "0"))}
        className="w-14 text-center"
      />
      <span>:</span>
      <Input
        type="number"
        min={0}
        max={59}
        value={minutes}
        onChange={(e) => setMinutes(e.target.value.padStart(2, "0"))}
        className="w-14 text-center"
      />
      <select
        value={ampm}
        onChange={(e) => setAmPm(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  )
}
