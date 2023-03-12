import { OnlyadminGuard } from './../../../guards/onlyadmin.guard';
import { AdminIstanzaPageComponent } from './components/admin/admin-istanza-page/admin-istanza-page.component';
import { IstanzaCheckResolver } from './resolvers/istanzaCheck.resolver';
import { RendicontazioneResolver } from './resolvers/rendicontazione.resolver';
import { IstanzaResolver } from './resolvers/istanza.resolver';
import { DirectaccessGuard } from '@app/guards/directaccess.guard';
import { UserIstanzaEditComponent } from './components/user/user-istanza-edit/user-istanza-edit.component';
import { AdminIstanzeListComponent } from './components/admin/admin-istanze-list/admin-istanze-list.component';
import { IstanzaHomeComponent } from './components/home/istanza-home/istanza-home.component';

import {Routes} from '@angular/router';



export const IstanzeRoutes: Routes =[

    {
        path: '',
        component: IstanzaHomeComponent,
        data:{ mode:'edit'}
    },
    {
      path: 'list',
      component: AdminIstanzeListComponent
  },
  {
    path: 'edit/:id_ram',
    component: UserIstanzaEditComponent,
    data:{ mode:'edit'},
    canActivate: [DirectaccessGuard],
    resolve:{
        istanza: IstanzaResolver,
        rendicontazione: RendicontazioneResolver,
        istanzaCheck: IstanzaCheckResolver
    }
},
{
  path:'admin/:id_ram',
  component: AdminIstanzaPageComponent,
  canActivate:[OnlyadminGuard],
  resolve:{
      istanza: IstanzaResolver,
      rendicontazione: RendicontazioneResolver,
      istanzaCheck: IstanzaCheckResolver
  }
}

];


