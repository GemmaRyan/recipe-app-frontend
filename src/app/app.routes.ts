import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Allrecipes } from './allrecipes/allrecipes';
import { RecipeDetails } from './recipe-details/recipe-details';
import { EditRecipes } from './edit-recipes/edit-recipes';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'recipes', component: Allrecipes },
  { path: 'recipe/:id', component: RecipeDetails },
  { path: 'edit/:id', component: EditRecipes },
//   { path: 'create', component: EditRecipesComponent },
  { path: '**', redirectTo: '/home' }
];