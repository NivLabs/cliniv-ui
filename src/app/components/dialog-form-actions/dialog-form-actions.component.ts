import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-form-actions',
  templateUrl: './dialog-form-actions.component.html'
})
export class DialogFormActionsComponent {

  @Input() showNew: boolean = false;
  @Input() newLabel: string = 'Novo';
  @Input() newTooltip: string = 'Adiciona novo registro';
  @Input() saveDisabled: boolean = false;

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() new = new EventEmitter<void>();

}
