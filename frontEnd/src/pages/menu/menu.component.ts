import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  dashboardPage(): void{
    this.router.navigateByUrl('/dashboard')
  }
  permissionsPage(): void{
    this.router.navigateByUrl('/permissions')
  }

  customersPage(): void{
    this.router.navigateByUrl('/customers')
  }

  myaccountPage(): void{
    this.router.navigateByUrl('/myaccount')
  }

  ngOnInit() {
  }

}
