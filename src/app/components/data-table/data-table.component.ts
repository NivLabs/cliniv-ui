import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

export interface DataTableColumn {
  key: string;
  label: string;
  cell?: (row: any) => string;
  cssClass?: string;
  cellClass?: (row: any) => string;
  width?: string;
  /** Habilita ordenação por essa coluna (clique no cabeçalho). Padrão: não ordenável. */
  sortable?: boolean;
  /**
   * Nome do atributo enviado como `orderBy` ao backend, quando difere de `key` — necessário
   * para colunas vindas de join (ex: key 'categoryDescription' -> sortKey 'category.description',
   * mesmo caminho aninhado usado nas projeções de SELECT dos repositórios).
   */
  sortKey?: string;
}

export interface DataTableAction {
  icon: string;
  tooltip?: string;
  onClick: (row: any) => void;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {

  @Input() items: Array<any> = [];
  @Input() columns: Array<DataTableColumn> = [];
  @Input() actions: Array<DataTableAction> = [];
  @Input() loading: boolean;
  @Input() dataNotFound: boolean;
  @Input() emptyMessage: string = 'Nenhum registro encontrado...';
  @Input() clickable: boolean = true;
  @Input() rowClass: (row: any) => string;
  @Input() length: number = 0;
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 24;
  @Input() pageSizeOptions: Array<number> = [12, 24, 48, 96];
  @Input() sortActive: string = '';
  @Input() sortDirection: 'asc' | 'desc' | '' = '';

  @Output() rowClick = new EventEmitter<any>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  get displayedColumns(): Array<string> {
    const keys = this.columns.map(column => column.key);
    return this.actions?.length ? [...keys, 'actions'] : keys;
  }

  sortId(column: DataTableColumn): string {
    return column.sortKey || column.key;
  }

  cellValue(column: DataTableColumn, row: any): string {
    const value = column.cell ? column.cell(row) : row[column.key];
    return this.isEmpty(value) ? '-' : value;
  }

  private isEmpty(value: any): boolean {
    return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
  }

  columnFlex(column: DataTableColumn): string {
    return `0 0 ${column.width || '150px'}`;
  }

  onRowClick(row: any): void {
    if (this.clickable) {
      this.rowClick.emit(row);
    }
  }

  onActionClick(event: MouseEvent, action: DataTableAction, row: any): void {
    event.stopPropagation();
    action.onClick(row);
  }
}
