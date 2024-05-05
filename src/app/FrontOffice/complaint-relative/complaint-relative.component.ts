import { Component } from '@angular/core';
import { ComplaintService } from '../Auth+shop/Services/complaint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmotionDetectionService } from '../Auth+shop/Services/emotion-detection.service';
import { FileService } from '../Auth+shop/Services/file.service';
import { ChatbotService } from '../Auth+shop/Services/chatbot.service';
import { Complaint } from '../Auth+shop/Model/Complaint';
import { Observable } from 'rxjs';
import axios from 'axios';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-complaint-relative',
  templateUrl: './complaint-relative.component.html',
  styleUrls: ['./complaint-relative.component.css']
})
export class ComplaintRelativeComponent {
  id: number;
  complaints$: Observable<any>;
  relativeId: number;
  emotionResult: any;
  voiceText: string = '';
  savedEmotionResult: any;
  doctorEmail: string = '';
  elderlyEmail: string;
  selectedFiles: FileList;
  sendTo: string; 
  badWordsList: string[] = ['Fuck', 'Bitch', 'Shit','shit'];
  ////////////////////////////////////////////////////////////
  translatedText: string = ''; // Variable pour stocker le texte traduit

  chatbotResponse: any;

  complaint: Complaint = {
    type: '',
    category: '',
    priority: '',
    description: '',
    archived: false,
    currentDate: new Date(),
    creationDate: new Date(),
    emotionText: '',
    attachments: [] ,
    doctorNotes:''




  };
currentDate: Date;


  constructor(private complaintService: ComplaintService, 
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private emotionService: EmotionDetectionService,
    private fileService: FileService,
    private chatbotService: ChatbotService

    ) {}
  
  
    openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['larger-snackbar'] // Ajouter une classe CSS personnalisée pour le Snackbar
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.currentDate = new Date();

      this.complaint.creationDate = new Date(); // Assignation de la date actuelle à creationDate
    this.complaintService.getElderlyEmailByRelativeId(this.id).subscribe(
      (email: string) => {
        this.elderlyEmail = email;
        console.log('Elderly Email:', this.elderlyEmail);
      this.getDoctorEmailForElderly(this.elderlyEmail);
    },
    (error) => {
      console.error('Error fetching elderly email:', error);
    }
  );
});

  const savedEmotionResult = JSON.parse(localStorage.getItem('emotionResult'));

  // Vérifier si des résultats sont enregistrés
  if (savedEmotionResult) {
    console.log('Detection result added  :', savedEmotionResult);
  } else {
    console.log('Aucun résultat de détection d\'émotion enregistré.');
  }
}



    



  submitComplaint(): void {
    const currentDate = new Date();
    console.log('Current Date:', currentDate);

    this.complaint.creationDate = currentDate;
    console.log('Creation Date:', this.complaint.creationDate);

 const containsBadWord: boolean = this.checkForBadWords(this.complaint.description);
    
    if (containsBadWord) {
        this.openSnackBar('Description contains bad words. Please revise your complaint.', 'Close');
        return;
    }

    this.complaintService.createComplaintForRelative(this.id, this.complaint)
      .subscribe(() => {
        this.complaint = {
          type: '',
          category: '',
          priority: '',
          description: '',
          archived: false,
          currentDate: new Date(),
          creationDate: new Date() ,
          emotionText: '',
          attachments: [] ,
          doctorNotes:''




        };
      this._snackBar.open('Complaint added successfully', 'Close', {
        duration: 2000, // Durée d'affichage du message en ms (2 secondes dans cet exemple)
      });
     localStorage.setItem('emotionResult', JSON.stringify(this.emotionResult));
     console.log('Emotion detection result saved:', this.emotionResult);
 
      });
  if (this.selectedFiles && this.selectedFiles.length > 0) {
    const filesArray: File[] = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      filesArray.push(this.selectedFiles[i]);
      this.complaint.attachments.push(this.selectedFiles[i]);
    }
    this.fileService.setFiles(filesArray);
    console.log('Files added:', filesArray); 
  }

  }


  
  complaints: Complaint[] = []; 


 
  loadComplaints(): void {
    this.complaintService.getAllComplaints().subscribe(complaints => {
      this.complaints = complaints;
    });
  }
  createComplaintForRelative( relativeId: number, complaint: Complaint): void {
    this.complaintService.createComplaintForRelative( relativeId, complaint).subscribe(() => {
      // Réclamations créées avec succès, rechargez la liste des réclamations
      this.loadComplaints();
      
    });
  }
  
  viewUserComplaints(): void {
    this.router.navigate(['/ComplaintRelativeList', this.id]); // Naviguez vers la route 'user-complaints' avec l'ID en tant que paramètre
}
detectEmotion(): void {
  // Utilisez le contenu du champ de description comme texte d'entrée
  const text = this.complaint.description;

  // Appelez le service de détection des émotions avec le texte d'entrée
  this.emotionService.detectEmotion(text)
      .subscribe(
          (data) => {
              this.emotionResult = data;
              console.log('Emotion detection result:', this.emotionResult);
          },
          (error) => {
              console.error('Error detecting emotion:', error);
          }
      );
}

recordVoice(): void {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = (event: any) => {
    this.voiceText = event.results[0][0].transcript;
    console.log('Voice text:', this.voiceText);
    this.complaint.description = this.voiceText;
  };

  recognition.onerror = (event: any) => {
    console.error('Error recording voice:', event.error);
  };
}

getDoctorEmailForElderly(elderlyEmail: string): void {
  this.complaintService.getDoctorEmailByElderlyEmail(elderlyEmail)
    .subscribe(
      (doctorEmail: string) => {
        this.doctorEmail = doctorEmail;
        console.log('Doctor Email:', this.doctorEmail);
      },
      (error) => {
        console.error('Error fetching doctor email:', error);
      }
    );
}
onFileSelected(event): void {
  this.selectedFiles = event.target.files;
}
checkForBadWords(description: string): boolean {
  const lowerCaseDescription: string = description.toLowerCase();

  // Vérifiez chaque mot interdit dans la description
  for (const badWord of this.badWordsList) {
      if (lowerCaseDescription.includes(badWord)) {
          return true;
      }
  }

  return false;
}

async translateText(textToTranslate: string) {
  const options = {
    method: 'POST',
    url: 'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'e7331bbdf7msh61a194843086330p12bdd5jsn84f38a230206',
      'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
    },
    data: {
      from: 'en',
      to: 'fr',
      q: textToTranslate
    }
  };

  try {
    const response = await axios.request(options);
    this.translatedText = response.data; // Mettre à jour la variable avec le texte traduit
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
translateDescription(): void {
  // Appeler la méthode pour traduire le contenu de la description
  this.translateText(this.complaint.description);
}

startChat(): void {
  this.chatbotService.askQuestion('Bonjour Chatbot!').subscribe(response => {
    console.log(response);
  }, error => {
    console.error(error);
  });
}
onStartChatClick() {
  this.router.navigate(['/chatbot']); 
}
}