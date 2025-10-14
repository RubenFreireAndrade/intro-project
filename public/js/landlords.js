import { getdata, putdata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"

let landlordsCache = []

document.addEventListener("DOMContentLoaded", async function() {
  const addButton = document.getElementById("addlandlord")
  if(addButton) {
    addButton.addEventListener("click", addlandlordinput)
    await golandlords()
  }
})

async function fetchlandlords() {
  return await getdata("landlords")
}

async function addlandlord(name, email, phone, notes) {
  await putdata("landlords", { name, email, phone, notes })
}

async function updatelandlord(id, name, email, phone, notes) {
  await putdata("landlords", { id, name, email, phone, notes })
}

async function golandlords() {
  const landlords = await fetchlandlords()
  landlordsCache = landlords
  cleartablerows("landlordstable")

  for(const landlord of landlords) {
    addlandlorddom(landlord)
  }
}

function addlandlordinput() {
  clearform("landlordform")
  showform("landlordform", async () => {
    await addlandlord(
      getformfieldvalue("landlordform-name"),
      getformfieldvalue("landlordform-email"),
      getformfieldvalue("landlordform-phone"),
      getformfieldvalue("landlordform-notes")
    )
    await golandlords()
  })
}

function editlandlord(ev) {
  clearform("landlordform")

  const landlordrow = findancestorbytype(ev.target, "tr")
  const landlordId = parseInt(landlordrow.dataset.landlordId, 10)
  const landlord = landlordsCache.find(l => l.id === landlordId)

  if(!landlord) {
    alert("Error: Could not load landlord data")
    return
  }

  setformfieldvalue("landlordform-name", landlord.name)
  setformfieldvalue("landlordform-email", landlord.email || "")
  setformfieldvalue("landlordform-phone", landlord.phone || "")
  setformfieldvalue("landlordform-notes", landlord.notes || "")

  showform("landlordform", async () => {
    await updatelandlord(
      landlord.id,
      getformfieldvalue("landlordform-name"),
      getformfieldvalue("landlordform-email"),
      getformfieldvalue("landlordform-phone"),
      getformfieldvalue("landlordform-notes")
    )
    await golandlords()
  })
}

function addlandlorddom(landlord) {
  const table = gettablebody("landlordstable")
  const newrow = table.insertRow()
  newrow.dataset.landlordId = landlord.id.toString()

  const nameCell = newrow.insertCell(0)
  const emailCell = newrow.insertCell(1)
  const phoneCell = newrow.insertCell(2)
  const actionCell = newrow.insertCell(3)

  nameCell.innerText = landlord.name
  emailCell.innerText = landlord.email || "-"
  phoneCell.innerText = landlord.phone || "-"

  const editbutton = document.createElement("button")
  editbutton.textContent = "Edit"
  editbutton.addEventListener("click", editlandlord)
  actionCell.appendChild(editbutton)
}

export { golandlords, landlordsCache }