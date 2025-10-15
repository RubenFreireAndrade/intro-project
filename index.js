// Import required modules
import dotenv from "dotenv"
import { createServer } from "http"
import { readFile } from "fs"
import { join, extname as _extname } from "path"

import { handleapi } from "./lib/api.js"
import { initializeDatabase } from "./lib/db.js"

dotenv.config()
const publicdirectory = join(import.meta.dirname, "public")

// Initialize database
await initializeDatabase()

/**
 * Function to serve static files (HTML, CSS, JS)
 * @param { object } res
 * @param { string } filepath
 * @param { string } contenttype
 */
function servestaticfile(res, filepath, contenttype) {
  readFile(filepath, (err, content) => {
    if(err) {
      console.error("404 file not found: ", filepath)
      res.writeHead(404, { "Content-Type": "text/plain" })
      res.end("404 - Not found")
    } else {
      res.writeHead(200, { "Content-Type": contenttype })
      res.end(content, "utf-8")
    }
  })
}

/**
 * Create and start our server
 */
const server = createServer(async (req, res) => {
  const headers = req.headers
  // @ts-ignore (tls socket encrypted does exist)
  const protocol = headers[ "x-forwarded-proto" ] || (req.socket.encrypted ? "https" : "http")
  const host = headers[ "x-forwarded-host"] || headers.host
  const baseurl = `${protocol}://${host}`

  const parsedurl = new URL(req.url, baseurl)
  const pathname = parsedurl.pathname

  let data = ""
  req.on("data", (chunk) => {
    data += chunk
  })

  let receivedobj
  req.on("end", async () => {
    try {
      receivedobj = JSON.parse(data)
    } catch (e) { /* silent */ }

    if(0 === pathname.indexOf("/api/")) {
      await handleapi(parsedurl, res, req, receivedobj)
    } else {
      // If the request is for a static file (HTML, CSS, JS)
      const filePath = join(
        publicdirectory,
        "/" === pathname ? "/index.html" : pathname
      )
      const extname = _extname(filePath)
      let contentType = "text/html"

      const types = {
        ".js": "text/javascript",
        ".css": "text/css"
      }
      if(extname in types) contentType = types[ extname ]

      servestaticfile(res, filePath, contentType)
    }
  })
})


const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
