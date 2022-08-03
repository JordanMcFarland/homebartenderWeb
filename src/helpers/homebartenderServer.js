import { baseUrl } from "../shared/baseUrl";

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
      localStorage.setItem("creds", JSON.stringify(creds));
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
      return json.sort();
    } else {
      const error = new Error("Error " + json.status);
      error.response = json;
      throw error;
    }
  } catch (err) {
    console.error(err);
  }
};
