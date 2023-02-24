import { ProjectsService } from './../../projects/projects.service';
import { User } from './../../../models/user.model';
import { SidenavComponent } from './../../../../components/sidenav/sidenav.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dash-test',
  templateUrl: './dash-test.component.html',
  styleUrls: ['./dash-test.component.scss'],
  providers:[SidenavComponent]
})
export class DashTestComponent implements OnInit {

  userData: User;
  mode:string;

  constructor( private shareData: SidenavComponent,
               ) {

    this.userData = this.shareData.userMe;
    this.mode = 'desktop';
    if (this.userData.type === 'desk'){
      this.mode = 'tablet';
    }
   }

  ngOnInit(): void {
  }

}
