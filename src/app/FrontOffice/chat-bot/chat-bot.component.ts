import { Component } from '@angular/core';
import { ChatbotService } from '../Auth+shop/Services/chatbot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
// messages: { sender: string, content: string }[] = [];
userInput: string = '';
messages: { sender: string; content: string; time: Date; }[] = [];
isBotTyping: boolean = false; // Variable de chargement pour le chatbot
typingTimer: any; // Timer pour déterminer quand l'utilisateur a fini de taper

constructor(private chatbotService: ChatbotService) {}
ngOnInit(): void {
  // Ajouter le message initial dans le tableau messages avec l'heure actuelle
  this.messages.push({ content: "Hello, how can I help you today?", sender: 'bot', time: new Date() });
}

sendMessage() {
  const userMessage = this.userInput.trim();
  if (userMessage === '') return;

  // Ajouter le message de l'utilisateur à la liste des messages avec l'heure actuelle
  this.messages.push({ sender: 'user', content: userMessage, time: new Date() });

  // Effacer le champ de saisie après l'envoi du message
  this.userInput = '';

  // Envoyer la question au chatbot et afficher la réponse
  this.isBotTyping = true;
  this.chatbotService.askQuestion(userMessage).subscribe(
    response => {
      const chatbotResponse = response?.response || 'Désolé, je n\'ai pas compris.';
      setTimeout(() => { // Ajouter un délai pour simuler la pensée du chatbot
        this.messages.push({ sender: 'bot', content: chatbotResponse, time: new Date() });
        this.isBotTyping = false;
      }, 1000); // Simule une réponse après 1 seconde
    },
    error => {
      console.error('Une erreur s\'est produite lors de la communication avec le chatbot :', error);
      setTimeout(() => { // Ajouter un délai pour simuler la pensée du chatbot
        this.messages.push({ sender: 'bot', content: 'Une erreur s\'est produite. Veuillez réessayer.', time: new Date() });
        this.isBotTyping = false;
      }, 1000); // Simule une réponse après 1 seconde
    }
  );
}

// Gérer les frappes de l'utilisateur dans le champ de saisie
handleUserTyping() {
  // Réinitialiser le timer à chaque frappe de l'utilisateur
  clearTimeout(this.typingTimer);
  // Activer la variable de chargement pour simuler la saisie de l'utilisateur
  this.isBotTyping = true;
  // Démarrer le timer pour détecter quand l'utilisateur a fini de taper
  this.typingTimer = setTimeout(() => {
    this.isBotTyping = false;
  }, 1000); // Simule la fin de la saisie après 1 seconde d'inactivité
}
}
