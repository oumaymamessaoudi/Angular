import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  imagePath: string | null = null;
  selectedFile: File | null = null;

  constructor(private formBuilder: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(2)]], // Minimum length of 2 letters
      prodDesc: ['', [Validators.required, this.containsWordValidator]], // Custom validator for containing at least one word
      price: ['', [Validators.required, Validators.min(1)]], // Minimum value of 1
      prodCapacity: ['', [Validators.required, Validators.min(1)]],
      archProd: ['', Validators.required],
      image: [null, Validators.required] // Rename 'imageUrl' to 'image'
    });
  }

  containsWordValidator(control: { value: string; }) {
    const wordPattern = /[a-zA-Z]+/;
    if (wordPattern.test(control.value)) {
      return null; // Validation passed
    } else {
      return { 'noWord': true }; // Validation failed
    }
  }

  onSubmit() {
    // Show confirmation dialog
    const confirmed = confirm("Are you sure you want to submit the form?");
    if (confirmed) {
        if (this.addProductForm.valid && this.selectedFile) {
            const imageUrl = `${this.selectedFile.name}`;

            // Pass the imageUrl to the addProduct method
            this.productService.addProduct(this.addProductForm.value, imageUrl).subscribe({
                next: (response) => {
                    console.log('Product added successfully:', response);
                    this.addProductForm.reset();
                    this.imagePath = null;
                    this.selectedFile = null;
                },
                error: (error) => {
                    console.error('Error adding product:', error);
                }
            });
        } else {
            this.addProductForm.markAllAsTouched();
        }
    } else {
        console.log('Action cancelled');
    }
}


  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.addProductForm.get('image')?.setValue(file); // Update the 'image' control with the selected file
      this.imagePath = `${file.name}`;
    }
  }
}
