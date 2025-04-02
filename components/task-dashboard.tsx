"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import TaskInput from "@/components/task-input"
import TaskList from "@/components/task-list"
import WeatherWidget from "@/components/weather-widget"
import type { RootState } from "@/lib/redux/store"
import { loadTasks } from "@/lib/redux/slices/taskSlice"
import AuthStatus from "@/components/auth-status"

export default function TaskDashboard() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      dispatch(loadTasks(JSON.parse(storedTasks)))
    }
  }, [dispatch])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Todo App</h1>
          <AuthStatus />
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:text-gray-100">
              <h2 className="mb-4 text-xl font-semibold">Add New Task</h2>
              <TaskInput />
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:text-gray-100">
              <h2 className="mb-4 text-xl font-semibold">Your Tasks</h2>
              <TaskList />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:text-gray-100">
            <h2 className="mb-4 text-xl font-semibold">Weather</h2>
            <WeatherWidget />
          </div>
        </div>
      </main>
    </div>
  )
}

