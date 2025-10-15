import { getData, putData } from "../services/api.service.js"
import { showForm, getFormFieldValue, setFormFieldValue, clearForm, getTableBody, clearTableRows } from "../helpers/form.helper.js"
import { findAncestorByType } from "../helpers/dom.helper.js"

let landlordsCache = []

document.addEventListener("DOMContentLoaded", async function() {
  const addButton = document.getElementById("addlandlord")
  if(addButton) {
    addButton.addEventListener("click", addLandlordInput)
    await goLandlords()
  }
})

async function fetchLandlords() {
  return await getData("landlords")
}

async function addLandlord(name, email, phone, notes) {
  await putData("landlords", { name, email, phone, notes })
}

async function updateLandlord(id, name, email, phone, notes) {
  await putData("landlords", { id, name, email, phone, notes })
}

async function goLandlords() {
  const landlords = await fetchLandlords()
  landlordsCache = landlords
  clearTableRows("landlordstable")

  for(const landlord of landlords) {
    addLandlordDom(landlord)
  }
}

function addLandlordInput() {
  clearForm("landlordform")
  showForm("landlordform", async () => {
    await addLandlord(
      getFormFieldValue("landlordform-name"),
      getFormFieldValue("landlordform-email"),
      getFormFieldValue("landlordform-phone"),
      getFormFieldValue("landlordform-notes")
    )
    await goLandlords()
  })
}

function editLandlord(ev) {
  clearForm("landlordform")

  const landlordRow = findAncestorByType(ev.target, "tr")
  const landlordId = parseInt(landlordRow.dataset.landlordId, 10)
  const landlord = landlordsCache.find(l => l.id === landlordId)

  if(!landlord) {
    alert("Error: Could not load landlord data")
    return
  }

  setFormFieldValue("landlordform-name", landlord.name)
  setFormFieldValue("landlordform-email", landlord.email || "")
  setFormFieldValue("landlordform-phone", landlord.phone || "")
  setFormFieldValue("landlordform-notes", landlord.notes || "")

  showForm("landlordform", async () => {
    await updateLandlord(
      landlord.id,
      getFormFieldValue("landlordform-name"),
      getFormFieldValue("landlordform-email"),
      getFormFieldValue("landlordform-phone"),
      getFormFieldValue("landlordform-notes")
    )
    await goLandlords()
  })
}

function addLandlordDom(landlord) {
  const table = getTableBody("landlordstable")
  const newRow = table.insertRow()
  newRow.dataset.landlordId = landlord.id.toString()

  const nameCell = newRow.insertCell(0)
  const emailCell = newRow.insertCell(1)
  const phoneCell = newRow.insertCell(2)
  const actionCell = newRow.insertCell(3)

  nameCell.innerText = landlord.name
  emailCell.innerText = landlord.email || "-"
  phoneCell.innerText = landlord.phone || "-"

  const editButton = document.createElement("button")
  editButton.textContent = "Edit"
  editButton.addEventListener("click", editLandlord)
  actionCell.appendChild(editButton)
}

export { goLandlords, landlordsCache }