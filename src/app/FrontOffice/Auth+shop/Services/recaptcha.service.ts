import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable , map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

 
  private generateUrl = 'https://captcha-generator.p.rapidapi.com/';
  generatedCaptcha: string = ''; // Déclaration de la propriété generatedCaptcha

  constructor(private http: HttpClient) { }

  generateCaptcha(): Observable<any> {
    const options = {
      headers: {
        'X-RapidAPI-Key': 'e7331bbdf7msh61a194843086330p12bdd5jsn84f38a230206',
        'X-RapidAPI-Host': 'captcha-generator.p.rapidapi.com'
      }
    };

    return this.http.get(this.generateUrl, options)
      .pipe(
        map((response: any) => {
          this.generatedCaptcha = response.solution; // Mettre à jour generatedCaptcha avec la solution du captcha généré
          return response;
        })
      );
  }

  // Méthode pour vérifier le captcha
  verifyCaptcha(captchaCode: string): Observable<boolean> {
    // Comparer le code captcha saisi avec le code de solution du captcha généré précédemment
    const verificationResult = captchaCode === this.generatedCaptcha;
    return new Observable<boolean>(observer => {
      observer.next(verificationResult); // Renvoyer le résultat de la vérification
      observer.complete();
    });
  }
}