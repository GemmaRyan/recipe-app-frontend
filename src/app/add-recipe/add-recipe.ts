import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/services';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { 
  alphanumericSpacesValidator, 
  urlValidator, 
  numbersSpacesDashesValidator, 
  minArrayLengthValidator,
  difficultyRangeValidator 
} from '../../validators/recipeValidator';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './add-recipe.html',
  styleUrls: ['./add-recipe.scss']
})
export class AddRecipe implements OnInit {
  recipeForm!: FormGroup;
  newIngredient = '';
  newStep = '';
  difficultyLevels = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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
  imageUrl: [''],
  visibility: ['public', Validators.required]
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

  createRecipe(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      this.snackBar.open('Please fix all validation errors', 'Close', { duration: 3000 });
      return;
    }

    const recipeData: Recipe = this.recipeForm.value;

    this.recipeService.createRecipe(recipeData).subscribe({
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