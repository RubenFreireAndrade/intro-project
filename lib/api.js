import { add as addPerson, get as getPeople } from "./services/people.service.js"
import { add as addLandlord, get as getLandlords } from "./services/landlords.service.js"
import { add as addBuilding, get as getBuildings } from "./services/buildings.service.js"
import { add as addRoom, get as getRooms } from "./services/rooms.service.js"
import { sendSuccess, send404 } from "./helpers/response.helper.js"

/**
 * Check for a valid API url call and handle.
 * @param { URL } parsedUrl
 * @param { object } res
 * @param { object } req
 * @param { object } receivedObj
 */
async function handleApi(parsedUrl, res, req, receivedObj) {
  const pathname = parsedUrl.pathname

  const calls = {
    "/api/people": { "GET": getPeople, "PUT": addPerson },
    "/api/landlords": { "GET": getLandlords, "PUT": addLandlord },
    "/api/buildings": { "GET": getBuildings, "PUT": addBuilding },
    "/api/rooms": { "GET": getRooms, "PUT": addRoom }
  }

  if(!(pathname in calls) || !(req.method in calls[ pathname ])) {
    console.error("404 file not found:", pathname)
    send404(res)
    return
  }

  const data = await calls[ pathname ][ req.method ](parsedUrl, req.method, receivedObj)
  sendSuccess(res, data)
}

export {
  handleApi
}
