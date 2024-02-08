export const UsersLanguagePartialDefinition = {
    roles: {
        administrator: 'Administrator',
        administration: 'Administration',
        administrative: 'Back Office',
        worker: 'Warehouse',
        dpo: 'Privacy Officer',
        user: 'User',
        admin: 'Admin',
        administrativeEmployee: 'Administration',
        wharehouseWorker: 'Warehouse',
    },
    rolesAms: {
        admin: 'Admin',
        administrative: 'Administration',
        supervisor: 'Supervisor',
        user: 'User'
    },
    rolesFms: {
        admin: 'Admin',
        administrative: 'Fleet Manager',
        user: 'Employee / Driver',
        PM: 'Project Manager'
    },
    rolesTms: {
        admin: 'Admin',
        administrative: 'Manager',
        user: 'Employee',
        PM: 'Project Manager'
    },
    rolesPms: {
        admin: 'Admin',
        administrative: 'Manager',
        user: 'Employee',
        PM: 'Project Manager'
    },
    list: {
        filters: {
            fields: {
                role: {
                    placeholder: 'Choose the role',
                    values: {
                        admin: 'Administrator',
                        administrative: 'Administration',
                        user: 'User',
                        all: 'All',
                    }
                },
                hint: 'Search by name, surname, or email...',
            }
        },
        header: {
            id: '#',
            user: 'User',
            email: 'Email',
            role: 'Role',
            createdAt: 'Creation Date',
            actions: 'Actions'
        },
        footer: {
            loading: 'Loading more results...'
        },
        button:{
          create:'Create new user'
        }
    },
    modals: {
        create: {
            title: 'Create new user',
            sections: {
                info: 'Personal Information',
                signin: 'Login Information'
            },
            fields: {
                name: 'Name',
                surname: 'Surname',
                email: 'Email address (also used for login)',
                role: 'Role:',
                password: 'Password',
                confirm: 'Confirm password'
            },
            action: 'Create user',
            errors: {
                passwordsMismatch: 'Passwords do not match'
            }
        },
        edit: {
            title: 'Edit user',
            sections: {
                info: 'Personal Information'
            },
            fields: {
                name: 'Name',
                surname: 'Surname',
                email: 'Email address (also used for login)',
                role: 'Role:'
            },
            action: 'Save information'
        },
        remove: {
            title: 'Remove user',
            message: 'Are you sure you want to remove the user <b>{{fullname}}</b>? This operation is irreversible.',
            buttons: {
                skip: 'Cancel',
                confirm: 'Confirm'
            }
        }
    },
    notifications: {
        create: {
            title: 'User Creation',
            message: 'The user <b>{{fullname}}</b> has been created successfully'
        },
        edit: {
            title: 'Edit user',
            message: 'The user <b>{{fullname}}</b> has been updated'
        },
        remove: {
            title: 'Remove user',
            message: 'The user has been successfully removed'
        }
    }
};
