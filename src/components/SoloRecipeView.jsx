import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ADDR } from '../config';
import parse from 'html-react-parser';

import time from '../../dist/resources/SoloRecipeView/time.png';
import cost from '../../dist/resources/SoloRecipeView/cost.png';
import emptyHeart from '../../dist/resources/SoloRecipeView/emptyHeart.png';
import fullHeart from '../../dist/resources/SoloRecipeView/fullHeart.png';
import back from '../../dist/resources/SoloRecipeView/back.png';
import check from '../../dist/resources/SoloRecipeView/check.png';
import emptyStar from '../../dist/resources/SoloRecipeView/emptyStar.png';
import fullStar from '../../dist/resources/SoloRecipeView/fullStar.png';


const SoloRecipeView = ({ captureNavigation, recipeId, previousView, favorites, captureFavorites, liked, captureLikes, pantry }) => {
  const [recipe, updateRecipe] = useState('');
  const getRecipe = (id) => {
    axios.get(`${API_ADDR}/recipes/${id}`)
      .then ((res) => {
        updateRecipe(res.data);
      })
  }
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  let favoriteRecipeIds = favorites.map(element => element.id);

  useEffect(() => {
    getRecipe(recipeId);
  }, [recipeId])

  if (!recipe) {
    return <div>Still Loading...</div>
  }

  return (
    <div className="soloRecipeViewContainer">
      <div className="recipeViewHeader">
        {window.innerWidth <= 800 && <div className="mobileBackFavorite">
          <img className="backButton" src={back} onClick={(e) => captureNavigation(previousView)}/>
          <img className="favoriteButton" src={favoriteRecipeIds.includes(recipeId) ? fullStar : emptyStar} onClick={(e) => captureFavorites(recipeId, true)}/>
        </div>}
        {window.innerWidth > 800 && <img className="backButton" src={back} onClick={(e) => captureNavigation(previousView)}/>}
        <div className="recipeName">{recipe.title}</div>
        {window.innerWidth > 800 && <img className="favoriteButton" src={favoriteRecipeIds.includes(recipeId) ? fullStar : emptyStar} onClick={(e) => captureFavorites(recipeId, true)}/>}
      </div>
      <div className="recipeInformation">
        <img className="recipeImage" src={recipe.image}/>
        <div className="recipeStatsContainer">
          <div className="recipeStats">
            <img className="recipeStatIcon" src={time}/>
            <div className="recipeStat">{recipe.time} minutes</div>
          </div>
          <div className="recipeStats">
            <img className="recipeStatIcon" src={cost}/>
            <div className="recipeStat">${numberWithCommas((Math.floor((recipe.price/100) * 100) / 100).toFixed(2))} per serving</div>
          </div>
          <div className="recipeStats">
            <img
              id="likeButton"
              className="recipeStatIcon"
              src={liked.includes(recipeId) ? fullHeart : emptyHeart}
              onClick={(e) => {
                liked.includes(recipeId) ? recipe.likes-- : recipe.likes++;
                captureLikes(recipeId)
              }}
            />
            <div className="recipeStat">{numberWithCommas(recipe.likes)} {recipe.likes > 1 ? 'users like':'user likes'} this recipe</div>
          </div>
          <div className="recipeTagsContainer">
            <div className="tagsContainer dietTags">
              {recipe.tags.map(tag => {
                if (tag.category === 'diets') {
                  return <div key={tag.id}>{tag.name}</div>
                }
              })}
            </div>
            <div className="tagsContainer cuisineTags">
              {recipe.tags.map(tag => {
                if (tag.category === 'cuisines') {
                  return <div key={tag.id}>{tag.name}</div>
                }
              })}
            </div>
            <div className="tagsContainer dishTags">
              {recipe.tags.map(tag => {
                if (tag.category === 'dish') {
                  return <div key={tag.id}>{tag.name}</div>
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="recipeDescription">
        {parse(recipe.summary)}
      </div>
      <div className="recipeBody">
        <div className="recipeIngredientList">
          <section>Ingredients List</section>
          {recipe.ingredients.map(ingredient => {
            return (
              <div className="ingredientListEntry" key={ingredient.id}>
                <img src={check} style={{visibility: pantry.includes(ingredient.id) ? 'visible':'hidden'}}/>
                <div>{ingredient.name}</div>
              </div>
            );
          })}
        </div>
        <div className="recipeInstructions">
          <section className="instructionsHeader">Instructions</section>
          {recipe.instructions.map((instruction, index) => {
            return (
              <div className="instructionContainer" key={index}>
                <div>{instruction.name}</div>
                {instruction.steps.map((step, index) => (
                  <div key={index}>{index+1}. {step}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SoloRecipeView;