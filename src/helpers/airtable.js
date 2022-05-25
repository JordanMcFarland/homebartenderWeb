var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  process.env.REACT_APP_AIRTABLE_BASE
);

export const postCocktail = (cocktail) => {
  base("COCKTAILS").create(
    [
      {
        fields: {
          ...cocktail,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );
};
