import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { NzNotificationService } from 'ng-zorro-antd/notification'
import axios from 'axios'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  @Output()
  registered = new EventEmitter<string>();


  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
  ) { }


  imgClick(): void {
    const registerForm = window.document.querySelector('.register-box').classList
    const loginForm = window.document.querySelector('.login-box').classList
    const imgLeft = window.document.querySelector('.img-left').classList

    registerForm.remove('show-large')
    loginForm.toggle('show')
    imgLeft.toggle('move-img-to-left')
    imgLeft.remove('move-img-to-left-register')
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.notification.config({
      nzPlacement: 'bottomRight'
    })

    if (this.validateForm.status === 'VALID') {

      const { name, username, email, password } = this.validateForm.value

      axios({
        method: 'POST',
        url: "http://localhost:8080/api/register",
        data: {
          name: name,
          email: email,
          username: username,
          password: password
        },
      })
        .then((response: any) => {
          if (response.data.success === true) {
            this.imgClick()
            this.notification.create(
              'success',
              'Đăng kí thành công !',
              ""
            )
          }
          else {
            this.notification.create(
              'error',
              response.data.message,
              ""
            )
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };



  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
    });

  }



}
