



/**
 *
 * @param { object } element
 * @param { string } className
 * @returns
 */
export function findAncestorByClass(element, className) {
  let currentElement = element

  while(currentElement && !currentElement.classList.contains(className)) {
    currentElement = currentElement.parentNode
  }

  return currentElement
}

/**
 *
 * @param { object } element
 * @param { string } type
 * @returns { object }
 */
export function findAncestorByType(element, type) {
  let currentElement = element
  const lowerType = type.toLowerCase()
  while(currentElement && currentElement.tagName && currentElement.tagName.toLowerCase() !== lowerType) {
    currentElement = currentElement.parentNode
  }

  return currentElement
}