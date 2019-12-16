import { Component, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from "@angular/router"
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import axios from 'axios'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  username: any
  password: any

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private authService: AuthService,

  ) { }



  validateForm: FormGroup

  private user: SocialUser;
  private loggedIn: boolean;

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((res) => {
        console.log(res)
        if (this.loggedIn) {

          this.notification.config({
            nzPlacement: 'bottomRight'
          })

          axios({
            method: 'POST',
            url: "http://localhost:8080/api/login",
            data: {
              provider: res.provider,
              name: res.name,
              email: res.email,
              username: res.id,
              password: res.authToken,
              image: res.photoUrl
            },
          })
            .then((response: any) => {
              if (response.data.success === true) {
                var token = response.data.token
                axios({
                  method: 'GET',
                  url: `http://localhost:8080/api/petshop/current?token=${token}`

                })
                  .then((response: any) => {
                    axios({
                      method: 'GET',
                      url: `http://localhost:8080/api/petshop/accounts/${response.data.id}?token=${token}`

                    })
                      .then((response: any) => {

                          const { name, email, address, phone, image, _id } = response.data
                          localStorage.setItem('currentUser', JSON.stringify({
                            firstName: name.split(' ')[0],
                            name,
                            address,
                            phone,
                            photoUrl: image,
                            email,
                            _id
                          }))
                          localStorage.setItem('token', JSON.stringify(token))

                          this.router.navigateByUrl('/shopping')
                          this.notification.create(
                            'success',
                            'Đăng nhập thành công !',
                            ""
                          )
                        
                      })
                  })

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
      })
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((res) => {
        if (this.loggedIn) {
          this.notification.config({
            nzPlacement: 'bottomRight'
          })

          axios({
            method: 'POST',
            url: "http://localhost:8080/api/login",
            data: {
              provider: res.provider,
              name: res.name,
              email: res.email,
              username: res.id,
              password: res.authToken,
              image: res.photoUrl
            },
          })
            .then((response: any) => {
              if (response.data.success === true) {
                var token = response.data.token
                axios({
                  method: 'GET',
                  url: `http://localhost:8080/api/petshop/current?token=${token}`

                })
                  .then((response: any) => {
                    axios({
                      method: 'GET',
                      url: `http://localhost:8080/api/petshop/accounts/${response.data.id}?token=${token}`

                    })
                      .then((response: any) => {
                        if (response.data.lock) {
                          this.notification.create(
                            'error',
                            response.data.message,
                            ""
                          )
                        } else {
                          const { name, email, address, phone, image, _id } = response.data
                          localStorage.setItem('currentUser', JSON.stringify({
                            firstName: name.split(' ')[0],
                            name,
                            address,
                            phone,
                            photoUrl: image,
                            email,
                            _id
                          }))
                          localStorage.setItem('token', JSON.stringify(token))

                          this.router.navigateByUrl('/shopping')
                          this.notification.create(
                            'success',
                            'Đăng nhập thành công !',
                            ""
                          )
                        }
                      })
                  })

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
      )
  }

  imgClick(): void {
    const registerForm = window.document.querySelector('.register-box').classList
    const loginForm = window.document.querySelector('.login-box').classList
    const imgLeft = window.document.querySelector('.img-left').classList

    registerForm.remove('show-large')
    loginForm.toggle('show')
    imgLeft.toggle('move-img-to-left')
    imgLeft.remove('move-img-to-left-register')
  }

  registerClick(): void {
    const registerForm = window.document.querySelector('.register-box').classList
    const loginForm = window.document.querySelector('.login-box').classList
    const imgLeft = window.document.querySelector('.img-left').classList
    loginForm.remove('show')
    loginForm.add('hide')

    registerForm.remove('hide')
    registerForm.add('show-large')

    imgLeft.remove('move-img-to-left')
    imgLeft.add('move-img-to-left-register')
  }

  gotoDashboard(): void {

  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    this.notification.config({
      nzPlacement: 'bottomRight'
    })

    if (this.validateForm.status === 'VALID') {
      axios({
        method: 'POST',
        url: "http://localhost:8080/api/login",
        data: {
          username: this.username,
          password: this.password,
        },
      })
        .then((response: any) => {
          console.log(response)
          if (response.data.success === true) {
            var token = response.data.token
            axios({
              method: 'GET',
              url: `http://localhost:8080/api/petshop/current?token=${token}`

            })
              .then((response: any) => {
                axios({
                  method: 'GET',
                  url: `http://localhost:8080/api/petshop/accounts/${response.data.id}?token=${token}`

                })
                  .then((response: any) => {
                      const { name, email, address, phone, image, _id } = response.data
                      localStorage.setItem('currentUser', JSON.stringify({
                        firstName: name.split(' ')[0],
                        name,
                        address,
                        phone,
                        photoUrl: image,
                        email,
                        _id
                      }))
                      localStorage.setItem('token', JSON.stringify(token))

                      this.router.navigateByUrl('/shopping')
                      this.notification.create(
                        'success',
                        'Đăng nhập thành công !',
                        ""
                      )
                    
                  })
              })

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

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    })
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    })

  }
}

