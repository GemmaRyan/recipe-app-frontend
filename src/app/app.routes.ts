import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Allrecipes } from './allrecipes/allrecipes';
import { RecipeDetails } from './recipe-details/recipe-details';
import { EditRecipes } from './edit-recipes/edit-recipes';
import { AddRecipe } from './add-recipe/add-recipe';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Favourites } from './favourites/favourites';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'recipes', component: Allrecipes },
  { path: 'recipes/:id', component: RecipeDetails },  
  { path: 'create', component: AddRecipe },
  { path: 'add-recipe', component: AddRecipe },
  { path: 'edit-recipe/:id', component: EditRecipes },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'favourites', component: Favourites },
  { path: '**', redirectTo: '' }
];