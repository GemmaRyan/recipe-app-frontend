import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-recipe',
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
    MatSnackBarModule
  ],
  templateUrl: './add-recipe.html',
  styleUrls: ['./add-recipe.scss']
})
export class AddRecipe {
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
    private router: Router,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

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

  createRecipe(): void {
    if (!this.recipe.name || this.recipe.ingredients.length === 0 || this.recipe.recipe.length === 0) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.recipeService.createRecipe(this.recipe).subscribe({
      next: () => {
        this.snackBar.open('Recipe created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        console.error('Error creating recipe:', err);
        this.snackBar.open('Failed to create recipe', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
  }
}