
import {add as addperson, get as getpeople} from "./people.js"
import {add as addlandlord, get as getlandlords} from "./landlords.js"
import {add as addbuilding, get as getbuildings} from "./buildings.js"
import {add as addroom, get as getrooms} from "./rooms.js"

/**
 * Check for a valid API url call and handle.
 * @param { URL } parsedurl
 * @param { object } res
 * @param { object } req
 * @param { object } receivedobj
 */
async function handleapi(parsedurl, res, req, receivedobj) {
  const pathname = parsedurl.pathname

  const calls = {
    "/api/people": { "GET": getpeople, "PUT": addperson },
    "/api/landlords": { "GET": getlandlords, "PUT": addlandlord },
    "/api/buildings": { "GET": getbuildings, "PUT": addbuilding },
    "/api/rooms": { "GET": getrooms, "PUT": addroom }
  }

  if(!(pathname in calls) || !(req.method in calls[ pathname ])) {
    console.error("404 file not found: ", pathname)
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("404 - Not found")
    return
  }

  const data = await calls[ pathname ][ req.method ](parsedurl, req.method, receivedobj)

  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(JSON.stringify(data))
}


export {
  handleapi
}