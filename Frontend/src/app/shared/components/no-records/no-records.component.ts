import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MatIconModule
} from '@angular/material/icon';

@Component({
  selector: 'app-no-records',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl:
    './no-records.component.html',
  styleUrl:
    './no-records.component.css'
})
export class NoRecordsComponent {

  @Input()
  title =
    'No Records Found';

  @Input()
  message =
    'There is no data available to display.';
}