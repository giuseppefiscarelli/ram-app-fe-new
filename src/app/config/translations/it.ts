import { ProjectLanguagePartialDefinition } from './it/project.translations';
import { DeskLanguagePartialDefinition } from './it/desk.translations';
import { EmployeeLanguagePartialDefinition } from './it/employee.translations';
import {CommonsLanguagePartialDefinition} from '@configs/translations/it/commons.translations';
import {LayoutLanguagePartialDefinition} from '@configs/translations/it/layout.translations';
import {UsersLanguagePartialDefinition} from '@configs/translations/it/users.translations';
import {AuthenticationLanguagePartialDefinition} from '@configs/translations/it/authentication.translations';
import {ErrorsLanguagePartialDefinition} from '@configs/translations/it/errors.translations';

export const LanguageDefinition = {
    commons: CommonsLanguagePartialDefinition,
    errors: ErrorsLanguagePartialDefinition,
    layout: LayoutLanguagePartialDefinition,
    users: UsersLanguagePartialDefinition,
    authentication: AuthenticationLanguagePartialDefinition,
    desk:DeskLanguagePartialDefinition,
    employee: EmployeeLanguagePartialDefinition,
    project: ProjectLanguagePartialDefinition


};
