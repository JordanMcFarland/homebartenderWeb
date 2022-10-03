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

function UserListItem({ cocktail, ...props }) {
  return (
    <Card style={{ minHeight: 60 }}>
      <Link to={`/mycocktails/${cocktail._id}`}>
        {cocktail.image && (
          <CardImg src={cocktail.image} alt={cocktail.name} width="30" />
        )}
        <CardTitle
          style={{
            marginTop: 16,
            marginLeft: 8,
            display: "inline-flex",
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {cocktail.name}
        </CardTitle>
      </Link>
    </Card>
  );
}

function MyCocktailList(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("byName");
  const [userCocktailList, setUserCocktailList] = useState(props.userCocktails);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchBy === "byName") {
      searchByName();
    } else if (searchBy === "byIngredients") {
      searchByIngredients();
    } else if (searchBy === "firstLetter") {
      searchByFirstLetter();
    }
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchBy]);

  useEffect(() => {
    setUserCocktailList(props.userCocktails);
  }, [props.userCocktails]);

  const list = userCocktailList.map((cocktail) => {
    return (
      <div key={cocktail._id} className="col-md-5 m-1">
        <UserListItem cocktail={cocktail} />
      </div>
    );
  });

  const searchByName = () => {
    const filteredCocktails = props.userCocktails.filter((cocktail) => {
      if (searchBy === "byName") {
        return cocktail.name.toUpperCase().includes(searchTerm.toUpperCase());
      }
      if (searchBy === "byIngredients") {
        return cocktail.requiredIngredients.some((ingredient) =>
          ingredient.name.toUpperCase().includes(searchTerm.toUpperCase())
        );
      }
    });
    setUserCocktailList(filteredCocktails);
  };

  const searchByIngredients = () => {
    // Split words by comma (we will eliminate extra whitespace later)
    const newSearchTerms = searchTerm.split(",");

    //empty array to store filtered cocktails
    const filteredCocktails = [];

    props.userCocktails.forEach((cocktail) => {
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
            ingredient.name.toUpperCase().includes(term)
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
    setUserCocktailList(filteredCocktails);
  };

  const searchByFirstLetter = () => {
    if (searchTerm) {
      const filteredCocktails = props.userCocktails.filter(
        (cocktail) => cocktail.name[0].toUpperCase() === searchTerm
      );
      setUserCocktailList(filteredCocktails);
    } else setUserCocktailList(props.userCocktails);
  };

  if (!props.userCocktails) {
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
          <div className="col">
            <Button onClick={() => navigate("/mycocktails/cocktailcreator")}>
              Create a Cocktail
            </Button>
          </div>
        </div>
        <div className="row pt-3">
          {userCocktailList.length <= 0
            ? "You have not added any cocktails."
            : list}
        </div>
      </div>
    );
  }
}

export default MyCocktailList;
