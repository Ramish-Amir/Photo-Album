import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  photos;
  currentAlbumId;
  urlPattern = '[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?';
  isOpenAddContainer = false;
  isSuccessfullyAdded = false;
  isOpenEditContainer = false;
  isSuccessfullyEdited = false;
  currentlyDeletedPhotoId;

  addPhotoForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required, Validators.pattern(this.urlPattern)])
  });

  editPhotoForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required, Validators.pattern(this.urlPattern)]),
    id: new FormControl()
  });

  goBack(): void {
    this.location.back();
  }

  openAddPhoto(): void {
    this.isOpenAddContainer = true;
  }

  closeAddPhoto(): void {
    this.isOpenAddContainer = false;
    this.addPhotoForm.reset();
    this.isSuccessfullyAdded = false;
  }

  addPhoto(): void {
    this.http.post('https://jsonplaceholder.typicode.com/photos', this.addPhotoForm.getRawValue())
      .subscribe(
        (response) => {
          console.log(response);
          this.isSuccessfullyAdded = true;
          this.addPhotoForm.reset();
          setTimeout(() => {
            this.isSuccessfullyAdded = false;
          }, 2000);
        },
        error => {
          alert(error.message);
        }
      );
  }

  openEditPhoto(photoTitle, photoUrl, photoId): void {
    this.isOpenEditContainer = true;
    this.editPhotoForm.setValue({
      title: photoTitle,
      url: photoUrl,
      id: photoId
    });
  }

  closeEditPhoto(): void {
    this.isOpenEditContainer = false;
    this.isSuccessfullyEdited = false;
    this.editPhotoForm.reset();
  }

  editPhoto(): void {
    this.http.patch('https://jsonplaceholder.typicode.com/photos/' + this.editPhotoForm.getRawValue().id, this.editPhotoForm.getRawValue())
      .subscribe(
        () => {
          this.isSuccessfullyEdited = true;
          setTimeout(() => {
            this.isSuccessfullyEdited = false;
            this.isOpenEditContainer = false;
          }, 2000);
        },
        error => {
          alert(error.message);
        }
      );
  }

  deletePhoto(photoId): void {
    this.http.delete('https://jsonplaceholder.typicode.com/photos/' + photoId)
      .subscribe(
        () => {
          this.currentlyDeletedPhotoId = photoId;
        },
        error => {
          alert(error.message);
        }
      );
  }

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location) {
  }

  ngOnInit(): void {
    this.currentAlbumId = Number(this.route.snapshot.paramMap.get('albumID'));
    this.http.get('https://jsonplaceholder.typicode.com/photos')
      .subscribe(
        response => {
          this.photos = response;
        },
        (error) => {
          alert(error.message);
        }
      );
  }

}
