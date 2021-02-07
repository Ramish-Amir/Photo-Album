import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  albums;

  showPhotos(albumId): void {
    this.router.navigate(['/photos', albumId]);
  }

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.http.get('https://jsonplaceholder.typicode.com/albums').subscribe(
      response => {
        this.albums = response;
      },
      error => {
        alert(error.message);
      }
    );
  }

}
