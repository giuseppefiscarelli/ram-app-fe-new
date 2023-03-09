import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LoggedInGuard } from './guards/logged.in.guard';


export const ApplicationRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/features/authentication/authentication.module').then(exports => exports.AuthenticationModule)
  },
  {

  path:'',
  canActivate: [LoggedInGuard],
  component: IndexComponent,
  children: [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/istanze',
    },
    {path: 'users', loadChildren: () => import('./modules/features/users/users.module').then(exports => exports.UsersModule)},
    {
      path: 'istanze',
      loadChildren: () => import('./modules/features/istanze/istanze.module').then(exports => exports.IstanzeModule)

    },
    {
        path: 'rendicontazione',
        loadChildren: () => import('./modules/features/istanze/istanze.module').then(exports => exports.IstanzeModule)

    },
    {
      path: 'config',
      loadChildren: () => import('./modules/features/config/config.module').then(exports => exports.ConfigModule)
  }


  ]

}]
