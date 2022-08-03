import React, { useState, useEffect, useInsertionEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";

function RenderDirectoryItem({ cocktail, ...props }) {
  return (
    <Card style={{ minHeight: 60 }}>
      <Link
        to={`/${props.location === "directory" ? "directory" : "mycocktails"}/${
          cocktail._id
        }`}
      >
        {cocktail.image ? (
          <CardImg src={cocktail.image} alt={cocktail.name} width="30" />
        ) : (
          <div />
        )}
        <CardImgOverlay>
          <CardTitle>{cocktail.name}</CardTitle>
        </CardImgOverlay>
      </Link>
    </Card>
  );
}

function CocktailDirectory(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("byName");
  const [cocktailDirectory, setCocktailDirectory] = useState(props.cocktails);

  useEffect(() => {
    if (searchBy === "byName") {
      searchByName();
    } else {
      searchByIngredients();
    }
    // console.log(cocktailDirectory);
    // console.log(searchBy);
  }, [searchTerm]);

  useEffect(() => {
    setCocktailDirectory(props.cocktails);
  }, [props.location]);

  const directory = cocktailDirectory.map((cocktail) => {
    return (
      <div key={cocktail._id} className="col-md-5 m-1">
        <RenderDirectoryItem cocktail={cocktail} location={props.location} />
      </div>
    );
  });

  const searchByName = () => {
    const filteredCocktails = props.cocktails.filter((cocktail) => {
      if (searchBy === "byName") {
        return cocktail.name.toUpperCase().includes(searchTerm.toUpperCase());
      }
      if (searchBy === "byIngredients") {
        return cocktail.requiredIngredients.some((ingredient) =>
          ingredient.toUpperCase().includes(searchTerm.toUpperCase())
        );
      }
    });
    setCocktailDirectory(filteredCocktails);
  };

  const searchByIngredients = () => {
    // Split words by comma (we will eliminate extra whitespace later)
    const newSearchTerms = searchTerm.split(",");

    //empty array to store filtered cocktails
    const filteredCocktails = [];

    props.cocktails.forEach((cocktail) => {
      // Destructure ingredients out of cocktail object for code readability
      const { requiredIngredients } = cocktail;

      // Boolean value to indicate whether or not the cocktail includes all required ingredients
      let hasIngredients = true;

      newSearchTerms.forEach((searchTerm) => {
        // Convert search term to upper case and remove whitespace at beginning and end
        const term = searchTerm.toUpperCase().trim();
        // Check each search term to see if there is a cocktail ingredient that contains it
        if (
          !requiredIngredients.some((ingredient) =>
            ingredient.toUpperCase().includes(term)
          )
        ) {
          // If not, set the boolean to false to flag that this cocktail should not go in the list
          hasIngredients = false;
        }
      });
      // Check whether or not all ingredients are included and whether or not the cocktail is already on the list
      if (
        hasIngredients &&
        !filteredCocktails.some((item) => item._id === cocktail._id)
      ) {
        // If so, pass this into our empty array
        filteredCocktails.push(cocktail);
      }
    });

    // Finally, set state with the array of cocktails
    setCocktailDirectory(filteredCocktails);
  };

  if (!props.cocktails && props.location === "mycocktails") {
    return <div>You have not added any cocktails.</div>;
  } else {
    return (
      <div className="container py-3">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />{" "}
        <select id="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
          <option value="byName">By Name</option>
          <option value="byIngredients">By Ingredients</option>
        </select>
        {/*<Button onClick={searchByName}>Search</Button> */}
        <div className="row">
          {props.location === "mycocktails" && cocktailDirectory.length <= 0
            ? "You have not added any cocktails."
            : directory}
        </div>
      </div>
    );
  }
}

export default CocktailDirectory;
