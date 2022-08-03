var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  process.env.REACT_APP_AIRTABLE_BASE
);

export const postCocktail = (user, userCocktails) => {
  base("USERS").update(
    [
      {
        id: user.id,
        fields: {
          userCocktails: "working?",
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

export const postUserToAirTable = (userInfo) => {
  base("USERS").create(
    [
      {
        fields: {
          ...userInfo,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

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

export const getUserInfoFromAirtable = async (username, password) => {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/USERS`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
      },
    }
  );
  const list = await response.json();

  return list;
};

export const updateUserFavorites = async (user, userFavorites) => {
  base("USERS").update([
    {
      id: user.id,
      fields: {
        userFavorites: userFavorites,
      },
    },
  ]);
};
