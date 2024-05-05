import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmotionDetectionService {

  private apiUrl = 'https://api.meaningcloud.com/sentiment-2.1'; // Remplacez par l'URL de l'API de MeaningCloud

  constructor(private http: HttpClient) { }

  detectEmotion(text: string): Observable<any> {
    const apiKey = '8bf03d88ffbdec0303a391809d935f1a'; // Remplacez par votre clé API MeaningCloud
    const url = `${this.apiUrl}?key=${apiKey}&lang=en&txt=${encodeURIComponent(text)}`;
    return this.http.get<any>(url);
  }
/*detectEmotion(text: string): Observable<any> {
  // Implémentez votre logique de détection d'émotion ici
  // Ceci est un exemple simplifié et ne fournit pas une détection d'émotion précise
  const detectedEmotion = this.detectEmotionLocally(text);
  return of(detectedEmotion);
}
/*
private detectEmotionLocally(text: string): string {
  // Exemple de logique de détection d'émotion locale (à remplacer par une logique plus sophistiquée)
  const positiveWords = ['happy', 'joyful', 'excited','like','good'];
  const negativeWords = ['sad', 'angry', 'frustrated','hate','not','not good'];

  const words = text.toLowerCase().split(' ');
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) {
      positiveCount++;
    } else if (negativeWords.includes(word)) {
      negativeCount++;
    }
  });

  if (positiveCount > negativeCount) {
    return 'Positive';
  } else if (negativeCount > positiveCount) {
    return 'Negative';
  } else {
    return 'Neutral';
  }
}*/


  // Méthode pour sauvegarder les résultats de détection d'émotion dans le stockage local
  saveEmotionResult(emotionResult: any): void {
    localStorage.setItem('emotionResult', JSON.stringify(emotionResult));
  }

  // Méthode pour récupérer les résultats de détection d'émotion depuis le stockage local
  getSavedEmotionResult(): any {
    const savedEmotionResult = JSON.parse(localStorage.getItem('emotionResult'));
    return savedEmotionResult;
  }
}