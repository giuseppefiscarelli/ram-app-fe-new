import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@modules/shared/shared.module';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKeys } from '@app/app.costants';
import { ApplicationState } from '@app/app.state';
import { User } from '@app/modules/models/user.model';
import { StorageService } from '@app/modules/services/storage.service';
import { AuthenticationSignout } from '@app/modules/store/actions/authentication.actions';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Output() statusEmit = new EventEmitter()
  @Input() mobile: boolean;
  items: any[];
  toggle: any;
  user: Observable<User>;
  userMe: User;
  constructor(
                    private store: Store<ApplicationState>,
                    private storage: StorageService,
                    private router: Router,
                    private translator: TranslateService,
  ) {
    this.user = this.store.pipe(
      select('authentication'),
      select('user')
  );
  this.user.pipe(take(1)).subscribe((me: User) => this.userMe = me);
  console.log(this.userMe)
  if(this.userMe.role === 'administrative'){
    this.items = [

      {
        id: 'dashboard',
        label:  translator.instant('layout.menu.items.admin.children.home'),
        icon: 'home',
        target: '/dashboard'
      },
      {
        id: 'production',
        label: translator.instant('layout.menu.items.production.label'),
        icon: 'query_stats',
        children:[
        /*   {
            id: 'phase-insert',
            label: translator.instant('layout.menu.items.phases.children.insert'),
            target: '/monitoring/edit/phase'
          }, */
        /*   {
            id: 'project-list',
            label: 'Gestione Fitok',
            target: '/projects/list'
          }, */
          {
            id: 'dashboard',
            label:  translator.instant('layout.menu.items.controlRoom'),
            target: '/dashboard/control'
          },
          {
            id: 'monitoring-dashboard',
            label: translator.instant('layout.menu.items.projects.children.dashboard'),
            target: '/projects/dashboard'
          },
          {
            id: 'monitoring-dashboard-desk',
            label: translator.instant('layout.menu.items.projects.children.dashboard_desk'),
            target: '/projects/dashboard/desk'
          },
          {
            id: 'monitoring-dashboard-project',
            label: translator.instant('layout.menu.items.projects.children.dashboard_project'),
            target: '/projects/dashboard/project'
          },
          {
            id: 'fitok-list',
            label: translator.instant('layout.menu.items.projects.children.list'),
            target: '/projects/fitok/list'
          }
        ]
      }



    ]
  }
  if(this.userMe.role === 'admin'){
    this.items = [
      {
          id: 'dashboard',
          label:  translator.instant('layout.menu.items.admin.children.home'),
          icon: 'home',
          target: '/dashboard'
      },

      /* {
        id: 'employees',
        label: translator.instant('layout.menu.items.employees.label'),
        icon: 'group',
        children:[
          {
            id: 'employees-dash',
            label: translator.instant('layout.menu.items.employees.children.dash'),
            target: '/employees'
          },

        ]
      }, */
      {
        id: 'production',
        label: translator.instant('layout.menu.items.production.label'),
        icon: 'query_stats',
        children:[
        /*   {
            id: 'phase-insert',
            label: translator.instant('layout.menu.items.phases.children.insert'),
            target: '/monitoring/edit/phase'
          }, */
        /*   {
            id: 'project-list',
            label: 'Gestione Fitok',
            target: '/projects/list'
          }, */
          {
            id: 'dashboard',
            label:  translator.instant('layout.menu.items.controlRoom'),
            target: '/dashboard/control'
          },
          {
            id: 'monitoring-dashboard',
            label: translator.instant('layout.menu.items.projects.children.dashboard'),
            target: '/projects/dashboard'
          },
          {
            id: 'monitoring-dashboard-desk',
            label: translator.instant('layout.menu.items.projects.children.dashboard_desk'),
            target: '/projects/dashboard/desk'
          },
          {
            id: 'monitoring-dashboard-project',
            label: translator.instant('layout.menu.items.projects.children.dashboard_project'),
            target: '/projects/dashboard/project'
          },
          {
            id: 'fitok-list',
            label: translator.instant('layout.menu.items.projects.children.list'),
            target: '/projects/fitok/list'
          }
        ]
      },
      {
        id: 'admin',
        label: translator.instant('layout.menu.items.admin.label'),
        icon: 'admin_panel_settings',
        children:[
          {
            id: 'admin-desk',
            label: translator.instant('layout.menu.items.admin.children.listDesk'),
            target: 'management/desk/list'
          },
          {
            id: 'users',
            label:  translator.instant('layout.menu.items.users.label'),
            target: '/users/list'
          },
          {
            id: 'employee-list',
            label: translator.instant('layout.menu.items.employees.children.list'),
            target: '/employees/list'
          }

        ]
      },



    ]
  }
  if(this.userMe.role === 'user'){

  }

    }

    ngOnInit() {
    }
    onClickRoute():void{
      if(this.mobile){
          this.statusEmit.emit(false)
      }
  }
  onLogoutClick(): void {
      this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN);
      this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN_EXP);
      this.storage.unset(StorageKeys.AUTH_LOGGED_USER);

      this.store.dispatch(AuthenticationSignout());

      this.router.navigate(['/auth/signin']);
  }

}
