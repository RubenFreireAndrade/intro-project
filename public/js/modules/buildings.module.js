import { getData, putData } from "../services/api.service.js"
import { showForm, getFormFieldValue, setFormFieldValue, clearForm, getTableBody, clearTableRows } from "../helpers/form.helper.js"
import { findAncestorByType } from "../helpers/dom.helper.js"
import { landlordsCache } from "./landlords.module.js"

let buildingsCache = []

document.addEventListener("DOMContentLoaded", async function() {
  const addButton = document.getElementById("addbuilding")
  if(addButton) {
    addButton.addEventListener("click", addBuildingInput)
    await goBuildings()
  }
})

async function fetchBuildings() {
  return await getData("buildings")
}

async function addBuilding(name, address, landlordId, notes) {
  await putData("buildings", { name, address, landlord_id: landlordId, notes })
}

async function updateBuilding(id, name, address, landlordId, notes) {
  await putData("buildings", { id, name, address, landlord_id: landlordId, notes })
}

async function goBuildings() {
  const buildings = await fetchBuildings()
  buildingsCache = buildings
  clearTableRows("buildingstable")

  for(const building of buildings) {
    addBuildingDom(building)
  }
}

function addBuildingInput() {
  clearForm("buildingform")
  populateLandlordDropdown()

  showForm("buildingform", async () => {
    await addBuilding(
      getFormFieldValue("buildingform-name"),
      getFormFieldValue("buildingform-address"),
      getFormFieldValue("buildingform-landlord"),
      getFormFieldValue("buildingform-notes")
    )
    await goBuildings()
  })
}

function editBuilding(ev) {
  clearForm("buildingform")

  const buildingRow = findAncestorByType(ev.target, "tr")
  const buildingId = parseInt(buildingRow.dataset.buildingId, 10)
  const building = buildingsCache.find(b => b.id === buildingId)

  if(!building) {
    alert("Error: Could not load building data")
    return
  }

  populateLandlordDropdown()

  setFormFieldValue("buildingform-name", building.name)
  setFormFieldValue("buildingform-address", building.address || "")
  setFormFieldValue("buildingform-landlord", building.landlord_id || "")
  setFormFieldValue("buildingform-notes", building.notes || "")

  showForm("buildingform", async () => {
    await updateBuilding(
      building.id,
      getFormFieldValue("buildingform-name"),
      getFormFieldValue("buildingform-address"),
      getFormFieldValue("buildingform-landlord"),
      getFormFieldValue("buildingform-notes")
    )
    await goBuildings()
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

function addBuildingDom(building) {
  const table = getTableBody("buildingstable")
  const newRow = table.insertRow()
  newRow.dataset.buildingId = building.id.toString()

  const nameCell = newRow.insertCell(0)
  const addressCell = newRow.insertCell(1)
  const landlordCell = newRow.insertCell(2)
  const actionCell = newRow.insertCell(3)

  nameCell.innerText = building.name
  addressCell.innerText = building.address || "-"
  landlordCell.innerText = building.landlord_name || "-"

  const editButton = document.createElement("button")
  editButton.textContent = "Edit"
  editButton.addEventListener("click", editBuilding)
  actionCell.appendChild(editButton)

  const viewRoomsButton = document.createElement("button")
  viewRoomsButton.textContent = "Rooms"
  viewRoomsButton.style.marginLeft = "5px"
  viewRoomsButton.addEventListener("click", () => {
    // Navigate to rooms view filtered by this building
    window.location.hash = `#rooms?building=${building.id}`
  })
  actionCell.appendChild(viewRoomsButton)
}

export { goBuildings, buildingsCache }