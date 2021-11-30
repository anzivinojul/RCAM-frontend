import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    protected http: HttpClient,
  ) { }

  uploadImage(name: string, file: File) {

    let formData = new FormData();
    formData.append('name', name);
    formData.append('image', file);


    return this.http.post(`${environment.apiURL}/image/`, formData);
  }
}
