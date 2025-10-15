/**
 * HTTP Request Helper
 * Provides utilities for parsing and handling HTTP requests
 */

/**
 * Parse request body and return JSON object
 * @param { object } req - HTTP request object
 * @returns { Promise< object > } Parsed JSON object
 */
function parseRequestBody(req) {
  return new Promise((resolve) => {
    let data = ""

    req.on("data", (chunk) => {
      data += chunk
    })

    req.on("end", () => {
      try {
        const parsed = JSON.parse(data)
        resolve(parsed)
      } catch (e) {
        resolve(null)
      }
    })
  })
}

/**
 * Get base URL from request
 * @param { object } req - HTTP request object
 * @returns { string } Base URL
 */
function getBaseURL(req) {
  const headers = req.headers
  // @ts-ignore (tls socket encrypted does exist)
  const protocol = headers[ "x-forwarded-proto" ] || (req.socket.encrypted ? "https" : "http")
  const host = headers[ "x-forwarded-host" ] || headers.host
  return `${protocol}://${host}`
}

export {
  parseRequestBody,
  getBaseURL
}
