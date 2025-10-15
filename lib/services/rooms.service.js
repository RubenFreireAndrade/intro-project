import { queryAll, runQuery } from "../database/connection.js"

/**
 * @typedef { Object } room
 * @property { number } id
 * @property { string } number - The room number.
 * @property { number } building_id - The ID of the building this room belongs to.
 * @property { number } floor - The floor number.
 * @property { number } capacity - The capacity of the room.
 * @property { string } [ notes ] - Additional notes about the room (optional).
 */

/**
 * Function to return an array of rooms objects with building names from database
 * @param { URL } parsedUrl
 * @returns { Promise< Array< room > > }
 */
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
async function get(parsedUrl) {
  try {
    const rooms = await queryAll(`
      SELECT r.*, b.name as building_name
      FROM rooms r
      LEFT JOIN buildings b ON r.building_id = b.id
    `)
    return rooms
  } catch (err) {
    console.error("Error fetching rooms:", err.message)
    return []
  }
}

/**
 * Function for adding or updating a room
 * @param { string } parsedUrl
 * @param { string } method
 * @param { room } room
 * @return { Promise < object > }
 */
/*eslint complexity: ["error", 20]*/
async function add(parsedUrl, method, room) {
  try {
    // Convert numeric fields to numbers if they're strings
    if(room.building_id) {
      room.building_id = parseInt(room.building_id, 10)
    }
    if(room.floor) {
      room.floor = parseInt(room.floor, 10)
    }
    if(room.capacity) {
      room.capacity = parseInt(room.capacity, 10)
    }

    // Update existing room
    if(undefined !== room.id) {
      await runQuery(
        "UPDATE rooms SET number = ?, building_id = ?, floor = ?, capacity = ?, notes = ? WHERE id = ?",
        [ room.number, room.building_id || null, room.floor || null, room.capacity || null, room.notes || "", room.id ]
      )

      // Fetch updated room with building name
      const result = await queryAll(`
        SELECT r.*, b.name as building_name
        FROM rooms r
        LEFT JOIN buildings b ON r.building_id = b.id
        WHERE r.id = ?
      `, [ room.id ])

      return result[ 0 ] || room
    }

    // Insert new room
    const result = await runQuery(
      "INSERT INTO rooms (number, building_id, floor, capacity, notes) VALUES (?, ?, ?, ?, ?)",
      [ room.number, room.building_id || null, room.floor || null, room.capacity || null, room.notes || "" ]
    )

    /*eslint require-atomic-updates: "off"*/
    room.id = result.lastID

    // Fetch newly created room with building name
    const newRoom = await queryAll(`
      SELECT r.*, b.name as building_name
      FROM rooms r
      LEFT JOIN buildings b ON r.building_id = b.id
      WHERE r.id = ?
    `, [ room.id ])

    return newRoom[ 0 ] || room
  } catch (err) {
    console.error("Error adding/updating room:", err.message)
    throw err
  }
}


export {
  get,
  add
}
