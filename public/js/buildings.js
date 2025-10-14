import { getdata, putdata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"
import { landlordsCache } from "./landlords.js"

let buildingsCache = []

document.addEventListener("DOMContentLoaded", async function() {
  const addButton = document.getElementById("addbuilding")
  if(addButton) {
    addButton.addEventListener("click", addbuildinginput)
    await gobuildings()
  }
})

async function fetchbuildings() {
  return await getdata("buildings")
}

async function addbuilding(name, address, landlordId, notes) {
  await putdata("buildings", { name, address, landlord_id: landlordId, notes })
}

async function updatebuilding(id, name, address, landlordId, notes) {
  await putdata("buildings", { id, name, address, landlord_id: landlordId, notes })
}

async function gobuildings() {
  const buildings = await fetchbuildings()
  buildingsCache = buildings
  cleartablerows("buildingstable")

  for(const building of buildings) {
    addbuildingdom(building)
  }
}

function addbuildinginput() {
  clearform("buildingform")
  populateLandlordDropdown()

  showform("buildingform", async () => {
    await addbuilding(
      getformfieldvalue("buildingform-name"),
      getformfieldvalue("buildingform-address"),
      getformfieldvalue("buildingform-landlord"),
      getformfieldvalue("buildingform-notes")
    )
    await gobuildings()
  })
}

function editbuilding(ev) {
  clearform("buildingform")

  const buildingrow = findancestorbytype(ev.target, "tr")
  const buildingId = parseInt(buildingrow.dataset.buildingId, 10)
  const building = buildingsCache.find(b => b.id === buildingId)

  if(!building) {
    alert("Error: Could not load building data")
    return
  }

  populateLandlordDropdown()

  setformfieldvalue("buildingform-name", building.name)
  setformfieldvalue("buildingform-address", building.address || "")
  setformfieldvalue("buildingform-landlord", building.landlord_id || "")
  setformfieldvalue("buildingform-notes", building.notes || "")

  showform("buildingform", async () => {
    await updatebuilding(
      building.id,
      getformfieldvalue("buildingform-name"),
      getformfieldvalue("buildingform-address"),
      getformfieldvalue("buildingform-landlord"),
      getformfieldvalue("buildingform-notes")
    )
    await gobuildings()
  })
}

function populateLandlordDropdown() {
  const select = document.getElementById("buildingform-landlord")
  if(!select) return

  // Clear existing options
  select.innerHTML = '<option value="">-- Select Landlord --</option>'

  // Add landlord options
  landlordsCache.forEach(landlord => {
    const option = document.createElement("option")
    option.value = landlord.id
    option.textContent = landlord.name
    select.appendChild(option)
  })
}

function addbuildingdom(building) {
  const table = gettablebody("buildingstable")
  const newrow = table.insertRow()
  newrow.dataset.buildingId = building.id.toString()

  const nameCell = newrow.insertCell(0)
  const addressCell = newrow.insertCell(1)
  const landlordCell = newrow.insertCell(2)
  const actionCell = newrow.insertCell(3)

  nameCell.innerText = building.name
  addressCell.innerText = building.address || "-"
  landlordCell.innerText = building.landlord_name || "-"

  const editbutton = document.createElement("button")
  editbutton.textContent = "Edit"
  editbutton.addEventListener("click", editbuilding)
  actionCell.appendChild(editbutton)

  const viewroomsbutton = document.createElement("button")
  viewroomsbutton.textContent = "Rooms"
  viewroomsbutton.style.marginLeft = "5px"
  viewroomsbutton.addEventListener("click", () => {
    // Navigate to rooms view filtered by this building
    window.location.hash = `#rooms?building=${building.id}`
  })
  actionCell.appendChild(viewroomsbutton)
}

export { gobuildings, buildingsCache }