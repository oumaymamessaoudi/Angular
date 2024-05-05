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
  selector: 'app-complaint-relative-list-front',
  templateUrl: './complaint-relative-list-front.component.html',
  styleUrls: ['./complaint-relative-list-front.component.css']
})
export class ComplaintRelativeListFrontComponent {
  complaints$: Observable<any>;
  relativeId: number;
  isDeleted: boolean = false; // Variable pour suivre l'état de la suppression
  p: number = 1; // Initialiser la page à 1
  itemsPerPage: number = 4; // Nombre d'éléments à afficher par page
  page: number = 1;
  emotionResult: any;
  emotionResults: { [key: number]: any } = {};
  files: File[] = [];
  files$: Observable<File[]>;

  notes: { [key: number]: string } = {};
  treatmentDate: string | null = null;

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
    this.route.paramMap.subscribe(params => {
      this.relativeId = +params.get('id');
      this.getComplaintsByRelativeId(this.relativeId);
    });
  const treatmentDate = localStorage.getItem('treatmentDate');
  console.log('Treatment date retrieved:', treatmentDate);
    this.files$ = this.fileService.getFiles();

  }

  getComplaintsByRelativeId(relativeId: number): void {
    this.treatmentDate = localStorage.getItem('treatmentDate');

    // Appeler l'API pour récupérer les plaintes de la personne âgée
    this.complaints$ = this.http.get(`${this.apiUrl}/relative/${relativeId}`);
    this.complaints$.subscribe(complaints => {
      complaints.forEach(complaint => {
// Attribuer la date de traitement à chaque plainte
complaint.treatmentDate = this.treatmentDate;
        this.emotionService.detectEmotion(complaint.description).subscribe(
          (data) => {
            this.emotionResults[complaint.complaintID] = data;
          },
          (error) => {
            console.error('Error detecting emotion:', error);
          }
        );
        // Get doctor notes for each complaint
        this.complaintService.getNotesForComplaint(complaint.complaintID).subscribe(
          (notes) => {
            this.notes[complaint.complaintID] = notes;
          },
          (error) => {
            console.error('Error getting doctor notes:', error);
          }
        );
      });
    });
    this.fileService.files$.subscribe(files => {
      this.files = files;
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
        this.getComplaintsByRelativeId(this.relativeId);
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
    
    return `path/to/files/${file.name}`;
  }

  updateComplaint(complaint: Complaint, complaintID: number): void {
    if (!complaint || !complaintID) {
      console.error('Invalid or missing complaint ID');
      return;
    }
    console.log('complaint:', complaint);
    this.complaintService.updateComplaint(complaintID, this.relativeId, complaint).subscribe(
      () => {
        console.log('Complaint updated successfully');
        this.getComplaintsByRelativeId(this.relativeId);
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
    this.router.navigate(['/update-complaint', complaintId]);
  }

}

