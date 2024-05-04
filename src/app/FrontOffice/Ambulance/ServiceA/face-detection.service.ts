import { Injectable } from '@angular/core';
import * as cv from 'opencv.js';
declare var cv: any; // Déclarer OpenCV.js

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {

  async detectEyes(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const videoElement = document.createElement('video');
        document.body.appendChild(videoElement);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        await videoElement.play();

        const src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
        const gray = new cv.Mat();
        const faceCascade = new cv.CascadeClassifier();
        const eyeCascade = new cv.CascadeClassifier();

        // Chargez les classificateurs en cascade
        faceCascade.load('haarcascade_frontalface_default.xml');
        eyeCascade.load('haarcascade_eye.xml');

        let eyesClosed = false;

        const frame = () => {
          const cap = new cv.VideoCapture(videoElement);
          cap.read(src);

          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
          const faces = new cv.RectVector();
          const eyes = new cv.RectVector();

          // Détection des visages
          faceCascade.detectMultiScale(gray, faces);

          for (let i = 0; i < faces.size(); i++) {
            const faceRect = faces.get(i);
            const faceGray = gray.roi(faceRect);

            // Détection des yeux dans chaque visage détecté
            eyeCascade.detectMultiScale(faceGray, eyes);

            for (let j = 0; j < eyes.size(); j++) {
              const eyeRect = eyes.get(j);
              // Vous pouvez ajouter des conditions pour déterminer si les yeux sont fermés
              // Par exemple, si la hauteur de l'œil est inférieure à un certain seuil, considérez-le comme fermé
              if (eyeRect.height < 20) {
                eyesClosed = true;
              } else {
                eyesClosed = false;
              }
            }
            faceGray.delete();
          }

          faces.delete();
          eyes.delete();
          src.delete();
          gray.delete();

          requestAnimationFrame(frame);
        };

        frame();

        // Vous pouvez arrêter la détection en appelant une fonction ou en utilisant un drapeau booléen

      } catch (error) {
        reject(error);
      }
    });
  }

  async captureAndCheckEyesAdvanced(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        // Capture de l'image depuis la caméra
        const videoElement = document.createElement('video');
        document.body.appendChild(videoElement);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        await videoElement.play();
  
        // Attendre que le flux vidéo soit stable
        await new Promise(resolve => setTimeout(resolve, 2000));
  
        // Création d'un canvas pour dessiner l'image capturée
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
  
        // Dessiner l'image capturée sur le canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
        // Convertir l'image du canvas en image OpenCV
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const src = cv.matFromImageData(imgData);
        const gray = new cv.Mat();
        const eyeCascade = new cv.CascadeClassifier();
        eyeCascade.load('haarcascade_eye.xml');
  
        // Convertir l'image en niveau de gris pour une meilleure détection
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  
        // Détection des yeux dans l'image en niveaux de gris
        const eyes = new cv.RectVector();
        eyeCascade.detectMultiScale(gray, eyes);
  
        // Dessiner des rectangles rouges autour des yeux détectés
        const eyeColor = new cv.Scalar(255, 0, 0, 255); // Couleur rouge
        for (let i = 0; i < eyes.size(); ++i) {
          const eyeRect = eyes.get(i);
          const point1 = new cv.Point(eyeRect.x, eyeRect.y);
          const point2 = new cv.Point(eyeRect.x + eyeRect.width, eyeRect.y + eyeRect.height);
          cv.rectangle(src, point1, point2, eyeColor, 2);
        }
  
        // Affichage de l'image avec les rectangles dessinés (pour débogage)
        cv.imshow('canvasOutput', src);
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
  
        // Si au moins un œil est détecté, considérez que les yeux sont ouverts
        const eyesDetected = eyes.size() > 0;
  
        // Nettoyage des ressources
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.remove();
        canvas.remove();
        src.delete();
        gray.delete();
        eyes.delete();
  
        resolve(!eyesDetected); // Renvoyer true si aucun œil n'est détecté (yeux fermés)
      } catch (error) {
        reject(error);
      }
    });
  }
}  