// This is not perfect, but it gets the job done
const professorDataSelectors = {
  name: '[class^="NameTitle__Name"]',
  overallQuality: '[class^="RatingValue__Numerator"]',
  commentSelector: '[class^="Rating__Comments"]'
};

const cleanExtract = ($, selector) =>
  $(selector).text().trim();

const extractLatestComments = $ => {
  let comments = $(professorDataSelectors.commentSelector);
  let propComments = [];
  const max = 3;
  let j = 0;
  comments.each(function (i, elem) {
    if (j++ < max) {
      propComments.push($(this).text().trim());
    }
  });
  return propComments;
}

const firstNameExtract = name => {
  return name.split(" ")[0];
}

const lastNameExtract = name => {
  return name.split(" ")[1];
}

module.exports = {
  extract: ($, hyper) => {
    return {
      firstName: firstNameExtract(cleanExtract($, professorDataSelectors.name)),
      lastName: lastNameExtract(cleanExtract($, professorDataSelectors.name)),
      overallQuality: cleanExtract($, professorDataSelectors.overallQuality),
      latestComments: extractLatestComments($),
      link: hyper
    };
  }
};