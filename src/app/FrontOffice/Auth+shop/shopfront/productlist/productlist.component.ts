import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/product.module';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {
  products: Product[] = [];
  imageUrlPrefix = 'http://localhost:80/hazemimage/';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts()
      .subscribe(
        (products: Product[]) => {
          // Filter products that are 'Not Available'
          this.products = products.filter(product => product.archProd === 'Available')
                                  .map(product => {
                                    // Constructing the full image URL based on the filename
                                    product.imageUrl = `${this.imageUrlPrefix}${product.imageUrl}`;
                                    return product;
                                  });
        },
        (error: any) => {
          console.error('Error fetching products: ', error);
        }
      );
  }
  toggleStatus(productId: number): void {
    this.productService.toggleProductStatus(productId)
      .subscribe(
        (updatedProduct: Product) => {
          // Find the updated product in the array and update its status
          const index = this.products.findIndex(product => product.productId === updatedProduct.productId);
          if (index !== -1) {
            this.products[index].archProd = updatedProduct.archProd;
          }
        },
        (error) => {
          console.error('Error toggling product status: ', error);
        }
      );
  }
  
}
