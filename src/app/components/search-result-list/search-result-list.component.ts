import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html'
})
export class SearchResultListComponent {

  @Input() items: Array<any>;
  @Input() loading: boolean;
  @Input() dataNotFound: boolean;
  @Input() emptyMessage: string = 'Nenhum registro encontrado...';
  @Input() itemColClass: string = 'col-12 col-sm-12 col-md-4 col-lg-4';

  @Output() scrolled = new EventEmitter<void>();

  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

}
