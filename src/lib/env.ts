import { z } from "zod"

const envSchema = z.object({
  AUTH_API_URL: z.string().url(),
  BE_API_URL: z.string().url(),
  APP_NAME: z.string().min(1),
  PRODUCT: z.string().min(1),
})

function getEnv() {
  const parsed = envSchema.safeParse({
    AUTH_API_URL: process.env.AUTH_API_URL,
    BE_API_URL: process.env.BE_API_URL,
    APP_NAME: process.env.APP_NAME,
    PRODUCT: process.env.PRODUCT,
  })

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid environment variables")
  }

  return parsed.data
}

export const env = getEnv()
