import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SagaStepInstance {
  id: number;
  stepName: string;
  status: string;
  payload: string;
  createdAt: string;
  updatedAt: string;
}

export interface SagaInstance {
  id: number;
  sagaName: string;
  currentStep: number;
  status: string;
  stepInstances: SagaStepInstance[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SagaService {

  constructor(private http: HttpClient) { }

  /**
   * Get all saga instances (BAAS_ADMIN only)
   */
  getAllSagaInstances(): Observable<SagaInstance[]> {
    return this.http.get<SagaInstance[]>('/api/saga-instances');
  }
}
