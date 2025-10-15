import { queryAll, runQuery } from "../database/connection.js"

/**
 * @typedef { Object } person
 * @property { number } id
 * @property { string } name - The name of the person.
 * @property { string } email - The email address of the person.
 * @property { string } [ notes ] - Additional notes about the person (optional).
 * @property { string } [ schedule ] - Weekly schedule as JSON string (optional).
 */

/**
 * Function to return an array of people objects from database
 * @param { URL } parsedUrl
 * @returns { Promise< Array< person > > }
 */
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
async function get(parsedUrl) {
  try {
    const people = await queryAll("SELECT * FROM people")
    return people
  } catch (err) {
    console.error("Error fetching people:", err.message)
    return []
  }
}

/**
 * Function adding or updating a person
 * @param { string } parsedUrl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add(parsedUrl, method, person) {
  try {
    // Update existing person
    if(undefined !== person.id) {
      await runQuery(
        "UPDATE people SET name = ?, email = ?, notes = ?, schedule = ? WHERE id = ?",
        [ person.name, person.email || "", person.notes || "", person.schedule || "", person.id ]
      )
      return person
    }

    // Insert new person
    const result = await runQuery(
      "INSERT INTO people (name, email, notes, schedule) VALUES (?, ?, ?, ?)",
      [ person.name, person.email || "", person.notes || "", person.schedule || "" ]
    )

    /*eslint require-atomic-updates: "off"*/
    person.id = result.lastID
    return person
  } catch (err) {
    console.error("Error adding/updating person:", err.message)
    throw err
  }
}


export {
  get,
  add
}
