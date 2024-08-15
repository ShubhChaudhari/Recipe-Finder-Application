const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/user");
const verifyToken = require("../middleware/auth");
const axios = require("axios");
const Favorite = require("../model/favorite");

router.get("/recipes", async (req, res) => {
  const { ingredients } = req.query;

  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_API_URL}/findByIngredients`,
      {
        params: {
          ingredients: ingredients,
          number: 10,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  console.log(
    `${process.env.SPOONACULAR_API_URL}/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
  );
  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_API_URL}/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    console.log("response", response);

    const recipe = response.data;

    // Structure the response
    const recipeDetails = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      ingredients: recipe.extendedIngredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
      sourceUrl: recipe.spoonacularSourceUrl,
    };

    res.status(200).json(recipeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recipe details" });
  }
});

router.post("/addfavorite", verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.user_id;

    let favorite = await Favorite.findOne({ user: userId });

    if (!favorite) {
      favorite = new Favorite({ user: userId, recipeIds: [recipeId] });
    } else {
      if (favorite.recipeIds.includes(recipeId)) {
        return res.status(400).json({ message: "Recipe is already in favorites" });
      }
      favorite.recipeIds.push(recipeId);
    }

    await favorite.save();

    res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    console.error("Error in addFavorite:", error); // Log the specific error
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const favorites = await Favorite.find({ user: userId });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
