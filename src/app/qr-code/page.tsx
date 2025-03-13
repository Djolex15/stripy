"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslation } from "@/src/lib/i18n-client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Plus, QrCode, RefreshCw, Trash } from "lucide-react"
import { toast } from "@/src/hooks/use-toast"

interface QRCode {
  id: string
  name: string
  url: string
  scans: number
  createdAt: string
}

export default function QRCodePage() {
  const { t } = useTranslation()
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [selectedQr, setSelectedQr] = useState<string | null>(null)
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null)
  const downloadRef = useRef<HTMLAnchorElement>(null)

  // Fetch QR codes on component mount
  useEffect(() => {
    fetchQrCodes()
  }, [])

  const fetchQrCodes = async () => {
    try {
      const response = await fetch("/api/qr-code")
      if (!response.ok) throw new Error("Failed to fetch QR codes")

      const data = await response.json()
      setQrCodes(data.qrCodes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load QR codes",
        variant: "destructive",
      })
    }
  }

  const generateQrCode = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/qr-code/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, name: name || url }),
      })

      if (!response.ok) throw new Error("Failed to generate QR code")

      const data = await response.json()
      toast({
        title: "Success",
        description: "QR code generated successfully",
      })

      // Reset form and refresh list
      setUrl("")
      setName("")
      fetchQrCodes()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const viewQrCode = async (id: string) => {
    try {
      setSelectedQr(id)
      const response = await fetch(`/api/qr-code/${id}`)
      if (!response.ok) throw new Error("Failed to fetch QR code")

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setQrImageUrl(imageUrl)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load QR code image",
        variant: "destructive",
      })
    }
  }

  const downloadQrCode = () => {
    if (qrImageUrl && downloadRef.current) {
      downloadRef.current.href = qrImageUrl
      downloadRef.current.download = `qrcode-${selectedQr}.png`
      downloadRef.current.click()
    }
  }

  const deleteQrCode = async (id: string) => {
    try {
      const response = await fetch(`/api/qr-code/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete QR code")

      toast({
        title: "Success",
        description: "QR code deleted successfully",
      })

      // Clear selected QR if it was deleted
      if (selectedQr === id) {
        setSelectedQr(null)
        setQrImageUrl(null)
      }

      // Refresh list
      fetchQrCodes()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete QR code",
        variant: "destructive",
      })
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col mt-20"
      style={{
        backgroundImage: "url('/websitebackground.png')",
        backgroundSize: "100vw",
        backgroundAttachment: "scroll",
      }}
    >
      <header className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-sm height-[80px]">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/primary-logo.svg" alt="Stripy Logo" width={140} height={28} className="rounded-sm" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="text-sm font-medium hover:underline">
              {t("home")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">QR Code Generator</h1>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
            <TabsTrigger value="manage">Manage QR Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Create New QR Code</CardTitle>
                  <CardDescription>Generate a QR code for your product or marketing campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name (optional)
                    </label>
                    <Input
                      id="name"
                      placeholder="e.g., Product Flyer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium">
                      URL (required)
                    </label>
                    <Input
                      id="url"
                      placeholder="https://mystripy.com/product/1"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Enter the full URL including https://</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={generateQrCode}
                    disabled={loading}
                    className="w-full bg-[#cbff01] text-black hover:bg-[#cbff01]/90"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate QR Code
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                  <CardDescription>View and download your QR code</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                  {qrImageUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="border border-border p-4 rounded-lg bg-white">
                        <Image
                          src={qrImageUrl || "/placeholder.svg"}
                          alt="QR Code"
                          width={200}
                          height={200}
                          className="w-[200px] h-[200px]"
                        />
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Scan this QR code to visit the linked URL
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <QrCode className="h-16 w-16 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        Generate a QR code or select one from your list to preview it here
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled={!qrImageUrl} onClick={downloadQrCode}>
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                  <a ref={downloadRef} className="hidden" />
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Your QR Codes</CardTitle>
                <CardDescription>Manage your QR codes and track their usage</CardDescription>
              </CardHeader>
              <CardContent>
                {qrCodes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Scans</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qrCodes.map((qrCode) => (
                        <TableRow key={qrCode.id}>
                          <TableCell className="font-medium">{qrCode.name}</TableCell>
                          <TableCell className="truncate max-w-[200px]">{qrCode.url}</TableCell>
                          <TableCell>{qrCode.scans}</TableCell>
                          <TableCell>{new Date(qrCode.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => viewQrCode(qrCode.id)}>
                                <QrCode className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => deleteQrCode(qrCode.id)}>
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <QrCode className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No QR codes yet</h3>
                    <p className="text-muted-foreground mb-4">Generate your first QR code to get started</p>
                    <Button
                      variant="outline"
                      onClick={() => (document.querySelector('[data-value="generate"]') as HTMLElement)?.click()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={fetchQrCodes}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

