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
  console.log(list);

  // const listObj = {};
  // list.records.forEach((record) => {
  //   const { type, name } = record.fields;

  //   if (!listObj[type]) {
  //     listObj[type] = [];
  //   }

  //   listObj[type] = [...listObj[type], name];
  // });

  // const keyArr = Object.keys(listObj);
  // keyArr.forEach((key) => {
  //   console.log(listObj[key]);
  // });
  // console.log(listObj);
  return list;
};
