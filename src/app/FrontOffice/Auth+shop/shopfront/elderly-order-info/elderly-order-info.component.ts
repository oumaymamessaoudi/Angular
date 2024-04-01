import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-elderly-order-info',
  templateUrl: './elderly-order-info.component.html',
  styleUrls: ['./elderly-order-info.component.css']
})
export class ElderlyOrderInfoComponent implements OnInit {
  elderlyOrderInfoList: any[] = [];
  orders: any[] = []; // Define the orders array


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getOrders(); // Call the method to fetch orders when component initializes
  }

  getOrders(): void {
    this.productService.getElderlyOrderInfoWithBoughtOrders()
      .subscribe(
        (data: any[]) => {
          this.orders = data;
        },
        error => {
          console.error('Error fetching orders:', error);
          // Handle error if needed
        }
      );
  }
  generatePDF(): void {
    this.productService.generatePDF()
      .subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'elderly_orders.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error => {
          console.error('Error generating PDF:', error);
          // Handle error if needed
        }
      );
  }
}