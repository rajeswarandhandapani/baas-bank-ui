import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificationTypeBadge',
  standalone: true
})
export class NotificationTypeBadgePipe implements PipeTransform {
  transform(type: string): string {
    if (!type) return 'badge bg-info';
    
    switch (type.toUpperCase()) {
      case 'ACCOUNT_OPENED':
      case 'ACCOUNT_CREATED':
      case 'ACCOUNT_ACTIVATED':
        return 'badge bg-success';
      case 'PAYMENT_PROCESSED':
      case 'PAYMENT_SUCCESS':
      case 'TRANSFER_SUCCESS':
        return 'badge bg-success';
      case 'PAYMENT_FAILED':
      case 'TRANSFER_FAILED':
        return 'badge bg-danger';
      case 'SECURITY_ALERT':
      case 'FRAUD_ALERT':
        return 'badge bg-warning';
      default:
        return 'badge bg-info';
    }
  }
}
