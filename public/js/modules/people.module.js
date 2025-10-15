

import { getData, putData } from "../services/api.service.js"
import { showForm, getFormFieldValue, setFormFieldValue, clearForm, getTableBody, clearTableRows } from "../helpers/form.helper.js"
import { findAncestorByType } from "../helpers/dom.helper.js"
import { buildingsCache } from "./buildings.module.js"
import { roomsCache } from "./rooms.module.js"

let peopleCache = []

document.addEventListener("DOMContentLoaded", async function() {
  document.getElementById("addperson").addEventListener("click", addPersonInput)
  await goPeople()
})


/**
 *
 * @returns { Promise< object > }
 */
async function fetchPeople() {
  return await getData("people")
}

/**
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @param { string } schedule
 * @returns { Promise< object > }
 */
async function addPerson(name, email, notes, schedule) {
  await putData("people", { name, email, notes, schedule })
}

/**
 *
 * @param { string } id
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @param { string } schedule
 */
async function updatePerson(id, name, email, notes, schedule) {
  await putData("people", { id, name, email, notes, schedule })
}



/**
 * @returns { Promise }
 */
async function goPeople() {
  const p = await fetchPeople()
  peopleCache = p

  clearTableRows("peopletable")

  for(const pi in p) {
    addPersonDom(p[ pi ])
  }
}

/**
 * Populate all building dropdowns in schedule
 */
function populateScheduleBuildingDropdowns() {
  for(let i = 1; 7 >= i; i++) {
    const select = document.getElementById(`personform-day${i}-building`)
    if(!select) continue

    select.innerHTML = '<option value="">-- Building --</option>'
    buildingsCache.forEach(building => {
      const option = document.createElement("option")
      option.value = building.id
      option.textContent = building.name
      select.appendChild(option)
    })

    // Add change event listener to populate rooms when building is selected
    select.addEventListener("change", (e) => populateRoomsForDay(i, e.target.value))
  }
}

/**
 * Populate rooms dropdown for a specific day based on building selection
 * @param { number } day - Day number (1-7)
 * @param { string } buildingId - Building ID
 */
function populateRoomsForDay(day, buildingId) {
  const roomSelect = document.getElementById(`personform-day${day}-room`)
  if(!roomSelect) return

  roomSelect.innerHTML = '<option value="">-- Room --</option>'

  if(!buildingId) return

  const filteredRooms = roomsCache.filter(room => room.building_id === parseInt(buildingId, 10))
  filteredRooms.forEach(room => {
    const option = document.createElement("option")
    option.value = room.id
    option.textContent = `${room.number}${room.floor ? ` (Floor ${room.floor})` : ""}`
    roomSelect.appendChild(option)
  })
}

/**
 * Get schedule array from form (returns room IDs)
 * @returns { Array< string > }
 */
function getScheduleFromForm() {
  return [
    getFormFieldValue("personform-day1-room"),
    getFormFieldValue("personform-day2-room"),
    getFormFieldValue("personform-day3-room"),
    getFormFieldValue("personform-day4-room"),
    getFormFieldValue("personform-day5-room"),
    getFormFieldValue("personform-day6-room"),
    getFormFieldValue("personform-day7-room")
  ]
}

/**
 * Set schedule array to form (room IDs)
 * @param { Array< string > } schedule
 */
function setScheduleToForm(schedule) {
  for(let i = 0; 7 > i; i++) {
    const roomId = schedule[ i ]
    if(!roomId) {
      setFormFieldValue(`personform-day${i + 1}-building`, "")
      setFormFieldValue(`personform-day${i + 1}-room`, "")
      continue
    }

    // Find the room and its building
    const room = roomsCache.find(r => r.id === parseInt(roomId, 10))
    if(room) {
      // Set building first
      setFormFieldValue(`personform-day${i + 1}-building`, room.building_id || "")
      // Populate rooms for this building
      populateRoomsForDay(i + 1, room.building_id)
      // Then set the room
      setFormFieldValue(`personform-day${i + 1}-room`, roomId)
    }
  }
}

/**
 *
 */
function addPersonInput() {
  clearForm("personform")
  populateScheduleBuildingDropdowns()
  showForm("personform", async () => {
    const schedule = getScheduleFromForm()
    await addPerson(
      getFormFieldValue("personform-name"),
      getFormFieldValue("personform-email"),
      getFormFieldValue("personform-notes"),
      JSON.stringify(schedule)
    )
    await goPeople()
  })
}

/**
 * @param {Event} ev
 */
function editPerson(ev) {
  clearForm("personform")
  const personRow = findAncestorByType(ev.target, "tr")
  const personId = parseInt(personRow.dataset.personId, 10)
  const person = peopleCache.find(p => p.id === personId)

  if(!person) {
    console.error("No person data found for ID:", personId)
    alert("Error: Could not load person data")
    return
  }

  setFormFieldValue("personform-name", person.name)
  setFormFieldValue("personform-email", person.email || "")
  setFormFieldValue("personform-notes", person.notes || "")

  // Populate building dropdowns first
  populateScheduleBuildingDropdowns()

  // Load schedule into form
  let schedule = [ "", "", "", "", "", "", "" ]
  if(person.schedule) {
    try {
      schedule = JSON.parse(person.schedule)
    } catch (e) {
      console.error("Error parsing schedule:", e)
    }
  }
  setScheduleToForm(schedule)

  showForm("personform", async () => {
    const updatedSchedule = getScheduleFromForm()
    await updatePerson(
      person.id,
      getFormFieldValue("personform-name"),
      getFormFieldValue("personform-email"),
      getFormFieldValue("personform-notes"),
      JSON.stringify(updatedSchedule)
    )

    await goPeople()
    console.log("submitted peopleform")
  })
}

/**
 *
 * @param { object } person
 */
export function addPersonDom(person) {
  const table = getTableBody("peopletable")
  const newRow = table.insertRow()

  newRow.dataset.personId = person.id.toString()

  const cells = []
  for(let i = 0; i < (2 + 7); i++) {
    cells.push(newRow.insertCell(i))
  }

  cells[ 0 ].innerText = person.name
  cells[ 0 ].title = `Email: ${person.email || "none"}\nNotes: ${person.notes || "none"}`

  // Parse and display schedule
  let schedule = [ "", "", "", "", "", "", "" ]
  if(person.schedule) {
    try {
      schedule = JSON.parse(person.schedule)
    } catch (e) {
      console.error("Error parsing schedule:", e)
    }
  }

  // Fill in the 7 schedule cells
  for(let i = 0; 7 > i; i++) {
    const roomId = schedule[ i ]
    let displayText = "-"

    if(roomId) {
      // Find the room to display its number
      const room = roomsCache.find(r => r.id === parseInt(roomId, 10))
      if(room) {
        displayText = room.number
      }
    }

    cells[ i + 1 ].innerText = displayText
    cells[ i + 1 ].style.textAlign = "center"
  }

  const editButton = document.createElement("button")
  editButton.textContent = "Edit"
  editButton.addEventListener("click", editPerson)
  cells[ 8 ].appendChild(editButton)

  const deleteButton = document.createElement("button")
  deleteButton.textContent = "Delete"
  deleteButton.style.marginLeft = "5px"
  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  deleteButton.addEventListener("click", async (ev) => {
    if(confirm(`Delete ${person.name}?`)) {
      // TODO: implement delete in the backend
      await goPeople()
    }
  })
  cells[ 8 ].appendChild(deleteButton)
}
