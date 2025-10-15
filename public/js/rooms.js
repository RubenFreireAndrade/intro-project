import { getdata, putdata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"
import { buildingsCache } from "./buildings.js"

let roomsCache = []

document.addEventListener("DOMContentLoaded", async function() {
  const addButton = document.getElementById("addroom")
  if(addButton) {
    addButton.addEventListener("click", addroominput)
    await gorooms()
  }
})

async function fetchrooms() {
  return await getdata("rooms")
}

async function addroom(number, buildingId, floor, capacity, notes) {
  await putdata("rooms", { number, building_id: buildingId, floor, capacity, notes })
}

async function updateroom(id, number, buildingId, floor, capacity, notes) {
  await putdata("rooms", { id, number, building_id: buildingId, floor, capacity, notes })
}

async function gorooms() {
  const rooms = await fetchrooms()
  roomsCache = rooms
  cleartablerows("roomstable")

  for(const room of rooms) {
    addroomdom(room)
  }
}

function addroominput() {
  clearform("roomform")
  populateBuildingDropdown()

  showform("roomform", async () => {
    await addroom(
      getformfieldvalue("roomform-number"),
      getformfieldvalue("roomform-building"),
      getformfieldvalue("roomform-floor"),
      getformfieldvalue("roomform-capacity"),
      getformfieldvalue("roomform-notes")
    )
    await gorooms()
  })
}

function editroom(ev) {
  clearform("roomform")

  const roomrow = findancestorbytype(ev.target, "tr")
  const roomId = parseInt(roomrow.dataset.roomId, 10)
  const room = roomsCache.find(r => r.id === roomId)

  if(!room) {
    alert("Error: Could not load room data")
    return
  }

  populateBuildingDropdown()

  setformfieldvalue("roomform-number", room.number)
  setformfieldvalue("roomform-building", room.building_id || "")
  setformfieldvalue("roomform-floor", room.floor || "")
  setformfieldvalue("roomform-capacity", room.capacity || "")
  setformfieldvalue("roomform-notes", room.notes || "")

  showform("roomform", async () => {
    await updateroom(
      room.id,
      getformfieldvalue("roomform-number"),
      getformfieldvalue("roomform-building"),
      getformfieldvalue("roomform-floor"),
      getformfieldvalue("roomform-capacity"),
      getformfieldvalue("roomform-notes")
    )
    await gorooms()
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

function addroomdom(room) {
  const table = gettablebody("roomstable")
  const newrow = table.insertRow()
  newrow.dataset.roomId = room.id.toString()

  const numberCell = newrow.insertCell(0)
  const buildingCell = newrow.insertCell(1)
  const floorCell = newrow.insertCell(2)
  const capacityCell = newrow.insertCell(3)
  const actionCell = newrow.insertCell(4)

  numberCell.innerText = room.number
  buildingCell.innerText = room.building_name || "-"
  floorCell.innerText = room.floor || "-"
  capacityCell.innerText = room.capacity || "-"

  const editbutton = document.createElement("button")
  editbutton.textContent = "Edit"
  editbutton.addEventListener("click", editroom)
  actionCell.appendChild(editbutton)
}

export { gorooms, roomsCache }
