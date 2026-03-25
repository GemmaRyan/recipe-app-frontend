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
import { AuthService } from '../../services/auth.service';

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
    private snackBar: MatSnackBar,
    public auth: AuthService
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

      this.recipeService.trackRecipeView(id).subscribe({
        next: () => console.log('Recipe view counted'),
        error: (err) => console.error('Failed to count recipe view', err)
      });
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
  if (!this.auth.isLoggedIn()) {
    this.snackBar.open('Please login to edit recipes', 'Close', { duration: 3000 });
    return;
  }

  if (this.recipeId) {
    this.router.navigate(['/edit-recipe', this.recipeId]);
  }
}

deleteRecipe(): void {
  if (!this.auth.isLoggedIn()) {
    this.snackBar.open('Please login to delete recipes', 'Close', { duration: 3000 });
    return;
  }

  if (confirm('Are you sure you want to delete this recipe?')) {
    if (this.recipeId) {
      this.recipeService.deleteRecipe(this.recipeId).subscribe({
        next: () => {
          this.snackBar.open('Recipe deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/recipes']);
        },
        error: () => {
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

  isOwner(): boolean {
  if (!this.recipe) return false;

  const loggedInUsername = this.auth.getUsername();
  return this.recipe.createdByUsername === loggedInUsername;
}

isAdmin(): boolean {
  return this.auth.getRole() === 'admin';
}

canEditOrDelete(): boolean {
  return this.auth.isLoggedIn() && (this.isOwner() || this.isAdmin());
}

}