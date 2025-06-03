import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_BASE_URL} from '../../app.constants';

export interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) { }

  /**
   * Get the current user's accounts
   * @returns Observable of Account array
   */
  getMyAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts/my-accounts`);
  }

  /**
   * Get all accounts (admin only)
   * @returns Observable of Account array
   */
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts`);
  }
}
