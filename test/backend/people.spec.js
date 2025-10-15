import { expect } from "chai"
import { get, add } from "../../lib/services/people.service.js"
import { resetDatabase } from "../../lib/database/connection.js"

describe("People API Functions", function() {
  // Reset database before all tests to ensure clean state
  before(async function() {
    await resetDatabase()
  })
  describe("get()", function() {
    it("should return an array of people", async function() {
      const result = await get(new URL("http://localhost:3000/api/people"))

      expect(result).to.be.an("array")
    })

    it("should return people with required properties", async function() {
      const result = await get(new URL("http://localhost:3000/api/people"))
      
      result.forEach(person => {
        expect(person).to.have.property("id")
        expect(person).to.have.property("name")
        expect(person).to.have.property("email")
        expect(person).to.have.property("notes")
      })
    })
  })

  describe("add()", function() {
    it("should add a new person and return it with an id", async function() {
      const newPerson = {
        name: "Test Person",
        email: "test@example.com",
        notes: "Test notes"
      }
      
      const result = await add(null, "PUT", newPerson)
      
      expect(result).to.have.property("id")
      expect(result.name).to.equal("Test Person")
      expect(result.email).to.equal("test@example.com")
    })

    it("should update an existing person when id is provided", async function() {
      const updatedPerson = {
        id: 1,
        name: "Updated Kermit",
        email: "kermit@muppets.com",
        notes: "Updated notes"
      }
      
      const result = await add(null, "PUT", updatedPerson)
      
      expect(result.id).to.equal(1)
      expect(result.name).to.equal("Updated Kermit")
    })

    it("should generate sequential ids for new people", async function() {
      const person1 = await add(null, "PUT", { name: "Person 1", email: "", notes: "" })
      const person2 = await add(null, "PUT", { name: "Person 2", email: "", notes: "" })
      
      expect(person2.id).to.be.greaterThan(person1.id)
    })
  })
})