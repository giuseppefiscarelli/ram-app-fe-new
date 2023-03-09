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

  user: Observable<User>;
  userMe: User;

  constructor(private store: Store<ApplicationState>,) {

    this.user = this.store.pipe(
      select('authentication'),
      select('user')
  );
  this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
   }

  ngOnInit(): void {


  }

}


