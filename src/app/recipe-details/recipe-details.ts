import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/services';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './recipe-details.html',
  styleUrls: ['./recipe-details.scss']
})
export class RecipeDetails implements OnInit {
  recipe: Recipe | null = null;
  loading = false;
  recipeId: string | null = null;

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

  editRecipe(): void {
    if (this.recipeId) {
      this.router.navigate(['/edit-recipe', this.recipeId]);
    }
  }

  deleteRecipe(): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      if (this.recipeId) {
        this.recipeService.deleteRecipe(this.recipeId).subscribe({
          next: () => {
            this.snackBar.open('Recipe deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/recipes']);
          },
          error: (err) => {
            console.error('Error deleting recipe:', err);
            this.snackBar.open('Failed to delete recipe', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  getDifficultyStars(difficulty: number): string {
    return '⭐'.repeat(difficulty);
  }
}