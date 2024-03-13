const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// 1
app.get("/states/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      state
    ORDER BY
      state_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});   

// 2
app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      state
    WHERE
      stateId = ${stateId};`;
  const book = await db.get(getBookQuery);
  response.send(book);
});

// 3
app.post("/districts/", async (request, response) => {
  const districtDetails = request.body;
  const {
    districtName,
    stateId,
    cases,
    ratincuredgCount,
    active,
    deaths,
  } = districtDetails;
  const addDistrict = `
    INSERT INTO
      book (districtName,stateId,cases,ratincuredgCount,active,deaths)
    VALUES
      (
        '${districtName}',
         ${stateId},
         ${cases},
         ${ratincuredgCount},
         ${active},
        '${deaths}',
      );`;

  const dbResponse = await db.run(addDistrict);
  const districtId = dbResponse.lastID;
  response.send({"District Successfully Added"});
});

//4 
app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrict = `
    SELECT
      *
    FROM
      book
    WHERE
      book_id = ${districtId};`;
  const district = await db.get(getDistrict);
  response.send(district);
});

//5
app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getAuthorBooksQuery = `
    SELECT
     *
    FROM
     district 
    WHERE
      districtId = ${districtId};`;
  const booksArray = await db.all(getAuthorBooksQuery);
  response.send("District Removed");
});

//6
app.put("/districts/:districtId/", async (request, response) => {
  const { district_id } = request.params;
  const districtDetails = request.body;
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
    
  } = districtDetails;
  const updateBookQuery = `
    UPDATE
      district 
    SET
      districtName='${districtName}',
      stateId=${stateId},
      cases=${cases},
      cured=${cured},
      active=${active},
      deaths='${deaths}',
    WHERE
      district_id = ${district_id};`;
  await db.run(updateBookQuery);
  response.send("District Details Updated");
});

//7

app.get(" /states/:stateId/stats/", async (request, response) => {
  const { state_id } = request.params;
  const total_cases_cured_activedeaths = `
    SELECT
      *
    FROM
      totalCases,
      totalCured,
      totalActive,
      totalDeaths
    WHERE
      state_id = ${total_cases_cured_activedeaths};`;
  const book = await db.get(getBookQuery);
  response.send(book);
});

//8

app.get("/districts/:districtId/details/", async (request, response) => {
  const { district_id } = request.params;
  const getState = `
    SELECT
      stateName
    FROM
      district 
    WHERE
      district_id = ${district_id};`;
  const book = await db.get(getState);
  response.send(book);
});