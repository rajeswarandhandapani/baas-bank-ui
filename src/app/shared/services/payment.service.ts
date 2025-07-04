import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id?: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  reference: string;
  status?: string;
  timestamp?: string;
  createdBy?: string;
}

export interface CreatePaymentRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  reference: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  /**
   * Create a new payment using the Payment Processing Saga
   */
  createPayment(payment: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>('/api/saga/start/payment-processing', payment);
  }

  /**
   * Get user's own payment history
   */
  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>('/api/payments/my-payments');
  }

  /**
   * Get all payments (BAAS_ADMIN only)
   */
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>('/api/payments');
  }
}
