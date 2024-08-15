import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { addFavorite, fetchRecipes } from "../services/services";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const [favourite, setFevourite] = useState(false);
  const [error, setError] = useState("");
  // const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const handleSearchRecipe = async () => {
    try {
      const response = await fetchRecipes(query);
      if (response.length === 0) {
        setError("No recipes found. Please search for another recipe.");
      } else {
        setError("");
        setFilteredRecipes(response);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleFavorite = async (recipeId) => {
    try {
      const response = await addFavorite(recipeId);
      if (response.status === 200) {
        // Update local favorite state
        setFavoriteRecipes((prevFavorites) => [...prevFavorites, recipeId]);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login"); // Redirect to login if user is not authenticated
      } else {
        setError("Failed to add to favorites. Please try again.");
      }
    }
  };

  useEffect(() => {}, []);

  const isFavorite = (recipeId) => favoriteRecipes.includes(recipeId);

  // const handleFavourite = () => {
  //   setFevourite(!favourite);
  // };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Box display="flex" justifyContent="center" mb={4} alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Search for recipes..."
          value={query}
          onChange={handleSearch}
          fullWidth
          style={{ maxWidth: "400px", marginRight: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchRecipe}
        >
          Search
        </Button>
      </Box>
      {error && (
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      )}
      <Grid container spacing={4}>
        {filteredRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <Link
                to={`/recipe/${recipe.id}`}
                style={{ textDecoration: "none" }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={recipe.image}
                  alt={recipe.title}
                />
              </Link>
              <CardContent style={{ flexGrow: 1, overflow: "hidden" }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Used Ingredients: {recipe.usedIngredientCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Missed Ingredients: {recipe.missedIngredientCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Likes: {recipe.likes}
                </Typography>
                <Typography variant="h6" component="div" mt={2}>
                  Ingredients:
                </Typography>
                <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                  {recipe.missedIngredients
                    .concat(recipe.usedIngredients)
                    .map((ingredient, index) => (
                      <li key={index} style={{ fontSize: "0.9rem" }}>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </li>
                    ))}
                </ul>
              </CardContent>
              <IconButton
                onClick={() => handleFavorite(recipe.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: isFavorite(recipe.id) ? "red" : "inherit", // Change color based on isFavorite status
                }}
              >
                {isFavorite(recipe.id) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
