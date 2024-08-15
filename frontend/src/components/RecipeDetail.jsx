import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { getRecipeDetails } from '../services/services';

const RecipeDetail = () => {
  const { id } = useParams();
  console.log('id',id);
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const data = await getRecipeDetails(id);
        if (data) {
          setRecipe(data);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError('Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    recipe && (
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Card style={{ display: 'flex', flexDirection: 'row' }}>
          <CardMedia
            component="img"
            style={{ width: '50%' }}
            image={recipe.image}
            alt={recipe.title} // Updated to match recipe title
          />
          <CardContent style={{ width: '50%' }}>
            <Typography variant="h4" component="div" gutterBottom>
              {recipe.title}  {/* Updated to match recipe title */}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {recipe.summary}
            </Typography>
            <Typography variant="h6" component="div" mt={2}>
              Ingredients:
            </Typography>
            <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={{ fontSize: '1rem' }}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name} {/* Updated for ingredient amount */}
                </li>
              ))}
            </ul>
            <Typography variant="h6" component="div" mt={2}>
              <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                View Full Recipe
              </a>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    )
  );
};

export default RecipeDetail;
