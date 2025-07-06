import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  accountNumber: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  reference: string;
  timestamp: string;
  username: string;
  balance: number;
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
