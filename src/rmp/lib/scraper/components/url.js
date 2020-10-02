const rmpBaseUrl = "https://www.ratemyprofessors.com";
const makeQueryString = str =>
  str
    .split(" ")
    .filter(str => str.length > 0)
    .join("+");

module.exports = {
  makeListingPageUrl: (university, professorName) =>
    `${rmpBaseUrl}/search.jsp?queryBy=teacherName&schoolName=${makeQueryString(
      university
    )}&query=${makeQueryString(professorName)}`,
  makeProfessorPageUrl: listing => `${rmpBaseUrl}${listing}`
};
