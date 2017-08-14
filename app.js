const express = require("express")
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient,
  assert = require("assert")
let database
let url = "mongodb://localhost:27017/robots"

const app = express()

app.engine("mustache", mustacheExpress())

app.set("views", "./templates")
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// mongo.connect(url, () => {
//   assert.equal(null, err)
//   console.log("Successfully connected.")
// })

let insertDocuments = function(db, callback) {
  // Get the documents collection
  let collection = db.collection("robots")
  // Insert some documents
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, resultOfQuery) {
    assert.equal(err, null)
    assert.equal(3, resultOfQuery.result.n) //result
    assert.equal(3, resultOfQuery.ops.length)
    console.log("Inserted 3 documents into the collection")
    console.log(resultOfQuery)
    callback(resultOfQuery)
  })
}

const getAllRobots = (db, callback) => {
  let collection = db.collection("robots")
  collection.find({}).toArray((err, docs) => {
    console.log({ err, docs })
    callback(err, docs)
  })
}

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err)
  database = db
  console.log("Connected successfully to mongo server")
  // insertDocuments(db, () => {
  //   console.log("successfully inserted")
  // })

  getAllRobots(db, (err, robots) => {
    console.log("successs")
    console.log({ err, robots })
  })
  // db.close()
})

app.get("/", (req, res) => {
  getAllRobots(database, (err, robots) => {
    res.json({ robots })
  })
})

app.listen(3000, () => {
  console.log("I've got the magic in me!")
})
