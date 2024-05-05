import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-elderly-cart',
  templateUrl: './elderly-cart.component.html',
  styleUrls: ['./elderly-cart.component.css']
})
export class ElderlyCartComponent implements OnInit {
  elderlyId!: number;
  elderlyCart: any[] = [];
  stripePromise: Promise<Stripe | null>;
  cardElement: any; // Adjust the type accordingly


  cartItem: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
    this.stripePromise = loadStripe('pk_test_51OEf1yIE7WmosFsXQM419wGsf14REcB9gzwgit8ySGPTjy1OwodLE1CLY7P0brMQ9ckWZhBDn286UrrgRm6qEPjv00OM0QmUto'); // Replace with your publishable key
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.elderlyId = +params['elderlyId'];
      console.log('Elderly ID from URL:', this.elderlyId);
      this.getElderlyCart();
    });
    
  }
  goToProductsPage(elderlyId: number): void {
    this.router.navigate(['/products', elderlyId]);
  }
  getElderlyCart(): void {
    console.log('Fetching elderly cart...');
    this.productService.getElderlyCart(this.elderlyId)
      .subscribe(cart => {
        console.log('Elderly cart:', cart);
        this.elderlyCart = cart;
      }, error => {
        console.error('Error fetching elderly cart:', error);
      });
  }

 

  updateTotalPrice(index: number): void {
    const item = this.elderlyCart[index];
    item.totalPrice = item.price * item.quantite;
  }


  

  removeItem(index: number): void {
    this.elderlyCart.splice(index, 1);
  }
  
  highlightRow(event: MouseEvent): void {
    (event.target as HTMLElement).parentElement?.classList.add('highlighted-row');
  }

  removeHighlight(event: MouseEvent): void {
    (event.target as HTMLElement).parentElement?.classList.remove('highlighted-row');
  }
  cancelOrder(orderId: number): void {
    const index = this.elderlyCart.findIndex(item => item.orderId === orderId);
    if (index !== -1) {
      this.elderlyCart.splice(index, 1);
    }
  
    this.productService.cancelOrder(orderId)
      .subscribe(
        () => {
          // Order cancelled successfully
        }
      );
  }
  
  
updateQuantity(orderId: number, newQuantity: number): void {
  console.log('Updating quantity for order ID:', orderId);
  console.log('New quantity:', newQuantity);

  const payload = { orderId: orderId, quantity: newQuantity };
  console.log('Request payload:', payload);

  this.productService.updateCartItemQuantity(orderId, newQuantity).subscribe(
    response => {
      console.log('Quantity updated successfully:', response);
      // Handle success, if needed
    },
    error => {
      if (error.status === 200 && !error.ok) {
        // Consider status 200 with ok being false as an error
        // Handle error accordingly
      } else {
        // Handle other errors
      }
    }
  );
}

showStripeInput: boolean = false;
// Modify toggleStripeInput method to store the orderId
toggleStripeInput(orderId: number): void {
  // Store the orderId in a variable
  this.cartItem = orderId;
  this.showStripeInput = !this.showStripeInput;
}



decrementQuantity(orderId: number, currentQuantity: number): void {
  console.log('Decrementing quantity for order ID:', orderId);
  const newQuantity = Math.max(1, currentQuantity - 1); // Ensure quantity doesn't go below 1
  console.log('New quantity:', newQuantity);

  // Update the quantity directly in the local elderlyCart array
  const index = this.elderlyCart.findIndex(item => item.orderId === orderId);
  if (index !== -1) {
    this.elderlyCart[index].quantite = newQuantity;
    this.updateTotalPrice(index);

  }

  // Call the updateQuantity method to update the quantity in the backend
  this.updateQuantity(orderId, newQuantity);
}
incrementQuantity(orderId: number, currentQuantity: number): void {
  console.log('Incrementing quantity for order ID:', orderId);
  const newQuantity = currentQuantity + 1;
  console.log('New quantity:', newQuantity);

  // Retrieve product capacity
  this.productService.getProductCapacity(orderId).subscribe(
    productCapacity => {
      // Check if new quantity exceeds product capacity
      if (newQuantity <= productCapacity) {
        // Update the quantity directly in the local elderlyCart array
        const index = this.elderlyCart.findIndex(item => item.orderId === orderId);
        if (index !== -1) {
          this.elderlyCart[index].quantite = newQuantity;
          this.updateTotalPrice(index);
        }

        // Call the updateQuantity method to update the quantity in the backend
        this.updateQuantity(orderId, newQuantity);
      } else {
        console.error('Quantity exceeds product capacity:', newQuantity);
        // Handle error accordingly
      }
    },
    error => {
      console.error('Error retrieving product capacity:', error);
      // Handle error accordingly
    }
  );
}



























 
async processPayment(orderId: number): Promise<void> {
  const stripe = await this.stripePromise;
  if (!stripe) {
    console.error('Stripe.js not loaded.');
    return;
  }

    const cardNameInput = document.getElementById('card-name') as HTMLInputElement;
  const cardNumberInput = document.getElementById('card-number') as HTMLInputElement;
  const expiryDateInput = document.getElementById('expiry-date') as HTMLInputElement;
  const cvvInput = document.getElementById('cvv') as HTMLInputElement;

  // Validate card details
  if (!cardNameInput.checkValidity()) {
    alert('Please enter a valid name on the card.');
    return;
  }

  if (!cardNumberInput.checkValidity()) {
    alert('Please enter a valid card number.');
    return;
  }

  if (!expiryDateInput.checkValidity()) {
    alert('Please enter a valid expiry date in MM/YY format.');
    return;
  }

  if (!cvvInput.checkValidity()) {
    alert('Please enter a valid CVV.');
    return;
  }

  try {
    // Create a payment intent
    const response = await this.productService.createPaymentIntent(orderId).toPromise();

    // Log the entire response object
    console.log('Payment Intent Response:', response);

    // Check if the response is not null or undefined
    if (response && typeof response === 'object') {
      // Check if the response contains the clientSecret property
      if ('clientSecret' in response) {
        const clientSecret = response['clientSecret'];
        // Handle the clientSecret appropriately
        if (clientSecret) {
          // Redirect to checkout using the clientSecret
          this.redirectToCheckout(clientSecret);
        } else {
          console.error('Error creating payment intent: clientSecret is empty');
        }
      } else {
        console.error('Error creating payment intent: clientSecret not found in response');
      }
    } else {
      console.error('Error creating payment intent: Unexpected response format', response);
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
  }
}

async redirectToCheckout(clientSecret: string) {

}






buyOrder2(orderId: number): void {
  const confirmed = confirm("Are you sure you want to buy this order?");
  if (!confirmed) {
    console.log('Action cancelled');
    return; // Exit the method if not confirmed
  }

  this.route.params.subscribe(params => {
    const elderlyId = +params['elderlyId'];
    console.log('Elderly ID from URL:', elderlyId);
    this.productService.buyOrderWithElderlyAccount(orderId, elderlyId).subscribe(
      response => {
        console.log('Order bought successfully:', response);
        // Handle success response here, if needed
        window.location.reload();
      },
      error => {
        console.error('Failed to buy order:', error);
        window.location.reload();

        // Handle error response here, if needed
      }
    );
  });
}




}