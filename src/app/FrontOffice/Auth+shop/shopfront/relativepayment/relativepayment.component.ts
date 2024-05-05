import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Stripe from 'stripe';

@Component({
  selector: 'app-relativepayment',
  templateUrl: './relativepayment.component.html',
  styleUrls: ['./relativepayment.component.css']
})
export class RelativepaymentComponent implements OnInit {
  relativeId: number;

  paymentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.relativeId = parseInt(this.route.snapshot.paramMap.get('relativeId'));

    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]], // Validating card number format
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]], // Validating expiry date format
      cvv: ['', [Validators.required, Validators.pattern('[0-9]{3,4}')]], // Validating CVV format
      amount: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.paymentForm.invalid) {
      return;
    }
  
    const formData = this.paymentForm.value;
    const relativeId = this.relativeId;
  
    const stripe = new Stripe('pk_test_51OEf1yIE7WmosFsXQM419wGsf14REcB9gzwgit8ySGPTjy1OwodLE1CLY7P0brMQ9ckWZhBDn286UrrgRm6qEPjv00OM0QmUto');
    stripe.tokens.create({
      card: {
        number: formData.cardNumber,
        exp_month: formData.expiryDate.split('/')[0],
        exp_year: formData.expiryDate.split('/')[1],
        cvc: formData.cvv
      }
    }).then((result: any) => { // Specify any type for result since TypeScript doesn't recognize its properties
      if (result.error) {
        console.error(result.error.message);
        return;
      }
  
      const tokenId = result.id; // Access the token ID directly from the result object
  
      const expiryDate = formData.expiryDate.split('/').reverse().join('/');
      this.productService.payRelative(relativeId, formData.amount, tokenId).subscribe(
        (response) => {
          console.log(response);
          // Reload the page after successful submission
          window.location.reload();
        },
        (error) => {
          console.error(error);
          window.location.reload();

        }
      );
    });
  }
  
}