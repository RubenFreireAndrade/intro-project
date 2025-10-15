import { initializeDatabase, runQuery } from "./connection.js"

/**
 * Seed data for the database
 * Edit these objects to change the initial data
 */
const seedData = {
  people: [
    {
      name: "Harry Potter",
      email: "harry.potter@hogwarts.edu",
      notes: "The Boy Who Lived - Gryffindor student, scheduled to Gryffindor Tower",
      schedule: JSON.stringify([ "1", "1", "", "1", "1", "", "" ])
    }
  ],
  landlords: [
    {
      name: "Albus Dumbledore",
      email: "albus.dumbledore@hogwarts.edu",
      phone: "555-MAGIC",
      notes: "Headmaster of Hogwarts School of Witchcraft and Wizardry"
    }
  ],
  buildings: [
    {
      name: "Hogwarts Castle",
      address: "Hogwarts School, Scotland",
      landlord_id: 1,
      notes: "Historic castle and school for young witches and wizards"
    }
  ],
  rooms: [
    {
      number: "Gryffindor Tower",
      building_id: 1,
      floor: 7,
      capacity: 4,
      notes: "Dormitory for Gryffindor house students - Harry Potter's room"
    }
  ]
}

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  try {
    console.log("Starting database seed...")

    // Ensure tables exist
    await initializeDatabase()

    // Seed people
    for(const person of seedData.people) {
      await runQuery(
        "INSERT INTO people (name, email, notes, schedule) VALUES (?, ?, ?, ?)",
        [ person.name, person.email, person.notes, person.schedule || "" ]
      )
      console.log(`Added person: ${person.name}`)
    }

    // Seed landlords
    for(const landlord of seedData.landlords) {
      await runQuery(
        "INSERT INTO landlords (name, email, phone, notes) VALUES (?, ?, ?, ?)",
        [ landlord.name, landlord.email, landlord.phone, landlord.notes ]
      )
      console.log(`Added landlord: ${landlord.name}`)
    }

    // Seed buildings
    for(const building of seedData.buildings) {
      await runQuery(
        "INSERT INTO buildings (name, address, landlord_id, notes) VALUES (?, ?, ?, ?)",
        [ building.name, building.address, building.landlord_id, building.notes ]
      )
      console.log(`Added building: ${building.name}`)
    }

    // Seed rooms
    for(const room of seedData.rooms) {
      await runQuery(
        "INSERT INTO rooms (number, building_id, floor, capacity, notes) VALUES (?, ?, ?, ?, ?)",
        [ room.number, room.building_id, room.floor, room.capacity, room.notes ]
      )
      console.log(`Added room: ${room.number}`)
    }

    console.log("Database seeding completed successfully!")
  } catch (err) {
    console.error("Error seeding database:", err.message)
    throw err
  }
}

// Run seed if this file is executed directly
/*eslint no-undef: "off"*/
if("file://" + process.argv[1] === import.meta.url) {
  seedDatabase()
    .then(() => {
      console.log("Seed process finished")
      process.exit(0)
    })
    .catch((err) => {
      console.error("Seed process failed:", err)
      process.exit(1)
    })
}

export { seedDatabase, seedData }
