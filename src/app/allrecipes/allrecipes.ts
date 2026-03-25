import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-allrecipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './allrecipes.html',
  styleUrls: ['./allrecipes.scss']
})
export class Allrecipes implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  loading = false;
  
  filters = {
    name: '',
    ingredient: '',
    difficulty: undefined as number | undefined,
    minDifficulty: undefined as number | undefined,
    maxDifficulty: undefined as number | undefined
  };

  difficultyLevels = [1, 2, 3, 4, 5];

  constructor(
    private recipeService: RecipeService,
    public router: Router,
    public auth: AuthService
   

    
  ) {}
 
    get userEmail(): string | null {
    return this.auth.getUserEmail();
  }



  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.filteredRecipes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loading = true;
    const filterParams: any = {};

    if (this.filters.difficulty !== undefined) {
      filterParams.difficulty = this.filters.difficulty;
    }
    if (this.filters.minDifficulty !== undefined) {
      filterParams.minDifficulty = this.filters.minDifficulty;
    }
    if (this.filters.maxDifficulty !== undefined) {
      filterParams.maxDifficulty = this.filters.maxDifficulty;
    }
    if (this.filters.ingredient) {
      filterParams.ingredient = this.filters.ingredient;
    }

    this.recipeService.getAllRecipes(filterParams).subscribe({
      next: (data) => {
        this.filteredRecipes = data;
        if (this.filters.name) {
          this.filteredRecipes = this.filteredRecipes.filter(recipe =>
            recipe.name.toLowerCase().includes(this.filters.name.toLowerCase())
          );
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error filtering recipes:', err);
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      ingredient: '',
      difficulty: undefined,
      minDifficulty: undefined,
      maxDifficulty: undefined
    };
    this.loadRecipes();
  }

 viewRecipe(id: string | undefined): void {
  if (id) {
    console.log('Navigating to recipe:', id); 
    this.router.navigate(['/recipes', id]);
  } else {
    console.error('Recipe ID is undefined');
  }
}

  createRecipe(): void {
    this.router.navigate(['/add-recipe']);
  }

  getDifficultyStars(difficulty: number): string {
    return '⭐'.repeat(difficulty);
  }

  
  getUsername(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.username;
}

}