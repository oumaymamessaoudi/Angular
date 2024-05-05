import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComplaintService } from '../Auth+shop/Services/complaint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmotionDetectionService } from '../Auth+shop/Services/emotion-detection.service';
import { FileService } from '../Auth+shop/Services/file.service';
import { Complaint } from '../Auth+shop/Model/Complaint';

@Component({
  selector: 'app-user-complaint',
  templateUrl: './user-complaint.component.html',
  styleUrls: ['./user-complaint.component.css']
})
export class UserComplaintComponent {
  complaints$: Observable<any>;
  elderlyId: number;
  isDeleted: boolean = false; // Variable pour suivre l'état de la suppression
  p: number = 1; // Initialiser la page à 1
  itemsPerPage: number = 4; // Nombre d'éléments à afficher par page
  page: number = 1;
  emotionResult: any;
  emotionResults: { [key: number]: any } = {};
  files: File[] = [];
  files$: Observable<File[]>;


  constructor(private http: HttpClient, 
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private _snackBar: MatSnackBar,
    private emotionService: EmotionDetectionService,
    private fileService: FileService,
    private router: Router
   ) { }
  
  
    private apiUrl = 'http://localhost:8081/api/complaints';

  ngOnInit(): void {
    // Récupérer l'identifiant de la personne âgée à partir de l'URL
    this.route.paramMap.subscribe(params => {
      this.elderlyId = +params.get('id');
      // Appeler la méthode pour récupérer les plaintes de la personne âgée
      this.getComplaintsByElderlyId(this.elderlyId);
    });
    this.files$ = this.fileService.getFiles();

  }

  getComplaintsByElderlyId(elderlyId: number): void {
    // Appeler l'API pour récupérer les plaintes de la personne âgée
    this.complaints$ = this.http.get(`${this.apiUrl}/elderly/${elderlyId}`);
    this.complaints$.subscribe(complaints => {
      complaints.forEach(complaint => {
        this.emotionService.detectEmotion(complaint.description).subscribe(
          (data) => {
            this.emotionResults[complaint.complaintID] = data;
          },
          (error) => {
            console.error('Error detecting emotion:', error);
          }
        );
      });
    });
  }
  
  deleteComplaint(id: number): void {
    if (!id) {
      console.error('Invalid complaint ID');
      return;
    }
    this.complaintService.deleteComplaint(id).subscribe(
      () => {
        console.log('Complaint deleted successfully');
        // Mettre à jour la liste des plaintes après la suppression
        this.getComplaintsByElderlyId(this.elderlyId);
        // Afficher le message de suppression avec MatSnackBar
        this._snackBar.open('Complaint deleted successfully', 'Close', {
          duration: 3000, // Durée d'affichage en millisecondes (3 secondes)
        });
      },
      error => {
        console.error('Error deleting complaint:', error);
      }
    );
  }
  getEmoji(scoreTag: string): string {
    switch (scoreTag) {
      case 'P':
        return 'Positive😊'; 
      case 'N':
        return 'Negative😞'; 
      case 'Neutral':
        return '😐'; 
      default:
        return '';
    }
  }
  getFileUrl(file: File): string {
    // Remplacez cette logique par la génération de l'URL du fichier
    // Retournez une URL relative ou absolue en fonction de votre cas d'utilisation
    return `path/to/files/${file.name}`;
  }
  
  updateComplaint(complaint: Complaint, complaintID: number): void {
    if (!complaint || !complaintID) {
      console.error('Invalid or missing complaint ID');
      return;
    }
    console.log('complaint:', complaint);
    this.complaintService.updateComplaint(complaintID, this.elderlyId, complaint).subscribe(
      () => {
        console.log('Complaint updated successfully');
        this.getComplaintsByElderlyId(this.elderlyId);
        this._snackBar.open('Complaint updated successfully', 'Close', {
          duration: 3000,
        });
      },
      (error) => {
        console.error('Error updating complaint:', error);
      }
    );
  }

  navigateToUpdate(complaintId: number): void {
    this.router.navigate(['/update-complaintElderly', complaintId]);
  }
}

