import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router"


@Component({
  selector: 'app-card-shop',
  templateUrl: './card-shop.component.html',
  styleUrls: ['./card-shop.component.less']
})
export class CardShopComponent implements OnInit {
  @Output() linkTo: EventEmitter<any> = new EventEmitter()

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
  

  cardClick(): void{
    localStorage.setItem('currentPet', JSON.stringify(this.data))
    this.router.navigateByUrl(`/shopping/detail/${this.data.name}`)
  }

  constructor(private router: Router,) { }

  ngOnInit() {
    console.log(this.data);
    
  }

}
