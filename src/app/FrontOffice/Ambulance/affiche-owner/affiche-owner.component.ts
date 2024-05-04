import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from '../ServiceA/web-socket.service';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';


interface Ambulance {
  ambulanceID?: number;
  location: string;
  status: string;
  latitude?: number;
  longitude?: number;
  imageAmbul?: string;
}

@Component({
  selector: 'app-affiche-owner',
  templateUrl: './affiche-owner.component.html',
  styleUrls: ['./affiche-owner.component.css']
})
export class AfficheOwnerComponent implements AfterViewInit, OnDestroy {
  availableCount: number = 0;
  notAvailableCount: number = 0;
  @ViewChild('myChart') myChart!: ElementRef;
  notifications: any[] = [];
  ambulance: Ambulance | null = null;
  private subscription: Subscription;
  imageBaseUrl: string = 'http://localhost:80/nadhirPI/';
  ambulances: Ambulance[] = [];
  shortestDistance: number | null = null; // Déclaration de shortestDistance

  constructor(private http: HttpClient, private webSocketService: WebSocketService, private route: ActivatedRoute,private router: Router) {
   
  
  }
 
  choisirAmbulance(ambulanceId: number) {
    this.router.navigate(['/driv', ambulanceId]);
  }
  ngOnInit(): void {
    // Récupérer le paramètre d'URL 'distance'
    this.route.queryParams.subscribe(params => {
      const shortestDistance = +params['distance'];
      console.log('Valeur de distance:', params['distance']);
      if (!isNaN(shortestDistance)) {
        console.log('Distance la plus courte:', shortestDistance);
        // Utilisez la distance la plus courte comme nécessaire dans votre composant
      } else {
        console.error('La distance la plus courte n\'est pas un nombre valide.');
      }
    });
  }



  
  
  ngAfterViewInit(): void {
    this.getAmbulances();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  

  getAmbulances(): void {
    this.http.get<Ambulance[]>('http://localhost:8081/ambulance/affiche')
      .subscribe(data => {
        this.availableCount = data.filter(ambulance => ambulance.status === 'Available').length;
        this.notAvailableCount = data.filter(ambulance => ambulance.status === 'NotAvailable').length;
        this.ambulance = data[0]; // Utilisez le premier élément du tableau pour l'ambulance
        this.renderChart();
        this.ambulances = data;
      });
  }

  renderChart(): void {
    const canvas = this.myChart.nativeElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Disponible', 'Non disponible'],
        datasets: [{
          label: 'Nombre d\'ambulances',
          data: [this.availableCount, this.notAvailableCount],
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  
}
