var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  process.env.REACT_APP_AIRTABLE_BASE
);

export const fetchCocktails = async () => {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/COCKTAILS`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
      },
    }
  );
  const list = await response.json();

  return list;
};

export const fetchIngredients = async () => {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/INGREDIENTS`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
      },
    }
  );
  const list = await response.json();

  return list;
};
