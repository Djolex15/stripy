"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Check, ChevronsUpDown, Globe } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/src/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { useTranslation } from "@/src/lib/i18n-client"

const languages = [
  { value: "sr", label: "Serbian" },
  { value: "en", label: "English" },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fetch user's location and set language
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        const countryCode = data.country_code
        const language = countryCode === "RS" ? "sr" : "en"
        i18n.changeLanguage(language)
      })
      .catch((error) => {
        console.error("Error fetching location:", error)
      })
  }, [i18n])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Globe className="h-5 w-5" />
      </Button>
    )
  }

  const currentLanguage = languages.find((lang) => lang.value === i18n.language) || languages[0]

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value)
    setOpen(false)

    // Refresh the current page to apply language changes
    router.refresh()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentLanguage.label}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem key={language.value} value={language.value} onSelect={() => handleLanguageChange(language.value)}>
                  {language.label}
                  {language.value === currentLanguage.value && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}