import { ProjectLanguagePartialDefinition } from './en/project.translations';
import { DeskLanguagePartialDefinition } from './en/desk.translations';
import { EmployeeLanguagePartialDefinition } from './en/employee.translations';
import {CommonsLanguagePartialDefinition} from '@configs/translations/en/commons.translations';
import {LayoutLanguagePartialDefinition} from '@configs/translations/en/layout.translations';
import {UsersLanguagePartialDefinition} from '@configs/translations/en/users.translations';
import {AuthenticationLanguagePartialDefinition} from '@configs/translations/en/authentication.translations';
import {ErrorsLanguagePartialDefinition} from '@configs/translations/en/errors.translations';

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
