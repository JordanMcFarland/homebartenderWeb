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

    if (!response.ok) {
      const error = new Error(
        `Error ${response.status}: ${response.statusText}`
      );
      error.response = response;
      throw error;
    }

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

  if (response.ok) {
    return json;
  } else {
    const error = json.error;
    throw new Error(error);
  }
};

export const updateUserCocktail = async (userCocktailId, editedCocktail) => {
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

  if (response.ok) {
    return json;
  } else {
    const error = json.error;
    throw new Error(error);
  }
};

// *** User Favorites ***

export const getUserFavorites = async () => {
  try {
    const response = await fetch(baseUrl + "users/favorites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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

export const postUserFavorite = async (cocktailInfo) => {
  try {
    const response = await fetch(baseUrl + "users/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: cocktailInfo,
    });

    if (!response.ok) {
      console.log(response);
      const error = response;
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
    return err;
  }
};

export const deleteUserFavorite = async (cocktailInfo) => {
  try {
    const response = await fetch(baseUrl + "users/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: cocktailInfo,
    });

    if (!response.ok) {
      const error = response;
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
    return err;
  }
};

// *** User Bar ***

export const updateUserBar = async (updatedUserBar) => {
  try {
    const response = await fetch(baseUrl + "users/userBar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedUserBar),
    });

    if (!response.ok) {
      const error = response;
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
