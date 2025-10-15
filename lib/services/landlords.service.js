import { queryAll, runQuery } from "../database/connection.js"

/**
 * @typedef { Object } landlord
 * @property { number } id
 * @property { string } name - The name of the landlord.
 * @property { string } email - The email address of the landlord.
 * @property { string } phone - The phone number of the landlord.
 * @property { string } [ notes ] - Additional notes about the landlord (optional).
 */

/**
 * Function to return an array of landlords objects from database
 * @param { URL } parsedUrl
 * @returns { Promise< Array< landlord > > }
 */
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
async function get(parsedUrl) {
  try {
    const landlords = await queryAll("SELECT * FROM landlords")
    return landlords
  } catch (err) {
    console.error("Error fetching landlords:", err.message)
    return []
  }
}

/**
 * Function adding or updating a landlord
 * @param { string } parsedUrl
 * @param { string } method
 * @param { landlord } landlord
 * @return { Promise < object > }
 */
async function add(parsedUrl, method, landlord) {
  try {
    // Update existing landlord
    if(undefined !== landlord.id) {
      await runQuery(
        "UPDATE landlords SET name = ?, email = ?, phone = ?, notes = ? WHERE id = ?",
        [ landlord.name, landlord.email || "", landlord.phone || "", landlord.notes || "", landlord.id ]
      )
      return landlord
    }

    // Insert new landlord
    const result = await runQuery(
      "INSERT INTO landlords (name, email, phone, notes) VALUES (?, ?, ?, ?)",
      [ landlord.name, landlord.email || "", landlord.phone || "", landlord.notes || "" ]
    )

    /*eslint require-atomic-updates: "off"*/
    landlord.id = result.lastID
    return landlord
  } catch (err) {
    console.error("Error adding/updating landlord:", err.message)
    throw err
  }
}


export {
  get,
  add
}
