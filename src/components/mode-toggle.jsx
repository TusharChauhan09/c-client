import { IconMoon, IconSun } from "@tabler/icons-react"

import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full hover:bg-transparent focus:outline-none transition-colors"
    >
      <IconSun className="h-[1.2rem] w-[1.2rem] text-foreground dark:hidden" />
      <IconMoon className="hidden h-[1.2rem] w-[1.2rem] text-foreground dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
