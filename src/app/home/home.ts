import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  constructor(private router: Router) {}

  navigateToRecipes(): void {
    this.router.navigate(['/recipes']);
  }

 navigateToLogin(): void {
  this.router.navigate(['/login']);
}

}