"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Trash, Edit, Save, X, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { updateTask, deleteTask } from "@/lib/redux/slices/taskSlice"
import type { Task, PriorityLevel } from "@/lib/types"

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(task.text)
  const [editedPriority, setEditedPriority] = useState<PriorityLevel>(task.priority)
  const [editedIsOutdoor, setEditedIsOutdoor] = useState(task.isOutdoor)
  const dispatch = useDispatch()

  const handleToggleDone = () => {
    dispatch(updateTask({ ...task, done: !task.done }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedText(task.text)
    setEditedPriority(task.priority)
    setEditedIsOutdoor(task.isOutdoor)
  }

  const handleSaveEdit = () => {
    if (editedText.trim()) {
      dispatch(
        updateTask({
          ...task,
          text: editedText.trim(),
          priority: editedPriority,
          isOutdoor: editedIsOutdoor,
        }),
      )
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  return (
    <Card
      className={`border-l-4 ${task.done ? "border-l-gray-300 bg-gray-50 dark:bg-gray-800/50 dark:border-l-gray-600" : `border-l-${task.priority === "high" ? "red" : task.priority === "medium" ? "amber" : "green"}-500`}`}
    >
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input value={editedText} onChange={(e) => setEditedText(e.target.value)} className="w-full" />

            <div className="space-y-2">
              <Label>Priority</Label>
              <RadioGroup
                value={editedPriority}
                onValueChange={(value) => setEditedPriority(value as PriorityLevel)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id={`high-${task.id}`} />
                  <Label htmlFor={`high-${task.id}`} className="text-red-500 dark:text-red-400 font-medium">
                    High
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id={`medium-${task.id}`} />
                  <Label htmlFor={`medium-${task.id}`} className="text-amber-500 dark:text-amber-400 font-medium">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id={`low-${task.id}`} />
                  <Label htmlFor={`low-${task.id}`} className="text-green-500 dark:text-green-400 font-medium">
                    Low
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`outdoor-${task.id}`}
                checked={editedIsOutdoor}
                onCheckedChange={(checked) => setEditedIsOutdoor(checked as boolean)}
              />
              <Label htmlFor={`outdoor-${task.id}`}>This is an outdoor activity</Label>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSaveEdit}>
                <Save className="mr-1 h-4 w-4" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Checkbox checked={task.done} onCheckedChange={handleToggleDone} className="mt-1" />
              <div className="space-y-1">
                <p
                  className={`${task.done ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}
                >
                  {task.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>

                  {task.isOutdoor && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                    >
                      <Cloud className="mr-1 h-3 w-3" /> Outdoor
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-1">
              <Button size="icon" variant="ghost" onClick={handleEdit} disabled={task.done}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button size="icon" variant="ghost" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

