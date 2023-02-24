import { DashboardBackofficeComponent } from './backoffice/dashboard-backoffice/dashboard-backoffice.component';
import { ControlHomeComponent } from './control-room/control-home/control-home.component';
import { DashTestComponent } from './dash-test/dash-test.component';
import { Routes} from '@angular/router';

export const  DashBoardRoutes: Routes = [
  {
    path:'',
    component: DashTestComponent
},
{
  path:'control',
  component: ControlHomeComponent
},
{
  path:'backoffice',
  component: DashboardBackofficeComponent
}];


