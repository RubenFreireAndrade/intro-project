import { getData, putData } from "../services/api.service.js"
import { showForm, getFormFieldValue, setFormFieldValue, clearForm, getTableBody, clearTableRows } from "../helpers/form.helper.js"
import { findAncestorByType } from "../helpers/dom.helper.js"
import { buildingsCache } from "./buildings.module.js"

let roomsCache = []

document.addEventListener("DOMContentLoaded", async function() {
  const addButton = document.getElementById("addroom")
  if(addButton) {
    addButton.addEventListener("click", addRoomInput)
    await goRooms()
  }
})

async function fetchRooms() {
  return await getData("rooms")
}

async function addRoom(number, buildingId, floor, capacity, notes) {
  await putData("rooms", { number, building_id: buildingId, floor, capacity, notes })
}

async function updateRoom(id, number, buildingId, floor, capacity, notes) {
  await putData("rooms", { id, number, building_id: buildingId, floor, capacity, notes })
}

async function goRooms() {
  const rooms = await fetchRooms()
  roomsCache = rooms
  clearTableRows("roomstable")

  for(const room of rooms) {
    addRoomDom(room)
  }
}

function addRoomInput() {
  clearForm("roomform")
  populateBuildingDropdown()

  showForm("roomform", async () => {
    await addRoom(
      getFormFieldValue("roomform-number"),
      getFormFieldValue("roomform-building"),
      getFormFieldValue("roomform-floor"),
      getFormFieldValue("roomform-capacity"),
      getFormFieldValue("roomform-notes")
    )
    await goRooms()
  })
}

function editRoom(ev) {
  clearForm("roomform")

  const roomRow = findAncestorByType(ev.target, "tr")
  const roomId = parseInt(roomRow.dataset.roomId, 10)
  const room = roomsCache.find(r => r.id === roomId)

  if(!room) {
    alert("Error: Could not load room data")
    return
  }

  populateBuildingDropdown()

  setFormFieldValue("roomform-number", room.number)
  setFormFieldValue("roomform-building", room.building_id || "")
  setFormFieldValue("roomform-floor", room.floor || "")
  setFormFieldValue("roomform-capacity", room.capacity || "")
  setFormFieldValue("roomform-notes", room.notes || "")

  showForm("roomform", async () => {
    await updateRoom(
      room.id,
      getFormFieldValue("roomform-number"),
      getFormFieldValue("roomform-building"),
      getFormFieldValue("roomform-floor"),
      getFormFieldValue("roomform-capacity"),
      getFormFieldValue("roomform-notes")
    )
    await goRooms()
  })
}

function populateBuildingDropdown() {
  const select = document.getElementById("roomform-building")
  if(!select) return

  // Clear existing options
  select.innerHTML = '<option value="">-- Select Building --</option>'

  // Add building options
  buildingsCache.forEach(building => {
    const option = document.createElement("option")
    option.value = building.id
    option.textContent = building.name
    select.appendChild(option)
  })
}

function addRoomDom(room) {
  const table = getTableBody("roomstable")
  const newRow = table.insertRow()
  newRow.dataset.roomId = room.id.toString()

  const numberCell = newRow.insertCell(0)
  const buildingCell = newRow.insertCell(1)
  const floorCell = newRow.insertCell(2)
  const capacityCell = newRow.insertCell(3)
  const actionCell = newRow.insertCell(4)

  numberCell.innerText = room.number
  buildingCell.innerText = room.building_name || "-"
  floorCell.innerText = room.floor || "-"
  capacityCell.innerText = room.capacity || "-"

  const editButton = document.createElement("button")
  editButton.textContent = "Edit"
  editButton.addEventListener("click", editRoom)
  actionCell.appendChild(editButton)
}

export { goRooms, roomsCache }
