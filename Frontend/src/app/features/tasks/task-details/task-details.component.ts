import {
  Component,
  Inject
} from '@angular/core';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl:
    './task-details.component.html',
  styleUrl:
    './task-details.component.css'
})
export class TaskDetailsComponent {

  showFullDescription =
    false;

  constructor(
    private dialogRef:
      MatDialogRef<TaskDetailsComponent>,

    @Inject(
      MAT_DIALOG_DATA
    )
    public task: any
  ) { }

  close(): void {

    this.dialogRef.close();
  }

  toggleDescription(): void {

    this.showFullDescription =
      !this.showFullDescription;
  }

  get descriptionText(): string {

    const description =
      this.task?.description || '';

    if (
      this.showFullDescription
    ) {

      return description;
    }

    return description.length > 300
      ? description.substring(
        0,
        300
      ) + '...'
      : description;
  }

  get shouldShowToggle(): boolean {

    return (
      this.task?.description?.length || 0
    ) > 300;
  }
}