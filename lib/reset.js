import { resetDatabase } from "./db.js"
import { seedDatabase } from "./seed.js"

/**
 * Reset the database and reseed with default data
 */
async function resetAndSeed() {
  try {
    console.log("Resetting database...")

    // Drop all tables and recreate them
    await resetDatabase()
    console.log("Database reset complete")

    // Seed with default data
    await seedDatabase()

    console.log("Reset and seed process completed successfully!")
  } catch (err) {
    console.error("Error during reset and seed:", err.message)
    throw err
  }
}

// Run reset and seed if this file is executed directly
if("file://" + process.argv[1] === import.meta.url) {
  resetAndSeed()
    .then(() => {
      console.log("Process finished")
      process.exit(0)
    })
    .catch((err) => {
      console.error("Process failed:", err)
      process.exit(1)
    })
}

export { resetAndSeed }
