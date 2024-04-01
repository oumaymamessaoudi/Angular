import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../Models/product.module';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  editProductForm!: FormGroup;
  productId: number | null = null;
  product: Product | null = null;
  selectedFile: File | null = null; // Declare selectedFile property here

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.getProductIdFromURL();
    this.productService.getProductById(this.productId!).subscribe(
      (product: Product) => {
        this.product = product;
        this.initializeForm(product);
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  initializeForm(product: Product): void {
    this.editProductForm = this.formBuilder.group({
      productName: [product.productName, [Validators.required, Validators.minLength(2)]],
      prodDesc: [product.prodDesc, [Validators.required, this.containsWordValidator]],
      price: [product.price, [Validators.required, Validators.min(1)]],
      prodCapacity: [product.prodCapacity, [Validators.required, Validators.min(1)]],
      archProd: [product.archProd, Validators.required],
      image: [null], // Initially set to null
      imagePathField: [product.imageUrl] // Initialized with the existing image URL
    });
  }
  containsWordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const valid = /\w+/.test(value); // Check if the value contains at least one word character (\w)
    return valid ? null : { containsWord: true };
  }
  
  

  getProductIdFromURL(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
    }
  }
  onSubmit() {
    if (this.editProductForm.valid && this.productId) {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
  
      // Append existing form fields to FormData
      formData.append('productName', this.editProductForm.get('productName')?.value);
      formData.append('prodDesc', this.editProductForm.get('prodDesc')?.value);
      formData.append('price', this.editProductForm.get('price')?.value);
      formData.append('prodCapacity', this.editProductForm.get('prodCapacity')?.value);
      formData.append('archProd', this.editProductForm.get('archProd')?.value);
  
      // Check if a new file has been selected
      if (this.selectedFile) {
        // If new file selected, append it to FormData
        formData.append('image', this.selectedFile);
      } else {
        // If no new file selected, set a flag to indicate to the server that the existing image should be retained
        formData.append('retainImage', 'true');
      }
  
      // Call the service to update the product
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.editProductForm.reset();
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.editProductForm.markAllAsTouched();
    }
  }
  

  
}
