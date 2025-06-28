import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionTypeClass',
  standalone: true
})
export class TransactionTypeClassPipe implements PipeTransform {
  transform(type: string): string {
    if (!type) return 'text-muted';
    
    switch (type.toUpperCase()) {
      case 'CREDIT':
      case 'DEPOSIT':
        return 'text-success';
      case 'DEBIT':
      case 'WITHDRAWAL':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }
}
