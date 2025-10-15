import sqlite3 from "sqlite3"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Use test database when NODE_ENV is 'test', otherwise use production database
/*eslint no-undef: "off"*/
const dbName = "test" === process.env.NODE_ENV ? "test.db" : "data.db"
const dbPath = join(__dirname, "..", dbName)

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if(err) {
    console.error("Error opening database:", err.message)
  } else {
    console.log(`Connected to SQLite database: ${dbName}`)
  }
})

/**
 * Initialize database tables
 */
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create people table
      db.run(`
        CREATE TABLE IF NOT EXISTS people (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          notes TEXT,
          schedule TEXT
        )
      `, (err) => {
        if(err) console.error("Error creating people table:", err.message)
      })

      // Create landlords table
      db.run(`
        CREATE TABLE IF NOT EXISTS landlords (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          notes TEXT
        )
      `, (err) => {
        if(err) console.error("Error creating landlords table:", err.message)
      })

      // Create buildings table
      db.run(`
        CREATE TABLE IF NOT EXISTS buildings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          address TEXT,
          landlord_id INTEGER,
          notes TEXT,
          FOREIGN KEY (landlord_id) REFERENCES landlords(id)
        )
      `, (err) => {
        if(err) console.error("Error creating buildings table:", err.message)
      })

      // Create rooms table
      db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          number TEXT NOT NULL,
          building_id INTEGER,
          floor INTEGER,
          capacity INTEGER,
          notes TEXT,
          FOREIGN KEY (building_id) REFERENCES buildings(id)
        )
      `, (err) => {
        if(err) {
          console.error("Error creating rooms table:", err.message)
          reject(err)
        } else {
          console.log("Database tables initialized")
          resolve()
        }
      })
    })
  })
}

/**
 * Run a query that returns multiple rows
 * @param { string } sql
 * @param { Array } params
 * @returns { Promise< Array > }
 */
function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if(err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Run a query that returns a single row
 * @param { string } sql
 * @param { Array } params
 * @returns { Promise< object > }
 */
function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if(err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

/**
 * Run an insert/update/delete query
 * @param { string } sql
 * @param { Array } params
 * @returns { Promise< object > }
 */
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    /*eslint no-invalid-this: "off"*/
    db.run(sql, params, function(err) {
      if(err) {
        reject(err)
      } else {
        resolve({ lastID: this.lastID, changes: this.changes })
      }
    })
  })
}

/**
 * Close database connection
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if(err) {
        reject(err)
      } else {
        console.log("Database connection closed")
        resolve()
      }
    })
  })
}

/**
 * Reset database by dropping all tables and recreating them
 */
function resetDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DROP TABLE IF EXISTS rooms")
      db.run("DROP TABLE IF EXISTS buildings")
      db.run("DROP TABLE IF EXISTS landlords")
      db.run("DROP TABLE IF EXISTS people", (err) => {
        if(err) {
          console.error("Error dropping tables:", err.message)
          reject(err)
        } else {
          console.log("Database tables dropped")
          // Reinitialize tables after dropping
          initializeDatabase()
            .then(resolve)
            .catch(reject)
        }
      })
    })
  })
}

export {
  db,
  initializeDatabase,
  queryAll,
  queryOne,
  runQuery,
  closeDatabase,
  resetDatabase
}
