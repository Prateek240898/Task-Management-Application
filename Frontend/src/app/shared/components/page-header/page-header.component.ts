import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl:
    './page-header.component.html',
  styleUrl:
    './page-header.component.css'
})
export class PageHeaderComponent {

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  buttonText = '';

  @Input()
  buttonIcon = 'add';

  @Output()
  buttonClick =
    new EventEmitter<void>();

  onButtonClick(): void {

    this.buttonClick.emit();
  }
}