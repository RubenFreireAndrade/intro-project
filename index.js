// Import required modules
import dotenv from "dotenv"
import { createServer } from "http"
import { join } from "path"

import { handleApi } from "./lib/api.js"
import { initializeDatabase } from "./lib/database/connection.js"
import { parseRequestBody, getBaseURL } from "./lib/helpers/request.helper.js"
import { serveStaticFile } from "./lib/helpers/static.helper.js"

dotenv.config()
const publicDirectory = join(import.meta.dirname, "public")

// Initialize database
await initializeDatabase()

/**
 * Create and start our server
 */
const server = createServer(async (req, res) => {
  const baseUrl = getBaseURL(req)
  const parsedUrl = new URL(req.url, baseUrl)
  const pathname = parsedUrl.pathname

  // Parse request body
  const receivedObj = await parseRequestBody(req)

  // Route handling
  if(0 === pathname.indexOf("/api/")) {
    // API routes
    await handleApi(parsedUrl, res, req, receivedObj)
  } else {
    // Static file routes
    const filePath = join(
      publicDirectory,
      "/" === pathname ? "/index.html" : pathname
    )
    serveStaticFile(res, filePath)
  }
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
