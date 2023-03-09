import { TypeDocResolver } from './resolvers/type-doc.resolver';

import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';

import {Routes} from '@angular/router';
import { TypeIstanceResolver } from './resolvers/type-istance.resolver';

export const ConfigRoutes: Routes = [
    {
        path: 'list',
        component: ListComponent
    },
    {
        path:'create',
        data:{ mode:'create'},
        component:EditComponent
    },
    {
        path:'config',
        component:ConfigPanelComponent
    },
    {
        path:'edit/:id',
        data:{ mode:'edit'},
        component:EditComponent,
        //canActivate: [DirectaccessGuard],
        resolve: {
            record: TypeIstanceResolver,
            typedoc: TypeDocResolver
        }
    }
]
