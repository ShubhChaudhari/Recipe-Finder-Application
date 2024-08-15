const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipeIds: [{ type: Number, required: true }], // Array of recipe IDs
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
