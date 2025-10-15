/**
 * HTTP Response Helper
 * Provides consistent response formatting for API endpoints
 */

/**
 * Send JSON response
 * @param { object } res - HTTP response object
 * @param { number } statusCode - HTTP status code
 * @param { any } data - Data to send
 */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" })
  res.end(JSON.stringify(data))
}

/**
 * Send success response
 * @param { object } res - HTTP response object
 * @param { any } data - Data to send
 */
function sendSuccess(res, data) {
  sendJSON(res, 200, data)
}

/**
 * Send error response
 * @param { object } res - HTTP response object
 * @param { number } statusCode - HTTP status code
 * @param { string } message - Error message
 */
function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, { error: message })
}

/**
 * Send 404 Not Found response
 * @param { object } res - HTTP response object
 */
function send404(res) {
  sendError(res, 404, "Not found")
}

/**
 * Send 500 Internal Server Error response
 * @param { object } res - HTTP response object
 * @param { string } message - Error message
 */
function send500(res, message = "Internal server error") {
  sendError(res, 500, message)
}

export {
  sendJSON,
  sendSuccess,
  sendError,
  send404,
  send500
}
