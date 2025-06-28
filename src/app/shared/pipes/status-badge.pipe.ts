import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: string, type: 'account' | 'payment' | 'notification'): string {
    if (!status) return 'badge bg-secondary';
    
    const upperStatus = status.toUpperCase();
    
    switch (type) {
      case 'account':
        return this.getAccountStatusClass(upperStatus);
      case 'payment':
        return this.getPaymentStatusClass(upperStatus);
      case 'notification':
        return this.getNotificationStatusClass(upperStatus);
      default:
        return 'badge bg-secondary';
    }
  }

  private getAccountStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FROZEN':
      case 'SUSPENDED':
      case 'CLOSED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  private getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
      case 'PROCESSED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FAILED':
      case 'REJECTED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  private getNotificationStatusClass(status: string): string {
    switch (status) {
      case 'NEW':
        return 'badge bg-primary';
      case 'SENT':
      case 'DELIVERED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FAILED':
      case 'ERROR':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}
