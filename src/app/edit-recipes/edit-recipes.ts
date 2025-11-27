import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-recipe.html',
  styleUrls: ['./edit-recipe.scss']
})
export class EditRecipes implements OnInit {
  recipeId: string | null = null;
  loading = false;
  
  recipe: Recipe = {
    name: '',
    origin: '',
    ingredients: [],
    difficulty: 1,
    recipe: [],
    cookingDuration: '',
    imageUrl: ''
  };

  newIngredient = '';
  newStep = '';
  difficultyLevels = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.loadRecipe(this.recipeId);
    }
  }

  loadRecipe(id: string): void {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recipe:', err);
        this.snackBar.open('Failed to load recipe', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/recipes']);
      }
    });
  }

  addIngredient(): void {
    if (this.newIngredient.trim()) {
      this.recipe.ingredients.push(this.newIngredient.trim());
      this.newIngredient = '';
    }
  }

  removeIngredient(index: number): void {
    this.recipe.ingredients.splice(index, 1);
  }

  addStep(): void {
    if (this.newStep.trim()) {
      this.recipe.recipe.push(this.newStep.trim());
      this.newStep = '';
    }
  }

  removeStep(index: number): void {
    this.recipe.recipe.splice(index, 1);
  }

  moveStepUp(index: number): void {
    if (index > 0) {
      const temp = this.recipe.recipe[index];
      this.recipe.recipe[index] = this.recipe.recipe[index - 1];
      this.recipe.recipe[index - 1] = temp;
    }
  }

  moveStepDown(index: number): void {
    if (index < this.recipe.recipe.length - 1) {
      const temp = this.recipe.recipe[index];
      this.recipe.recipe[index] = this.recipe.recipe[index + 1];
      this.recipe.recipe[index + 1] = temp;
    }
  }

  updateRecipe(): void {
    if (!this.recipe.name || this.recipe.ingredients.length === 0 || this.recipe.recipe.length === 0) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.recipeId) {
      this.recipeService.updateRecipe(this.recipeId, this.recipe).subscribe({
        next: () => {
          this.snackBar.open('Recipe updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/recipes', this.recipeId]);
        },
        error: (err) => {
          console.error('Error updating recipe:', err);
          this.snackBar.open('Failed to update recipe', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    if (this.recipeId) {
      this.router.navigate(['/recipes', this.recipeId]);
    } else {
      this.router.navigate(['/recipes']);
    }
  }
}