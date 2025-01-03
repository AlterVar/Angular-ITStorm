import { Component, OnInit } from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CallbackService} from "../../services/callback.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  dialog: HTMLElement | null = null;
  dialogBtn: HTMLElement | null = null;
  requestIsSent: boolean = false;

  consultationForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
  })

  constructor(private _snackBar: MatSnackBar,
              private callbackService: CallbackService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dialog = document.getElementById('consultation-dialog');
    this.dialogBtn = document.getElementById('consultation-btn');
  }

  openDialog() {
    if (this.dialog) {
      this.dialog.style.display = 'flex';
    }
  }

  closeDialog(event: Event) {
    event.stopPropagation();
    this.requestIsSent = false;
    if (this.dialog && (event.target === event.currentTarget || event.currentTarget === this.dialogBtn)) {
      this.consultationForm.setValue({
        name: '',
        phone: ''
      })
      this.consultationForm.markAsUntouched();
      this.consultationForm.markAsPristine();
      this.dialog.style.display = 'none';
    }
  }

  //TODO: возможно использовать таки AngularMaterials или для попапа отдельный компонент использовать
  sendCallbackRequest() {
    if (this.consultationForm.value.name && this.consultationForm.value.phone) {
      this.callbackService.sendCallbackRequest({
        name: this.consultationForm.value.name,
        phone: this.consultationForm.value.phone,
        type: "consultation"
      })
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            this._snackBar.open('Не удалось отправить запрос. Пожалуйста, обратитесь в службу поддержки');
            console.log(data.message);
          }
          this.requestIsSent = true;
        })
    }
  }
}
