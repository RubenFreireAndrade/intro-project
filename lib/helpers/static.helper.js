/**
 * Static File Server Helper
 * Handles serving static files with appropriate content types
 */

import { readFile } from "fs"
import { extname } from "path"

/**
 * Get content type based on file extension
 * @param { string } filepath - File path
 * @returns { string } Content type
 */
function getContentType(filepath) {
  const ext = extname(filepath)
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  }
  return types[ ext ] || "text/plain"
}

/**
 * Serve a static file
 * @param { object } res - HTTP response object
 * @param { string } filepath - File path to serve
 */
function serveStaticFile(res, filepath) {
  const contentType = getContentType(filepath)

  readFile(filepath, (err, content) => {
    if(err) {
      console.error("404 file not found:", filepath)
      res.writeHead(404, { "Content-Type": "text/plain" })
      res.end("404 - Not found")
    } else {
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content, "utf-8")
    }
  })
}

export {
  getContentType,
  serveStaticFile
}
