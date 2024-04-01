import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/product.module';

@Component({
  selector: 'app-productlistclient',
  templateUrl: './productlistclient.component.html',
  styleUrls: ['./productlistclient.component.css']
})
export class ProductlistclientComponent implements OnInit {
  products: Product[] = [];
  imageUrlPrefix = 'http://localhost:80/hazemimage/';
  elderlyId: number | undefined;
  searchTerm: string = '';
  filteredProducts: Product[] = [];
  isVoiceSearchSupported: boolean = false;
  recognition: any | null = null; // Declare recognition property
  pageSize: number = 10;
  totalPages!: number;
  totalPagesArray!: number[];
  currentPage: number = 0; // Assuming initial page 

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
    this.route.paramMap.subscribe(params => {
      this.elderlyId = Number(params.get('elderlyId'));
    });
    this.isVoiceSearchSupported = 'webkitSpeechRecognition' in window;

    // Initialize voice search if supported
    if (this.isVoiceSearchSupported) {
      this.initializeVoiceSearch();
    } else {
      console.warn('Voice search is not supported in this browser.');
    }
  }

  initializeVoiceSearch(): void {
    // Initialize SpeechRecognition object
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Event listener for when speech recognition returns a result
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.searchTerm = transcript;
      this.searchProducts();
    };

    // Event listener for errors in speech recognition
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    // Start speech recognition when the user clicks the search button
    const voiceSearchButton = document.querySelector('.voice-search-button');
    if (voiceSearchButton) {
      voiceSearchButton.addEventListener('click', () => {
        if (this.recognition) {
          this.recognition.start();
        }
      });
    }
  }
 fetchProducts(): void {
  const pageSize = 10; // Adjust the page size as needed
  const offset = this.currentPage * pageSize;
  
  this.productService.getAllProductsPage(this.currentPage, pageSize).subscribe(
    (response: any) => {
      this.totalPages = response.totalPages;
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, index) => index);
      
      // Set the products directly from the response
      this.products = response.content;
      
      // Filter out products that are not available
      this.filteredProducts = this.products.filter(product => product.archProd === 'Available')
        .map(product => {
          product.imageUrl = `${this.imageUrlPrefix}${product.imageUrl}`;
          return product;
        });
    },
    (error) => {
      console.error('Error fetching products: ', error);
    }
  );
}

  

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }
  
  searchProducts(): void {
    // Method to search products based on the search term
    if (this.searchTerm.trim() === '') {
      // If search term is empty, fetch all available products
      this.fetchAvailableProducts();
    } else {
      // Search available products based on the search term
      this.productService.searchProducts(this.searchTerm).subscribe(
        (products: Product[]) => {
          this.products = products.filter(product => product.archProd === 'Available')
            .map(product => {
              product.imageUrl = `${this.imageUrlPrefix}${product.imageUrl}`;
              return product;
            });
        },
        (error) => {
          console.error('Error searching products: ', error);
        }
      );
    }
  }

  fetchAvailableProducts(): void {
    // Method to fetch available products
    this.productService.getAllProducts().subscribe(
      (products: Product[]) => {
        this.products = products.filter(product => product.archProd === 'Available')
          .map(product => {
            product.imageUrl = `${this.imageUrlPrefix}${product.imageUrl}`;
            return product;
          });
      },
      (error) => {
        console.error('Error fetching products: ', error);
      }
    );
  }

  buyProduct(productId: number): void {
    // Method to add a product to the cart
    if (this.elderlyId !== undefined) {
      this.productService.addProductToOrder(productId, this.elderlyId).subscribe(
        () => {
          console.log('Product added to order successfully');
        },
        (error) => {
          console.error('Error adding product to order: ', error);
        }
      );
    } else {
      console.error('Elderly ID is undefined');
    }
  }

  goToCart(): void {
    // Method to navigate to the cart
    if (this.elderlyId !== undefined) {
      this.router.navigate(['elderly', this.elderlyId, 'cart']);
    } else {
      console.error('Elderly ID is undefined');
    }
  }


  notifyMe(productId: number): void {
    if (this.elderlyId !== undefined) {
      this.productService.sendNotification(this.elderlyId, productId).subscribe(
        () => {
          console.log('Notification sent successfully');
          // Optionally, you can add logic here to update UI or show a confirmation message
        },
        (error) => {
          console.error('Error sending notification: ', error);
          // Optionally, handle error and show error message
        }
      );
    } else {
      console.error('Elderly ID is undefined');
    }
  }
  
  
  
  
}
