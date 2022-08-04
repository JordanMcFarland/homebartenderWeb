import { baseUrl } from "../shared/baseUrl";

// *** User Calls ***
export const loginUser = async (creds) => {
  try {
    const response = await fetch(baseUrl + "users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    });

    if (!response.ok) {
      const error = new Error(
        `Error ${response.status}: ${response.statusText}`
      );
      error.response = response;
      throw error;
    }

    const json = await response.json();

    if (json.success) {
      localStorage.setItem("token", json.token);
    } else {
      const error = new Error("Error " + json.status);
      error.response = json;
      throw error;
    }

    const sortedUserCocktails = json.user.userCocktails.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
    json.user.userCocktails = sortedUserCocktails;

    return json.user;
  } catch (err) {
    console.error(err);
  }
};

export const createUserAccount = async (newUserInfo) => {
  try {
    const response = await fetch(baseUrl + "users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInfo),
    });

    if (!response.ok) {
      const error = new Error(
        `Error ${response.status}: ${response.statusText}`
      );
      error.response = response;
      throw error;
    }

    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err.response);
  }
};

// *** User cocktails ***

export const postCocktail = async (userCocktail) => {
  try {
    const response = await fetch(baseUrl + "users/usercocktails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userCocktail),
    });

    if (!response.ok) {
      const error = new Error(
        `Error ${response.status}: ${response.statusText}`
      );
      error.response = response;
      throw error;
    }

    const json = await response.json();

    if (json) {
      return json;
    } else {
      const error = new Error("Error " + json.status);
      error.response = json;
      throw error;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getUserCocktails = async () => {
  try {
    const response = await fetch(baseUrl + "users/usercocktails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const json = await response.json();

    if (json) {
      return json.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
    } else {
      const error = new Error("Error " + json.status);
      error.response = json;
      throw error;
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteUserCocktail = async (userCocktailId) => {
  try {
    const response = await fetch(
      baseUrl + `users/usercocktails/${userCocktailId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const json = await response.json();
    console.log(json);

    if (json) {
      return json.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
    } else {
      const error = new Error("Error " + json.status);
      error.response = json;
      throw error;
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateUserCocktail = async (userCocktailId, editedCocktail) => {
  try {
    const response = await fetch(
      baseUrl + `users/usercocktails/${userCocktailId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: editedCocktail.name,
          requiredIngredients: editedCocktail.requiredIngredients,
          recipe: editedCocktail.recipe,
        }),
      }
    );

    const json = await response.json();
    console.log(json);

    if (json) {
      return json.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
    } else {
      const error = new Error("Error " + json.status);
      error.response = json;
      throw error;
    }
  } catch (err) {
    console.error(err);
  }
};
