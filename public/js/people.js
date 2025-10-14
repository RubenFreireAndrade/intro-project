

import { getdata, putdata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"

let peopleCache = []

document.addEventListener("DOMContentLoaded", async function() {
  document.getElementById("addperson").addEventListener("click", addpersoninput)
  await gopeople()
})


/**
 *
 * @returns { Promise< object > }
 */
async function fetchpeople() {
  return await getdata("people")
}

/**
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @returns { Promise< object > }
 */
async function addperson(name, email, notes) {
  await putdata("people", { name, email, notes })
}

/**
 *
 * @param { string } id
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 */
async function updateperson(id, name, email, notes) {
  await putdata("people", { id, name, email, notes })
}



/**
 * @returns { Promise }
 */
async function gopeople() {
  const p = await fetchpeople()
  peopleCache = p

  cleartablerows("peopletable")

  for(const pi in p) {
    addpersondom(p[ pi ])
  }
}

/**
 *
 */
function addpersoninput() {
  clearform("personform")
  showform("personform", async () => {
    await addperson(
      getformfieldvalue("personform-name"),
      getformfieldvalue("personform-email"),
      getformfieldvalue("personform-notes")
    )
    await gopeople()
  })
}

/**
 * @param {Event} ev
 */
function editperson(ev) {
  clearform("personform")
  const personrow = findancestorbytype(ev.target, "tr")
  const personId = parseInt(personrow.dataset.personId, 10)
  const person = peopleCache.find(p => p.id === personId)

  if(!person) {
    console.error("No person data found for ID:", personId)
    alert("Error: Could not load person data")
    return
  }

  setformfieldvalue("personform-name", person.name)
  setformfieldvalue("personform-email", person.email || "")
  setformfieldvalue("personform-notes", person.notes || "")

  showform("personform", async () => {
    await updateperson(
      person.id,
      getformfieldvalue("personform-name"),
      getformfieldvalue("personform-email"),
      getformfieldvalue("personform-notes")
    )

    await gopeople()
    console.log("submitted peopleform")
  })
}

/**
 *
 * @param { object } person
 */
export function addpersondom(person) {
  const table = gettablebody("peopletable")
  const newrow = table.insertRow()

  newrow.dataset.personId = person.id.toString()

  const cells = []
  for(let i = 0; i < (2 + 7); i++) {
    cells.push(newrow.insertCell(i))
  }

  cells[ 0 ].innerText = person.name
  cells[ 0 ].title = `Email: ${person.email || "none"}\nNotes: ${person.notes || "none"}`

  const editbutton = document.createElement("button")
  editbutton.textContent = "Edit"
  editbutton.addEventListener("click", editperson)
  cells[ 8 ].appendChild(editbutton)

  const deletebutton = document.createElement("button")
  deletebutton.textContent = "Delete"
  deletebutton.style.marginLeft = "5px"
  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  deletebutton.addEventListener("click", async (ev) => {
    if(confirm(`Delete ${person.name}?`)) {
      // TODO: implement delete in the backend
      await gopeople()
    }
  })
  cells[ 8 ].appendChild(deletebutton)
}
