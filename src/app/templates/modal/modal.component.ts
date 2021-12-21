import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";
export interface ConfirmModel {
  title:string;
  message:string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent extends SimpleModalComponent<ConfirmModel, boolean> implements OnInit, ConfirmModel {

  title!: string;
  message!: string;

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.title = 'Confirmation de la suppression de la recette';
    this.message = 'Voulez-vous vraiment supprimer la recette ?';
  }

  confirm() {
    this.result = true;
    this.close();
  }

}
