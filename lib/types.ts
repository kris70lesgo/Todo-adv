export type PriorityLevel = "high" | "medium" | "low"

export interface Task {
  id: string
  text: string
  done: boolean
  priority: PriorityLevel
  isOutdoor: boolean
  createdAt: string
}

