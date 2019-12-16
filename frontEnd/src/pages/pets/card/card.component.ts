import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import axios from 'axios'
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnInit {

  @Input()
  data: {
    _id: String,
    name: String,
    kind: String,
    character: String,
    gender: Boolean,
    vaccineUpToDate: Boolean,
    provider: String,
    age: Number,
    price: Number,
    img: String,
  };

  account


  isVisible = false;
  detailVisible = false;

  validateForm: FormGroup;
  confirmModal: NzModalRef; // For testing by now
  isSpinning: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
  ) {
    this.validateForm = this.fb.group({
      name: [''],
      gender: [''],
      age: [''],
      vaccine: [''],
      price: [''],
      character: [''],
      image: [''],
      provider: ['']
    });
  }

  tokenFromStorage = JSON.parse(localStorage.getItem('token'));
  token = this.tokenFromStorage ? this.tokenFromStorage : 'randomshittoken'; // your token
  deletePet(): void {
    if (this.account.role.indexOf('PET_DELETE') === -1 && this.account.role.indexOf('admin') === -1) {
      this.notification.config({
        nzPlacement: 'bottomRight'
      })
      this.notification.create(
        'error',
        'Bạn không có quyền xoá pet !',
        ""
      )
    } else {
      axios({
        method: 'DELETE',
        url: `http://localhost:8080/api/petshop/pets/${this.data._id}?token=${this.token}`,

      })
        .then(async (response: any) => {
          window.location.reload();
        }).catch((err) => {
          console.log(err)
        })
    }
  }


  detailClick(): void {
    this.detailVisible = true
  }

  submitForm(value: any): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(this.account)


      const { name, character, gender, vaccine, provider, age, price, img } = value

      axios({
        method: 'PUT',
        url: `http://localhost:8080/api/petshop/pets/${this.data._id}?token=${this.token}`,
        data: {
          name,
          character,
          gender,
          vaccineUpToDate: vaccine,
          provider,
          age,
          price,
          img
        }
      })
        .then((response: any) => {
          this.notification.config({
            nzPlacement: 'bottomRight'
          })
          this.notification.create(
            'success',
            'Đã sửa !',
            ""
          )
          window.location.reload()
        }).catch(err => {
          this.notification.config({
            nzPlacement: 'bottomRight'
          })
          this.notification.create(
            'error',
            err,
            ""
          )
        })
      this.handleOk()

    
  }


  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  showModal(): void {
    if (this.account.role.indexOf('PET_EDIT') === -1 && this.account.role.indexOf('admin') === -1) {
      this.notification.config({
        nzPlacement: 'bottomRight'
      })
      this.notification.create(
        'error',
        'Bạn không có quyền sửa pet !',
        ""
      )
    } else {
    this.isVisible = true;
    }
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.detailVisible = false
  }

  ngOnInit() {

    axios({
      method: 'GET',
      url: `http://localhost:8080/api/petshop/current?token=${this.token}`

    })
      .then((response: any) => {
        axios({
          method: 'GET',
          url: `http://localhost:8080/api/petshop/accounts/${response.data.id}?token=${this.token}`

        })
          .then((response: any) => {
            this.account = response.data
          })
      })

  }

}
