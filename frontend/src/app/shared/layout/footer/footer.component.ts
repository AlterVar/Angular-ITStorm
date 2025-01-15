import {Component, OnInit} from '@angular/core';
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
  consultationOpen: boolean = false;
  dialogBtn: HTMLElement | null = null;
  requestIsSent: boolean = false;
  responseIsOk: boolean = true;

  consultationForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
  })

  constructor(private _snackBar: MatSnackBar,
              private callbackService: CallbackService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.consultationOpen = !this.consultationOpen;
  }

  closeDialog(event: Event) {
    event.stopPropagation();
    this.dialogBtn = document.getElementById('consultation-btn');
    this.requestIsSent = false;
    if (event.target === event.currentTarget || event.currentTarget === this.dialogBtn) {
      this.consultationForm.setValue({
        name: '',
        phone: ''
      })
      this.consultationForm.markAsUntouched();
      this.consultationForm.markAsPristine();
      this.consultationOpen = !this.consultationOpen;
    }
  }

  //TODO: возможно использовать таки AngularMaterials или для попапа отдельный компонент использовать
  sendCallbackRequest() {
    this.responseIsOk = true;
    if (this.consultationForm.value.name && this.consultationForm.value.phone) {
      this.callbackService.sendCallbackRequest({
        name: this.consultationForm.value.name,
        phone: this.consultationForm.value.phone,
        type: "consultation"
      })
        .subscribe({
          next: () => {
            this.responseIsOk = true;
            this.requestIsSent = true;
          },
          error: () => {
            this.responseIsOk = false;
            this.requestIsSent = false;
          }
        })
    }
  }
}
