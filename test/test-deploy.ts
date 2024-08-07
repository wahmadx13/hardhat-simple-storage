import { ethers } from "hardhat"
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types"
import { expect, assert } from "chai"

describe("SimpleStorage", function () {
  let simpleStorage: SimpleStorage
  let SimpleStorageFactory: SimpleStorage__factory
  beforeEach(async function () {
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await SimpleStorageFactory.deploy()
  })

  it("Should start with a favorite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0"
    assert.equal(currentValue.toString(), expectedValue)
    // expect(currentValue.toString()).to.equal(expectedValue)
  })

  it("Should update when we call store", async function () {
    const expectedValue = "7"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)
    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Should add a person correctly", async function () {
    const name = "John Doe"
    const favoriteNumber = 43

    await simpleStorage.addPerson(name, favoriteNumber)

    const person = await simpleStorage.people(0)
    const storedFavoriteNumber = await simpleStorage.nameToFavoriteNumber(name)

    assert.equal(person.name, name)
    assert.equal(person.favoriteNumber.toString(), favoriteNumber.toString())
    assert.equal(storedFavoriteNumber.toString(), favoriteNumber.toString())
  })
})
