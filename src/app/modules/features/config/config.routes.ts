import { EditionEditComponent } from './components/edition-edit/edition-edit.component';
import { EditionListComponent } from './components/edition-list/edition-list.component';
import { TypeDocResolver } from './resolvers/type-doc.resolver';

import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { EditComponent } from './components/edit/edit.component';


import {Routes} from '@angular/router';
import { TypeIstanceResolver } from './resolvers/type-istance.resolver';

export const ConfigRoutes: Routes = [
    {
        path: 'list',
        component: EditionListComponent
    },
    {
        path:'create',
        data:{ mode:'create'},
        component:EditionEditComponent
    },
    {
        path:'config',
        component:ConfigPanelComponent
    },
    {
        path:'edit/:id',
        data:{ mode:'edit'},
        component:EditionEditComponent,
        //canActivate: [DirectaccessGuard],
        resolve: {
            record: TypeIstanceResolver,
            typedoc: TypeDocResolver
        }
    }
]
