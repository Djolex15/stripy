"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"

interface BenefitCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="h-full">
        <CardHeader className="flex items-center justify-center pb-2">
          <div className="rounded-full bg-[#cbff01]/10 p-4 mb-2">{icon}</div>
          <h3 className="text-xl font-semibold text-center">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

