"use client"

import type React from "react"

import type { ReactNode } from "react"
import { Button } from "@/src/components/ui/button"

interface ScrollToSectionProps {
  targetId: string
  children: ReactNode
  className?: string
}

export default function ScrollToSection({ targetId, children, className }: ScrollToSectionProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      // Scroll to the element with a slight offset to account for the sticky header
      const headerOffset = 80
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <Button size="lg" className={className} asChild>
      <a href={`#${targetId}`} onClick={handleClick}>
        {children}
      </a>
    </Button>
  )
}

