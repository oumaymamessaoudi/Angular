import { Component } from '@angular/core';
import { NewsService } from '../Auth+shop/Services/news.service';
import { HttpClient } from '@angular/common/http';
import { NewsData } from './NewsData';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
//newsData: any[] = [];
newsData: NewsData[]; // Utilisez l'interface comme type

constructor(private newsService: NewsService,
  private http: HttpClient
) {}

ngOnInit(): void {
  this.getNewsData();
}

getNewsData() {
  this.newsService.getNews('Health', 'US', 'en').subscribe(
    (response) => {
      this.newsData = response.data; // Assurez-vous que response est de type correct
      this.logImageURLs(); // Appel de la fonction pour afficher les URL des images

    },
    (error) => {
      console.error(error);
    }
  );
}
logImageURLs() {
  if (this.newsData && this.newsData.length > 0) {
    this.newsData.forEach(article => {
      if (article.photo_url) {
        console.log('Image URL:', article.photo_url);
      } else {
        console.log('Aucune URL d\'image trouvée pour cet article');
      }
    });
  } else {
    console.log('Aucune donnée de nouvelles disponible');
  }
}
getImage(url: string) {
  const options: { responseType: 'blob'; observe: 'response'; withCredentials: true; } = {
    responseType: 'blob',
    observe: 'response',
    withCredentials: true
  };

  return this.http.get(url, options);
}
}  
