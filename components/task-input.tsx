"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { addTask } from "@/lib/redux/slices/taskSlice"
import type { PriorityLevel, Task } from "@/lib/types"

export default function TaskInput() {
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<PriorityLevel>("medium")
  const [isOutdoor, setIsOutdoor] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (text.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: text.trim(),
        done: false,
        priority,
        isOutdoor,
        createdAt: new Date().toISOString(),
      }

      dispatch(addTask(newTask))
      setText("")
      setPriority("medium")
      setIsOutdoor(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task">Task Description</Label>
        <Input
          id="task"
          placeholder="Enter your task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <RadioGroup
          value={priority}
          onValueChange={(value) => setPriority(value as PriorityLevel)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="text-red-500 dark:text-red-400 font-medium">
              High
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-amber-500 dark:text-amber-400 font-medium">
              Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="text-green-500 dark:text-green-400 font-medium">
              Low
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="outdoor" checked={isOutdoor} onCheckedChange={(checked) => setIsOutdoor(checked as boolean)} />
        <Label htmlFor="outdoor">This is an outdoor activity</Label>
      </div>

      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  )
}

