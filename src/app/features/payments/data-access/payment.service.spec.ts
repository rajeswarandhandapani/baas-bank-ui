import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
describe('Payment API contract', () => {
  it('accepts the backend plain-text 202 response without a JSON parsing error', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpTestingController);
    let response = '';
    TestBed.inject(PaymentService)
      .createPayment({
        sourceAccountNumber: '10001',
        destinationAccountNumber: '10002',
        amount: 10,
        description: 'Lunch',
      })
      .subscribe((value) => (response = value));
    const request = http.expectOne('/api/saga/start/payment-processing');
    expect(request.request.responseType).toBe('text');
    request.flush('Payment processing started with saga ID: 1', {
      status: 202,
      statusText: 'Accepted',
    });
    expect(response).toContain('saga ID: 1');
    http.verify();
  });
});
