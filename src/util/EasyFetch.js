const apiURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8000"


// POST
export async function easyPost(URL, body, token = null) {
  try {
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiURL + URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        data,
        headers: response.headers,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// POST-IMAGE
export async function easyPostWithFile(URL, formData, token = null) {
  try {
    let headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiURL + URL, {
      method: "POST", // Use POST method for creating new posts
      headers: headers,
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      const errorMessage = isJson
        ? await response.json()
        : await response.text();
      throw new Error(errorMessage);
    }

    return isJson ? await response.json() : {};
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// PATCH-IMAGE
export async function easyPatchWithFile(URL, formData, token = null) {
  try {
    let headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiURL + URL, {
      method: "PATCH", // Use PATCH method for updating existing posts
      headers: headers,
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      const errorMessage = isJson
        ? await response.json()
        : await response.text();
      throw new Error(errorMessage);
    }

    return isJson ? await response.json() : {};
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// GET
export async function easyGet(URL, token) {
  try {
    const response = await fetch(apiURL + URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      let data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error:", error);
  }
}

// DELETE
export async function easyDelete(URL, token) {
  try {
    const response = await fetch(apiURL + URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// PATCH (for editing)
export async function easyPatch(URL, body, token) {
  try {
    const response = await fetch(apiURL + URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
