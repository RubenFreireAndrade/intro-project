import "./modules/people.module.js"
import "./modules/landlords.module.js"
import "./modules/buildings.module.js"
import "./modules/rooms.module.js"
import "./helpers/form.helper.js"

document.addEventListener("DOMContentLoaded", function() {
  configurePeopleHeaders()
})

const dayNames = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]

function configurePeopleHeaders() {
  const today = new Date()

  // Calculate the difference in days between the current day and Monday (considering Monday as the first day of the week, where Sunday is 0)
  const dayOfWeek = today.getDay()
  const daysUntilMonday = (0 === dayOfWeek) ? 6 : (1 - dayOfWeek)

  // Adjust the date to Monday of this week
  const mondayDate = new Date(today)
  mondayDate.setDate(today.getDate() + daysUntilMonday)

  const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]

  const days = document.getElementsByClassName("days")

  for(let i = 0; days.length > i; i++) {
    // Reset to Monday for each table
    const currentDate = new Date(mondayDate)

    for(let day = 1; 7 >= day; day++) {
      const dayHeader = days[ i ].querySelectorAll(`.day-${day}`)[ 0 ]
      if(dayHeader) {
        dayHeader.textContent = `${dayNames[ currentDate.getDay() ]} ${monthNames[ currentDate.getMonth() ]} ${currentDate.getDate()}`
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
  }
}
