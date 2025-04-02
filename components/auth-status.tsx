"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import ThemeToggle from "./theme-toggle"

export default function AuthStatus() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    // Clear auth token
    document.cookie = "auth-token=; path=/; max-age=0"
    localStorage.removeItem("user")
    setUser(null)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      {user ? (
        <>
          <span className="hidden text-sm text-gray-600 dark:text-gray-400 md:inline">{user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </>
      ) : (
        <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
          <LogIn className="mr-2 h-4 w-4" />
          <span className="hidden md:inline">Login</span>
        </Button>
      )}
    </div>
  )
}

