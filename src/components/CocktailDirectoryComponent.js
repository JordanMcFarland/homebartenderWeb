import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardImg,
  CardImgOverlay,
  CardTitle,
  Label,
} from "reactstrap";

function RenderDirectoryItem({ cocktail, ...props }) {
  return (
    <Card style={{ minHeight: 60 }}>
      <Link
        to={`/${!cocktail.userId ? "directory" : "mycocktails"}/${
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
  const navigate = useNavigate();

  useEffect(() => {
    if (searchBy === "byName") {
      searchByName();
    } else if (searchBy === "byIngredients") {
      searchByIngredients();
    } else if (searchBy === "firstLetter") {
      searchByFirstLetter();
    }
    console.log(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchBy]);

  useEffect(() => {
    setCocktailDirectory(props.cocktails);
  }, [props.cocktails]);

  const directory = cocktailDirectory.map((cocktail) => {
    return (
      <div key={cocktail._id} className="col-md-5 m-1">
        <RenderDirectoryItem cocktail={cocktail} />
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

  const searchByFirstLetter = () => {
    if (searchTerm) {
      const filteredCocktails = props.cocktails.filter(
        (cocktail) => cocktail.name[0].toUpperCase() === searchTerm
      );
      setCocktailDirectory(filteredCocktails);
    } else setCocktailDirectory(props.cocktails);
  };

  if (!props.cocktails && window.location.pathname === "mycocktails") {
    return <div>You have not added any cocktails.</div>;
  } else {
    return (
      <div className="container py-3">
        <div className="row">
          <div className="col col-sm-6 col-md-4 col-xl-3">
            <Label htmlFor="searchBy">Search by: </Label>{" "}
            <select id="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
              <option value="byName">Name</option>
              <option value="byIngredients">Ingredients</option>
              <option value="firstLetter">First Letter</option>
            </select>
          </div>
          {searchBy !== "firstLetter" ? (
            <div className="col col-sm-6 col-md-4 col-xl-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
              />{" "}
            </div>
          ) : (
            <div className="col col-sm-6 col-md-4 col-xl-3">
              <Label htmlFor="letter">Letter:</Label>{" "}
              <select
                id="letter"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="..."
              >
                <option value="">...</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="M">M</option>
                <option value="N">N</option>
                <option value="O">O</option>
                <option value="P">P</option>
                <option value="Q">Q</option>
                <option value="R">R</option>
                <option value="S">S</option>
                <option value="T">T</option>
                <option value="U">U</option>
                <option value="V">V</option>
                <option value="W">W</option>
                <option value="X">X</option>
                <option value="Y">Y</option>
                <option value="Z">Z</option>
              </select>
            </div>
          )}
          {window.location.pathname === "/mycocktails" ? (
            <div className="col">
              <Button onClick={() => navigate("/mycocktails/cocktailcreator")}>
                Create a Cocktail
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="row pt-3">
          {window.location.pathname === "/mycocktails" &&
          cocktailDirectory.length <= 0
            ? "You have not added any cocktails."
            : directory}
        </div>
      </div>
    );
  }
}

export default CocktailDirectory;
