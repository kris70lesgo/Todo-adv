"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import type { RootState } from "@/lib/redux/store"
import { Cloud, CloudRain, Sun, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface WeatherData {
  main: {
    temp: number
  }
  weather: {
    main: string
    description: string
    icon: string
  }[]
  name: string
}

// Mock weather data for different locations
const mockWeatherDatabase: Record<string, WeatherData> = {
  "New York": {
    main: { temp: 22.5 },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    name: "New York",
  },
  London: {
    main: { temp: 18.2 },
    weather: [{ main: "Rain", description: "light rain", icon: "10d" }],
    name: "London",
  },
  Tokyo: {
    main: { temp: 26.8 },
    weather: [{ main: "Clouds", description: "scattered clouds", icon: "03d" }],
    name: "Tokyo",
  },
  Sydney: {
    main: { temp: 24.3 },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    name: "Sydney",
  },
  Paris: {
    main: { temp: 19.7 },
    weather: [{ main: "Clouds", description: "broken clouds", icon: "04d" }],
    name: "Paris",
  },
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState("New York")
  const [inputLocation, setInputLocation] = useState("New York")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const { toast } = useToast()

  const outdoorTasks = tasks.filter((task) => task.isOutdoor && !task.done)

  useEffect(() => {
    fetchWeather()
  }, [location])

  const fetchWeather = async () => {
    if (!location) return

    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check if we have mock data for this location
      const normalizedLocation = location.trim()
      const mockData = mockWeatherDatabase[normalizedLocation]

      if (mockData) {
        setWeather(mockData)
      } else {
        // Generate random weather for unknown locations
        const randomTemp = Math.round(15 + Math.random() * 15)
        const weatherTypes = ["Clear", "Clouds", "Rain"]
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]

        const descriptions = {
          Clear: "clear sky",
          Clouds: "scattered clouds",
          Rain: "light rain",
        }

        setWeather({
          main: { temp: randomTemp },
          weather: [
            {
              main: randomWeather,
              description: descriptions[randomWeather as keyof typeof descriptions],
              icon: randomWeather === "Clear" ? "01d" : randomWeather === "Clouds" ? "03d" : "10d",
            },
          ],
          name: normalizedLocation,
        })
      }
    } catch (err) {
      console.error("Weather fetch error:", err)
      setError("Failed to load weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (inputLocation.trim() === "") {
      toast({
        title: "Location required",
        description: "Please enter a location name",
        variant: "destructive",
      })
      return
    }

    setLocation(inputLocation)
    toast({
      title: "Weather updated",
      description: `Weather information for ${inputLocation} has been updated`,
    })
  }

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-12 w-12 text-gray-400" />

    const condition = weather.weather[0].main.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="h-12 w-12 text-blue-500" />
    } else if (condition.includes("clear")) {
      return <Sun className="h-12 w-12 text-amber-500" />
    } else {
      return <Cloud className="h-12 w-12 text-gray-500" />
    }
  }

  const isGoodWeatherForOutdoor = () => {
    if (!weather) return false

    const condition = weather.weather[0].main.toLowerCase()
    const temp = weather.main.temp

    // Simple logic: good weather is when it's not raining and temperature is between 15°C and 30°C
    return !condition.includes("rain") && !condition.includes("storm") && temp >= 15 && temp <= 30
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleLocationSubmit} className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex space-x-2">
          <Input
            id="location"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
            placeholder="Enter city name"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Try: New York, London, Tokyo, Sydney, Paris</p>
      </form>

      {error ? (
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500 dark:text-red-400" />
              <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
          </CardContent>
        </Card>
      ) : weather ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              {getWeatherIcon()}
              <h3 className="mt-2 text-xl font-semibold">{weather.name}</h3>
              <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
              <p className="text-gray-500 dark:text-gray-400">{weather.weather[0].description}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {outdoorTasks.length > 0 && weather && (
        <div className="mt-4 rounded-lg border bg-gray-50 p-4 dark:bg-gray-800/50 dark:border-gray-700">
          <h3 className="mb-2 font-semibold">Outdoor Tasks Weather Check</h3>
          <p>
            {isGoodWeatherForOutdoor()
              ? "Good weather for your outdoor tasks! ☀️"
              : "Weather may not be ideal for outdoor activities. ⚠️"}
          </p>
          <div className="mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You have {outdoorTasks.length} outdoor {outdoorTasks.length === 1 ? "task" : "tasks"} pending
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

