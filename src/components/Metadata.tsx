"use client"

import { useTranslation } from "@/src/lib/i18n-client"
import Head from "next/head"

export default function Metadata() {
  const { t } = useTranslation()

  return (
    <Head>
      <title>Stripy | {t("heroTitle")}</title>
      <meta name="description" content={`Stripy ${t("heroSubtitle")}`} />
    </Head>
  )
}