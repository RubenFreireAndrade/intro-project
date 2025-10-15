import { queryAll, runQuery } from "../database/connection.js"

/**
 * @typedef { Object } building
 * @property { number } id
 * @property { string } name - The name of the building.
 * @property { string } address - The address of the building.
 * @property { number } landlord_id - The ID of the landlord who owns this building.
 * @property { string } [ notes ] - Additional notes about the building (optional).
 */

/**
 * Function to return an array of buildings objects with landlord names from database
 * @param { URL } parsedUrl
 * @returns { Promise< Array< building > > }
 */
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
async function get(parsedUrl) {
  try {
    const buildings = await queryAll(`
      SELECT b.*, l.name as landlord_name
      FROM buildings b
      LEFT JOIN landlords l ON b.landlord_id = l.id
    `)
    return buildings
  } catch (err) {
    console.error("Error fetching buildings:", err.message)
    return []
  }
}

/**
 * Function for adding or updating a building
 * @param { string } parsedUrl
 * @param { string } method
 * @param { building } building
 * @return { Promise < object > }
 */
/*eslint complexity: ["error", 15]*/
async function add(parsedUrl, method, building) {
  try {
    // Convert landlord_id to number if it's a string
    if(building.landlord_id) {
      building.landlord_id = parseInt(building.landlord_id, 10)
    }

    // Update existing building
    if(undefined !== building.id) {
      await runQuery(
        "UPDATE buildings SET name = ?, address = ?, landlord_id = ?, notes = ? WHERE id = ?",
        [ building.name, building.address || "", building.landlord_id || null, building.notes || "", building.id ]
      )

      // Fetch updated building with landlord name
      const result = await queryAll(`
        SELECT b.*, l.name as landlord_name
        FROM buildings b
        LEFT JOIN landlords l ON b.landlord_id = l.id
        WHERE b.id = ?
      `, [ building.id ])

      return result[ 0 ] || building
    }

    // Insert new building
    const result = await runQuery(
      "INSERT INTO buildings (name, address, landlord_id, notes) VALUES (?, ?, ?, ?)",
      [ building.name, building.address || "", building.landlord_id || null, building.notes || "" ]
    )

    /*eslint require-atomic-updates: "off"*/
    building.id = result.lastID

    // Fetch newly created building with landlord name
    const newBuilding = await queryAll(`
      SELECT b.*, l.name as landlord_name
      FROM buildings b
      LEFT JOIN landlords l ON b.landlord_id = l.id
      WHERE b.id = ?
    `, [ building.id ])

    return newBuilding[ 0 ] || building
  } catch (err) {
    console.error("Error adding/updating building:", err.message)
    throw err
  }
}


export {
  get,
  add
}
