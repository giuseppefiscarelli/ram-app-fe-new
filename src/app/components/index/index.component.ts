import { Component, HostListener, OnInit } from '@angular/core';
import { ApplicationState } from '@app/app.state';
import { User } from '@app/modules/models/user.model';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  opened: boolean;
  mobile: any;
  user: Observable<User>;
  userMe: User;
  @HostListener("window:resize", [])
  onResize() {
    var width = window.innerWidth;
    this.mobile = width <= 1200;
    this.opened = !this.mobile;
  }
  constructor(private store: Store<ApplicationState>,) {
    this.mobile = true;
    this.user = this.store.pipe(
      select('authentication'),
      select('user')
  );
  this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
   }

  ngOnInit(): void {
    var width = window.innerWidth;
    if(this.userMe.type === 'desk'){
        this.mobile = true;
    }else{
      this.mobile = width <= 1200;
    }
    this.opened = !this.mobile;

  }
  toggleSidenav(event){

      this.opened = event;
  }
}


