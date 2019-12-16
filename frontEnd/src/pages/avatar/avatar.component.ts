import { Component } from '@angular/core';

const userList = ['U', 'Lucy', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html'
})
export class AvatarComponent {
  text: string = userList[3];
  color: string = colorList[3];

  img = JSON.parse(localStorage.getItem('currentUser')).photoUrl

  change(): void {
    
  }
}
