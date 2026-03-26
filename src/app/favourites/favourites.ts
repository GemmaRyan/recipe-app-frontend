import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/services';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './favourites.html',
  styleUrls: ['./favourites.scss']
})
export class Favourites implements OnInit {
  favouriteRecipes: Recipe[] = [];
  loading = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavourites();
  }

  loadFavourites(): void {
    this.loading = true;
    this.recipeService.getFavourites().subscribe({
      next: (data) => {
        this.favouriteRecipes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading favourites:', err);
        this.loading = false;
      }
    });
  }

  viewRecipe(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/recipes', id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  getDifficultyStars(difficulty: number): string {
    return '⭐'.repeat(difficulty);
  }
}