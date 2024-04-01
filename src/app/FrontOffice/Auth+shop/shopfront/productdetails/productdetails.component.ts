import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/product.module';

@Component({
  selector: 'app-product-details',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  product: Product | null = null;
  imageUrlPrefix = 'http://localhost:80/hazemimage/';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getProductDetails();
  }

  getProductDetails(): void {
    const productId = this.getProductIdFromRoute();
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        (product: Product) => {
          // Constructing the full image URL based on the imageUrlPrefix
          product.imageUrl = `${this.imageUrlPrefix}${product.imageUrl}`;
          this.product = product;
        },
        (error) => {
          console.error('Error fetching product details:', error);
        }
      );
    } else {
      console.error('Product ID not found in route parameters.');
    }
  }

  getProductIdFromRoute(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }
}
