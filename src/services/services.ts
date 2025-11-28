import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';

export interface Recipe {
  _id?: string;
  name: string;
  origin?: string;
  ingredients: string[];
  difficulty: number;
  recipe: string[];
  cookingDuration?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUri}/recipes`;  // This will be http://localhost:3001/api/recipes

  constructor(private http: HttpClient) { }

  getAllRecipes(filters?: { 
    difficulty?: number,
    minDifficulty?: number,
    maxDifficulty?: number,
    origin?: string,
    ingredient?: string
  }): Observable<Recipe[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.difficulty !== undefined) {
        params = params.set('difficulty', filters.difficulty.toString());
      }
      if (filters.minDifficulty !== undefined) {
        params = params.set('minDifficulty', filters.minDifficulty.toString());
      }
      if (filters.maxDifficulty !== undefined) {
        params = params.set('maxDifficulty', filters.maxDifficulty.toString());
      }
      if (filters.origin) {
        params = params.set('origin', filters.origin);
      }
      if (filters.ingredient) {
        params = params.set('ingredient', filters.ingredient);
      }
    }

    return this.http.get<Recipe[]>(this.apiUrl, { params });
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  getRecipeByName(name: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/name/${name}`);
  }

  getRecipesByDifficulty(difficulty: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/difficulty/${difficulty}`);
  }

  getRecipesByIngredient(ingredient: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/ingredient/${ingredient}`);
  }

  createRecipe(recipe: Recipe): Observable<any> {
    return this.http.post<any>(this.apiUrl, recipe);
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}