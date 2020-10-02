const extractProfessorListingsFrom = $ =>
  $(".listing")
  .find("a")
  .map((_, a) => $(a).prop("href"))
  .get();

module.exports = {
  extract: $ => extractProfessorListingsFrom($)
};