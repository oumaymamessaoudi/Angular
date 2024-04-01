import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../Models/product.module';
import { Order } from '../Models/order.modules';
import { Router } from '@angular/router';
import { Elderly } from '../Models/elderly.module';

export interface Page<T> {
  content: T[];
  size: number;
  number: number;
  totalElements: number;
  // Add other properties as needed
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8081';

  getProductCapacity(orderId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/products/${orderId}/capacity`);
  }
  
  getElderlyOrderInfoWithBoughtOrders(): Observable<any[]> {
    const url = `${this.apiUrl}/bought`; // Endpoint URL in Spring controller
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  generatePDF(): Observable<Blob> {
    const url = `${this.apiUrl}/generate-pdf`;
    return this.http.post(url, {}, { responseType: 'blob' });
  }




  sendNotification(elderlyId: number, productId: number): Observable<any> {
    const url = `${this.apiUrl}/send-notification/${elderlyId}/${productId}`;
  
    return this.http.post<void>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  



  createPaymentIntent(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/intent`, orderId);;
  }

  buyOrder(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/buy/${orderId}`, null);
  }

  constructor(private http: HttpClient,private router: Router) { }
  addProductToOrder(productId: number, elderlyId: number): Observable<any> {
    const params = { productId: productId.toString(), elderlyId: elderlyId.toString() };
    return this.http.post<any>(`${this.apiUrl}/addProductToOrder`, {}, { params })
      .pipe(
        catchError(this.handleError)
      );
  }
  updateCartItemQuantity(orderId: number, quantity: number): Observable<any> {
    const url = `${this.apiUrl}/updateCartItemQuantity`;
    const params = { orderId, quantity };
    return this.http.put<any>(url, null, { params });
  }
  


  getElderlyCart(elderlyId: number): Observable<Order[]> {
    const url = `${this.apiUrl}/${elderlyId}/cart`;
    console.log('Fetching cart for elderly with ID:', elderlyId);
    console.log('URL:', url);
    return this.http.get<Order[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}/cancel`);
  }
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?searchTerm=${searchTerm}`);
  }
  

 goToElderlyCart(elderlyId: number): void {
    this.router.navigate(['elderly', elderlyId, 'cart']);
  }
  
  getElderlyData(elderlyId: number): Observable<Elderly> {
    return this.http.get<Elderly>(`${this.apiUrl}/elderly/${elderlyId}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getProductNameByOrderId(orderId: number): Observable<string> {
    // Make HTTP request to fetch product name by order ID from backend API
    return this.http.get<string>(`${this.apiUrl}/order/${orderId}/productName`);
  }


  getProductById(id: number): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  toggleProductStatus(productId: number): Observable<Product> {
    const url = `${this.apiUrl}/${productId}/toggle-status`;
    return this.http.post<Product>(url, {});
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllProductsPage(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
    return this.http.get(`${this.apiUrl}/productspage`, { params });
  }
  

  updateProduct(id: number, updatedProductData: Product): Observable<Product> {
    const url = `${this.apiUrl}/${id}/update`;
    return this.http.put<Product>(url, updatedProductData)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/uploadImage`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  addProduct(productData: any, imagePath: string): Observable<any> {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    formData.append('image', imagePath);

    return this.http.post<any>(`${this.apiUrl}/addproduct`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }
 

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
