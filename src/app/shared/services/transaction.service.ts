import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id?: string;
  accountNumber: string;
  transactionType: string;
  amount: number;
  description: string;
  timestamp?: string;
  balance?: number;
  reference?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  /**
   * Get user's own transaction history
   */
  getMyTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/transactions/my-transactions');
  }

  /**
   * Get all transactions (BAAS_ADMIN only)
   */
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/transactions');
  }
}
