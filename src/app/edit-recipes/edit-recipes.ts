import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/services';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { 
  alphanumericSpacesValidator, 
  urlValidator, 
  numbersSpacesDashesValidator, 
  minArrayLengthValidator,
  difficultyRangeValidator 
} from '../../validators/recipeValidator';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  styleUrls: ['./edit-recipes.scss']
})
export class EditRecipes implements OnInit {
  recipeId: string | null = null;
  loading = false;
  recipeForm!: FormGroup;
  
  newIngredient = '';
  newStep = '';
  difficultyLevels = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.loadRecipe(this.recipeId);
    }
  }

  initializeForm(): void {
    this.recipeForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(2),
        alphanumericSpacesValidator()
      ]],
      origin: ['', [urlValidator()]],
      ingredients: this.fb.array([], [minArrayLengthValidator(1)]),
      difficulty: [1, [
        Validators.required,
        difficultyRangeValidator()
      ]],
      recipe: this.fb.array([], [minArrayLengthValidator(1)]),
      cookingDuration: ['', [numbersSpacesDashesValidator()]],
      imageUrl: ['']
    });
  }

  get name() {
    return this.recipeForm.get('name');
  }

  get origin() {
    return this.recipeForm.get('origin');
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get difficulty() {
    return this.recipeForm.get('difficulty');
  }

  get recipe(): FormArray {
    return this.recipeForm.get('recipe') as FormArray;
  }

  get cookingDuration() {
    return this.recipeForm.get('cookingDuration');
  }

  get imageUrl() {
    return this.recipeForm.get('imageUrl');
  }

  loadRecipe(id: string): void {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.populateForm(data);
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

  populateForm(recipe: Recipe): void {
    this.recipeForm.patchValue({
      name: recipe.name,
      origin: recipe.origin,
      difficulty: recipe.difficulty,
      cookingDuration: recipe.cookingDuration,
      imageUrl: recipe.imageUrl
    });

    this.ingredients.clear();
    recipe.ingredients.forEach(ingredient => {
      this.ingredients.push(this.fb.control(ingredient, [Validators.required, Validators.minLength(1)]));
    });

    this.recipe.clear();
    recipe.recipe.forEach(step => {
      this.recipe.push(this.fb.control(step, [Validators.required, Validators.minLength(1)]));
    });
  }

  addIngredient(): void {
    if (this.newIngredient.trim()) {
      this.ingredients.push(this.fb.control(this.newIngredient.trim(), [Validators.required, Validators.minLength(1)]));
      this.newIngredient = '';
    }
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addStep(): void {
    if (this.newStep.trim()) {
      this.recipe.push(this.fb.control(this.newStep.trim(), [Validators.required, Validators.minLength(1)]));
      this.newStep = '';
    }
  }

  removeStep(index: number): void {
    this.recipe.removeAt(index);
  }

  moveStepUp(index: number): void {
    if (index > 0) {
      const current = this.recipe.at(index);
      this.recipe.removeAt(index);
      this.recipe.insert(index - 1, current);
    }
  }

  moveStepDown(index: number): void {
    if (index < this.recipe.length - 1) {
      const current = this.recipe.at(index);
      this.recipe.removeAt(index);
      this.recipe.insert(index + 1, current);
    }
  }

  updateRecipe(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      this.snackBar.open('Please fix all validation errors', 'Close', { duration: 3000 });
      return;
    }

    if (this.recipeId) {
      const recipeData: Recipe = this.recipeForm.value;
      
      this.recipeService.updateRecipe(this.recipeId, recipeData).subscribe({
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