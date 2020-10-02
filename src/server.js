// Express server which receives a list of professor names and searches Rate My Professor for them
// Handles name preprocessing

const express = require("express");
const port = 3000;
const app = express();
const RMP = require("./rmp/index.js");
const bodyParser = require("body-parser");
const BYU = RMP("Brigham Young University");
const RMP_NOT_FOUND = 6;
const UNDEFINED = 'undefined';

const parseName = name => {
  name = name.trim();
  if (name.length === RMP_NOT_FOUND || name.length === 0) {
    return UNDEFINED;
  }
  return name.split(" ");
}

const tryNameVariants = async name => {
  if (name === UNDEFINED || !Array.isArray(name)) {
    return name;
  }
  let response = await BYU.find(firstLastName(name));
  if (response.found) {
    return response.professor;
  }
  response = await BYU.find(middleLastName(name));
  if (response.found) {
    return response.professor;
  }
  response = await BYU.find(fullName(name));
  if (response.found) {
    return response.professor;
  }
  return UNDEFINED;
}

const firstLastName = name => {
  if (name.length >= 2) { // Has name in format Last, First
    const firstName = name[1];
    const comma = name[0].indexOf(',');
    const lastName = comma === -1 ? name[0] : name[0].substring(0, comma);
    return `${firstName} ${lastName}`;
  }
  return UNDEFINED;
};

const middleLastName = name => {
  if (name.length >= 3) { // Last, First Middle
    const comma = name[0].indexOf(",");
    if (comma !== -1) {
      const lastName = x[0].substring(0, comma);
      const middleName = x[2];
      return `${middleName} ${lastName}`;
    }
  }
  return UNDEFINED;
};

const fullName = name => {
  if (name.length >= 3) { // Last, First Middle
    const comma = name[0].indexOf(",");
    if (comma !== -1) {
      const lastName = x[0].substring(0, comma);
      const firstName = x[1];
      const middleName = x[2];
      return `${firstName} ${middleName} ${lastName}`;
    }
  }
  return UNDEFINED;
};

const processProfessorList = async professors => {
  let allProfessors = []
  for (let i = 0; i < professors.length; i++) {
    let professor = null;
    try {
      professor = await tryNameVariants(parseName(professors[i]));
    } catch (err) {
      professor = UNDEFINED;
    }
    allProfessors.push(professor);
    while (professors[i] === professors[i + 1]) {
      allProfessors.push(professor_response);
      i++;
    }
  }
  return allProfessors;
}

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.listen(port, () => console.log("Listening on port"));

app.get("/", (req, res) => {
  res.send("This server is operational");
});

app.post("/", function (req, res) {
  processProfessorList(req.body).then(response => {
    if (typeof response[0] == "undefined") {
      res.send();
    } else {
      res.send(response);
    }
  }).catch(error => {
    res.send();
  });
});