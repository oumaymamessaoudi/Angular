import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '@stripe/stripe-js';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-bought-products',
  templateUrl: './bought-products.component.html',
  styleUrls: ['./bought-products.component.css']
})
export class BoughtProductsComponent implements OnInit {
  elderlyId!: number;
  boughtOrders: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.elderlyId = +params['elderlyId'];
      console.log('Elderly ID from URL:', this.elderlyId);
      this.getBoughtOrdersForElderly();
    });
  }

  getBoughtOrdersForElderly(): void {
    console.log('Fetching bought orders...');
    this.productService.getBoughtOrdersForElderly(this.elderlyId)
      .subscribe(orders => {
        console.log('Bought orders:', orders);
        this.boughtOrders = orders;
      }, error => {
        console.error('Error fetching bought orders:', error);
      });
  }

  goToProductsPage(elderlyId: number): void {
    this.router.navigate(['/products', elderlyId]);
  }}