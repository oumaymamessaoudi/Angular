import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { Complaint } from '../Auth+shop/Model/Complaint';
import { AuthService } from '../Auth+shop/Services/AuthService';
import { ActivatedRoute } from '@angular/router';
import { ComplaintService } from '../Auth+shop/Services/complaint.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor-complaints',
  templateUrl: './doctor-complaints.component.html',
  styleUrls: ['./doctor-complaints.component.css']
})
export class DoctorComplaintsComponent {
  complaints: Complaint[] = [];
  doctorEmail: string;
  notes: string = '';
  complaintUpdated: EventEmitter<void> = new EventEmitter<void>();

  isFormVisible: { [key: string]: boolean } = {};
  private apiUrl = 'http://localhost:8081/api/complaints';

  formData: any = {}; // Déclaration de la propriété formData

  constructor(private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private _snackBar: MatSnackBar
   
    
  ) { }

  ngOnInit(): void {
    this.getDoctorEmailAndLoadComplaints();
  }

  getDoctorEmailAndLoadComplaints() {
    const doctorId = this.route.snapshot.params['id'];

    // Log pour vérifier si l'ID du médecin est récupéré correctement
    console.log('Doctor ID:', doctorId);

    // Utilisez le service AuthService pour obtenir l'e-mail du médecin en fonction de l'ID du médecin
    this.authService.getDoctorEmailById(doctorId).subscribe(
      (doctorEmail: string) => {
        this.doctorEmail = doctorEmail;

        // Log pour vérifier si l'e-mail du médecin est récupéré correctement
        console.log('Doctor Email:', this.doctorEmail);

        // Une fois que vous avez récupéré l'e-mail du médecin, chargez les plaintes associées à cet e-mail
        this.loadComplaintsByDoctorEmail();
      },
      (error: HttpErrorResponse) => {
        console.error('Error retrieving doctor email:', error);

        // Log pour afficher le contenu de la réponse HTTP en cas d'erreur
        console.log('Error response:', error.error);
        // Gérer l'erreur, par exemple, afficher un message d'erreur
      }
    );
  }

  loadComplaintsByDoctorEmail() {
    // Extraire l'e-mail de la propriété email de l'objet doctorEmail
    const doctorEmail = this.doctorEmail;
  
    // Utiliser encodeURIComponent pour s'assurer que l'e-mail est correctement encodé dans l'URL
    const encodedEmail = encodeURIComponent(doctorEmail);
  
    // Construire l'URL de la requête HTTP avec l'e-mail encodé
    const url = `http://localhost:8081/api/complaints?doctorEmail=${encodedEmail}`;
  
    this.http.get(url).subscribe(
      (complaints: Complaint[]) => {
        // Filtrer les plaintes non traitées
        const unprocessedComplaints = complaints.filter(complaint => !this.isComplaintProcessedLocally(complaint.complaintID));
        this.complaints = unprocessedComplaints;
      },
      (error) => {
        console.error('Error retrieving complaints:', error);
      }
    );
  }
 // Méthode pour afficher le formulaire lorsque le bouton "Traiter" est cliqué
 toggleForm(complaint: any) {
  // Utilisez l'ID de la plainte comme clé pour suivre la visibilité du formulaire
  this.isFormVisible[complaint.complaintID] = !this.isFormVisible[complaint.complaintID];
}
showForm(complaintId: string) {
  // Utilisez l'ID de la plainte comme clé pour suivre la visibilité du formulaire
  this.isFormVisible[complaintId] = true;
  console.log('Button clicked');
}
updateComplaint1(complaintId: number, notesObj: any,complaint: Complaint) {
  // Extraire la valeur de 'notes' de l'objet reçu
  const notes = notesObj && typeof notesObj === 'object' ? notesObj.notes : '';

  // Assurez-vous que notes est une chaîne de caractères non vide
  if (typeof notes !== 'string' || notes.trim() === '') {
    console.error('Notes must be a non-empty string.');
    return; // Arrêtez la fonction si notes n'est pas une chaîne de caractères ou si elle est vide
  }

  // Construire le corps de la requête avec les données mises à jour
  const updatedData = {
    
     notes: notes,
    description: complaint.description,
    type: complaint.type,
    category: complaint.category,
    priority:complaint.priority,
    doctorNotes: notes, // Mettez à jour la propriété doctorNotes avec les nouvelles notes

   };

  const url = `${this.apiUrl}/${complaintId}`;
  this.http.put(url, updatedData).subscribe(
    (response: any) => {
      console.log('Complaint updated successfully:', response);

      // Afficher un message indiquant que la plainte a été traitée avec succès
      this._snackBar.open('Complaint processed successfully', 'Close', {
        duration: 3000, // Durée d'affichage du message (en millisecondes)
      });

      this.storeProcessedComplaintId(complaintId);

      // Supprimer la plainte mise à jour de la liste des plaintes
      const index = this.complaints.findIndex(c => c.complaintID === complaintId);
      if (index !== -1) {
        this.complaints.splice(index, 1); // Supprimer la plainte de la liste
      }
    },    
    (error: HttpErrorResponse) => {
      console.error('Error updating complaint:', error);
      // Gérer les erreurs lors de la mise à jour de la plainte
    }
  );
  this.complaintUpdated.emit();

}
storeProcessedComplaintId(complaintId: number) {
  const processedComplaints = JSON.parse(localStorage.getItem('processedComplaints')) || [];
  processedComplaints.push(complaintId);
  localStorage.setItem('processedComplaints', JSON.stringify(processedComplaints));
}

isComplaintProcessedLocally(complaintId: number): boolean {
  const processedComplaints = JSON.parse(localStorage.getItem('processedComplaints')) || [];
  return processedComplaints.includes(complaintId);
}

}