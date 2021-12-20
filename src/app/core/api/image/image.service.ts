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

  uploadImage(name: string, file: any) {

    let formData = new FormData();
    formData.append('name', name);
    formData.append('image', file);

    return this.http.post(`${environment.apiURL}/image/add`, formData);
  }

  deleteImage(imagePK: number) {

    return this.http.delete(`${environment.apiURL}/image/delete/` + imagePK);

  }
}
