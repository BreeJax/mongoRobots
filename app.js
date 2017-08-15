const express = require("express")
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId
const assert = require("assert")

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

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err)
  database = db
  console.log("Connected successfully to mongo server")
})

app.get("/", (req, res) => {
  let collection = database.collection("robots")
  collection.find({}).toArray((err, robots) => {
    res.render("home", { robots: robots })
  })
})

app.get("/info/:id", (req, res) => {
  // Get the ID from the URL
  const requestId = req.params.id

  // Make a connection to the 'robots' collection
  let collection = database.collection("robots")

  // Find One robot from the collection by trying
  // to match the ID from the params (requestId) to
  // the mongo generated `_id` attribute
  //
  // THEN, when you find one, render that robot
  collection.findOne({ _id: ObjectId(requestId) }).then(robot => res.render("info", robot))
})

app.get("/needwork", (req, res) => {
  let collection = database.collection("robots")
  collection.find({ job: null }).toArray((err, robots) => {
    res.render("needwork", { robots: robots })
  })
})

app.listen(3000, () => {
  console.log("I've got the magic in me!")
})
