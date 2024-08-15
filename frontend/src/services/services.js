import axios from "axios";

const apiUrl = process.env.API_URL || "http://localhost:8080";

const axiosConfig = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error);
    return Promise.reject(error);
  }
);

export const login = async(data)=>{
  try {
    const response = await axiosConfig.post(`${apiUrl}/auth/login`,data);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const signup = async(data)=>{
  try {
    const response = await axiosConfig.post(`${apiUrl}/auth/signup`,data)
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}


export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axiosConfig.get(`${apiUrl}/auth/verify`);
    return response.data; // Should return user details or some verification response
  } catch (error) {
    console.log("Token verification failed:", error);
    return null;
  }
};

//recipe api's

export const fetchRecipes = async (ingredients) => {
  try {
    const response = await axiosConfig.get(`${apiUrl}/api/recipes`, {
      params: { ingredients },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching recipes:", error);
    return error;
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await axiosConfig.get(`${apiUrl}/api/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addFavorite = async (recipeId, token) => {
  try {
    const response = await axiosConfig.post(`${apiUrl}/api/addfavorite`, { recipeId });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getFavorites = async (token) => {
  try {
    const response = await axiosConfig.get(`${apiUrl}/api/favorites`);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};



