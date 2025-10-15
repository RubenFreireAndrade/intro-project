

let formSubmitCallback
document.addEventListener("DOMContentLoaded", async function() {
  const closeElements = document.querySelectorAll(".close")
  closeElements.forEach(element => {
    element.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllForms()
    })
  })

  const formElements = document.querySelectorAll("form")
  formElements.forEach(element => {
    element.addEventListener("submit", (e) => {
      e.preventDefault()

      document.getElementById("content").style.display = "block"
      // @ts-ignore (it is part of HTML Element)
      element.parentNode.style.display = "none"

      if(formSubmitCallback) formSubmitCallback()
    })
  })
})

/**
 * Hide all divs with class container and show main content
 */
function closeAllForms() {
  document.querySelectorAll("div.container").forEach((element) => {
    // @ts-ignore
    element.style.display = "none"
  })
  document.getElementById("content").style.display = "block"
}

/**
 * Show form by id name
 * @param { string } formId
 */
export function showForm(formId, onSubmit) {
  document.getElementById("content").style.display = "none"

  const form = document.getElementById(formId)
  form.style.display = "block"

  formSubmitCallback = onSubmit
}

/**
 *
 * @param { string } formItemId
 */
export function getFormFieldValue(formItemId) {
  // @ts-ignore (it does!)
  return document.getElementById(formItemId).value
}

/**
 *
 * @param { string } formItemId
 * @param { string } value
 */
export function setFormFieldValue(formItemId, value) {
  // @ts-ignore (it does!)
  document.getElementById(formItemId).value = value
}


/**
 *
 * @param { string } formId
 */
export function clearForm(formId) {
  const form = document.getElementById(formId)

  form.querySelectorAll("input").forEach((input) => input.value = "")
  form.querySelectorAll("textarea").forEach((input) => input.value = "")
}

/**
 *
 * @param { string } formId
 * @returns { HTMLTableSectionElement }
 */
export function getTableBody(formId) {
  return document.getElementById(formId).getElementsByTagName("tbody")[ 0 ]
}

/**
 *
 * @param { string } formId
 */
export function clearTableRows(formId) {
  const tbody = getTableBody(formId)

  // Clear only tbody rows, not header rows
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
  }
}