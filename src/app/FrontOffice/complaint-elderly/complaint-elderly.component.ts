import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmotionDetectionService } from '../Auth+shop/Services/emotion-detection.service';
import { ChatbotService } from '../Auth+shop/Services/chatbot.service';
import { FileService } from '../Auth+shop/Services/file.service';
import { ComplaintService } from '../Auth+shop/Services/complaint.service';
import axios from 'axios';
import { Complaint } from '../Auth+shop/Model/Complaint';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-complaint-elderly',
  templateUrl: './complaint-elderly.component.html',
  styleUrls: ['./complaint-elderly.component.css']
})
export class ComplaintElderlyComponent {
  id: number;
  complaints$: Observable<any>;
  elderlyId: number;
  emotionResult: any;
  voiceText: string = '';
  savedEmotionResult: any;
  selectedFiles: FileList;
  ////////////////////////////////////////////////////////////
  translatedText: string = ''; // Variable pour stocker le texte traduit

  chatbotResponse: any;
  badWordsList: string[] = ['Fuck', 'Bitch', 'Shit','shit'];



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
    private fileService: FileService,
    private emotionService: EmotionDetectionService,
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
      this.complaint.creationDate = new Date(); 


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
    this.complaintService.createComplaintForElderly(this.id, this.complaint)
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
         // Afficher le message de notification
      this._snackBar.open('Complaint added successfully', 'Close', {
        duration: 2000, // Durée d'affichage du message en ms (2 secondes dans cet exemple)
      });
     // Enregistrer les résultats de détection d'émotion dans le stockage local
     localStorage.setItem('emotionResult', JSON.stringify(this.emotionResult));
     console.log('Emotion detection result saved:', this.emotionResult);
 
      });
      // Ensuite, téléchargez les fichiers sélectionnés (s'ils existent)
      // Enregistrez les fichiers ajoutés dans le service FileService
  if (this.selectedFiles && this.selectedFiles.length > 0) {
    const filesArray: File[] = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      filesArray.push(this.selectedFiles[i]);
      this.complaint.attachments.push(this.selectedFiles[i]);
    }
    this.fileService.setFiles(filesArray);
    console.log('Files added:', filesArray); // Ajoutez une console pour vérifier les fichiers ajoutés
  }

  }
  
  
  complaints: Complaint[] = []; 


 
  loadComplaints(): void {
    this.complaintService.getAllComplaints().subscribe(complaints => {
      this.complaints = complaints;
    });
  }
  createComplaintForElderly( elderlyId: number, complaint: Complaint): void {
    this.complaintService.createComplaintForElderly( elderlyId, complaint).subscribe(() => {
      // Réclamations créées avec succès, rechargez la liste des réclamations
      this.loadComplaints();
      
    });
  }
  
  viewUserComplaints(): void {
    this.router.navigate(['/user-complaints', this.id]); // Naviguez vers la route 'user-complaints' avec l'ID en tant que paramètre
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
              // Traitez la réponse ici selon vos besoins
          },
          (error) => {
              console.error('Error detecting emotion:', error);
              // Gérez les erreurs ici
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
    // Affectez la valeur de voiceText à la description de la plainte
    this.complaint.description = this.voiceText;
  };

  recognition.onerror = (event: any) => {
    console.error('Error recording voice:', event.error);
  };
}
onFileSelected(event): void {
  this.selectedFiles = event.target.files;
}

checkForBadWords(description: string): boolean {
  // Convertissez la description en minuscules pour une correspondance insensible à la casse
  const lowerCaseDescription: string = description.toLowerCase();

  // Vérifiez chaque mot interdit dans la description
  for (const badWord of this.badWordsList) {
      if (lowerCaseDescription.includes(badWord)) {
          // Si un mot interdit est trouvé, retournez true
          return true;
      }
  }

  // Si aucun mot interdit n'est trouvé, retournez false
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
  // Par exemple, vous pouvez appeler la fonction askQuestion du service ChatbotService
  this.chatbotService.askQuestion('Bonjour Chatbot!').subscribe(response => {
    console.log(response);
    // Traitez la réponse ici
  }, error => {
    console.error(error);
    // Gérez les erreurs ici
  });
}
onStartChatClick() {
  this.router.navigate(['/chatbot']); // Naviguer vers la route du composant ChatComponent
}
}
