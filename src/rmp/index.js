const got = require("got");
const cheerio = require("cheerio");
const scraper = require("./lib/scraper");

const RMP = universityName => {
  return {
    find: async professorName => {
      let $;

      // Get Page Listings
      const listingPageResponse = await got(
        scraper.url.makeListingPageUrl(universityName, professorName)
      );
      $ = cheerio.load(listingPageResponse.body);
      const listings = scraper.listing.extract($);

      if (listings.length === 0) {
        return {
          found: false,
          professor: {}
        };
      }

      // Get Professor Data
      const professorPageResponse = await got(
        scraper.url.makeProfessorPageUrl(listings[0])
      );

      // Commonly referred to with the $ to mimic jQuery.
      $ = cheerio.load(professorPageResponse.body);

      const hyper = scraper.url.makeProfessorPageUrl(listings[0]);

      const professor = scraper.professor.extract($, hyper);
      return {
        found: true,
        professor
      };
    }
  };
};


module.exports = RMP;