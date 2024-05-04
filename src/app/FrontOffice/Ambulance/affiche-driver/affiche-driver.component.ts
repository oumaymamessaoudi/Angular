import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmbulanceDriver } from 'src/app/FrontOffice/Ambulance/Model/Driver';
import { DriverService } from '../ServiceA/driver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-affiche-driver',
  templateUrl: './affiche-driver.component.html',
  styleUrls: ['./affiche-driver.component.css']
})
export class AfficheDriverComponent implements OnInit, OnDestroy {
  ambulanceDrivers: AmbulanceDriver[] = [];
  totalSalary: number = 0;
  private clockInterval: any;
  private ambulanceId: number;
  constructor(
    private ambulanceDriverService: DriverService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAmbulanceDrivers();
    const currentUrl = this.router.url; // Get the current URL
    const urlParts = currentUrl.split('/'); // Split the URL by '/'
     this.ambulanceId = parseInt(urlParts[urlParts.length - 1], 10);
 
  }

  ngOnDestroy(): void {
    clearInterval(this.clockInterval);
  }

  getAmbulanceDrivers(): void {
    this.ambulanceDriverService.getAmbulanceDrivers()
      .subscribe(ambulanceDrivers => this.ambulanceDrivers = ambulanceDrivers);
  }

  startWork(driver: AmbulanceDriver): void {
    if (!driver.startTime) {
      driver.startTime = new Date();
      driver.working = true;
      driver.endTime = null;
      driver.salary = 0;
    }
    this.clockInterval = setInterval(() => {
      this.calculateSalary(driver);
    }, 1000);
  }

  stopWork(driver: AmbulanceDriver): void {
    if (driver.startTime) {
      driver.endTime = new Date();
      clearInterval(this.clockInterval);
      this.calculateSalary(driver);
      this.totalSalary += driver.salary;
    }
  }

  calculateSalary(driver: AmbulanceDriver): void {
    if (driver.startTime) {
      const endTime = driver.endTime ? driver.endTime : new Date();
      const millisecondsWorked = endTime.getTime() - driver.startTime.getTime();
      const hoursWorked = millisecondsWorked / (1000 * 60 * 60);
      driver.workingHours = Number(hoursWorked.toFixed(4));
      driver.salary = Number((hoursWorked * 30).toFixed(4));
      driver.totalForDriver = Number(driver.salary.toFixed(4));
    }
  }

  calculateAndSetTotalSalary(driver: AmbulanceDriver): void {
    const driverId = driver.ambulanceDriverID;
    const total = driver.totalForDriver; // Assurez-vous que total est de type number ou float
    const port = '8081';
    this.http.post<void>(`http://localhost:${port}/ambulance/${driverId}/total-for-driver`, total)
      .subscribe(() => {
        console.log('Salaire ajouté avec succès au conducteur');
        // Ajoutez ici toute logique supplémentaire nécessaire, comme le rechargement des données.
      }, error => {
        console.error('Erreur lors de l\'ajout du salaire au conducteur:', error);
      });
  }
  
  
  assignAmbulance(driver: AmbulanceDriver): void {
    if (!this.ambulanceId) {
      console.error('ID de l\'ambulance introuvable dans l\'URL');
      return;
    }
    const ambulanceDriverID = driver.ambulanceDriverID;
    const port = '8081'; // Spécifiez le port à utiliser
    // Faites la requête POST vers l'API
    this.http.post<void>(`http://localhost:${port}/ambulance/ambulance/${this.ambulanceId}/driver/${ambulanceDriverID}`, {})
      .subscribe(() => {
        console.log('Ambulance affectée avec succès au conducteur');
        // Ajoutez ici toute logique supplémentaire nécessaire, comme le rechargement des données.
      }, error => {
        console.error('Erreur lors de l\'affectation de l\'ambulance au conducteur:', error);
      });
  }
}