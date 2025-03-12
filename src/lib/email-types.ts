export interface EmailResponseData {
    id: string
    from: string
    to: string | string[]
    created_at: string
    status: "success" | "pending"
  }
  
  export interface EmailResponseError {
    statusCode: number
    name: string
    message: string
  }
  
  export interface EmailResult {
    success: boolean
    data?: EmailResponseData | null
    error?: EmailResponseError | unknown
  }
  