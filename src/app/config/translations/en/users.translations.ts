export const UsersLanguagePartialDefinition = {
    roles: {
        administrator: 'Amministratore',
        administrative: 'Back Office',
        worker: 'Magazzino',
        dpo: 'Resp. Privacy',
        user: 'User',
        admin: 'Admin',
        administrativeEmployee: 'Amministrazione',
        wharehouseWorker: 'Magazzino',
    },
    rolesAms: {
        admin: 'Admin',
        administrative: 'Amministrativo',
        supervisor: 'Responsabile',
        user: 'Dipendente'
    },
    rolesFms: {
        admin: 'Admin',
        administrative: 'Responsabile Flotta',
        user: 'Dipendente / Autista',
        PM: 'Project Manager'
    },
    rolesTms: {
        admin: 'Admin',
        administrative: 'Responsabile',
        user: 'Dipendente',
        PM: 'Project Manager'
    },
    rolesPms: {
        admin: 'Admin',
        administrative: 'Responsabile',
        user: 'Dipendente',
        PM: 'Project Manager'
    },
    list: {
        filters: {
            fields: {
                role: {
                    placeholder: 'Scegli il ruolo',
                    values: {
                        admin: 'Amministratore',
                        administrative: 'Amministrazione',
                        user: 'Dipendente',
                        all: 'Tutti',
                    }
                },
                hint: 'Cerca per nome, cognome o email...',
            }
        },
        header: {
            id: '#',
            user: 'Utente',
            email: 'Email',
            role: 'Ruolo',
            createdAt: 'Data creazione',
            actions: 'Azioni'
        },
        footer: {
            loading: 'Carico altri risultati...'
        },
        button:{
          create:'Inserimento nuovo utente'
        }
    },
    modals: {
        create: {
            title: 'Inserimento nuovo utente',
            sections: {
                info: 'Informazioni personali',
                signin: 'Informazioni per l\'accesso'
            },
            fields: {
                name: 'Nome',
                surname: 'Cognome',
                email: 'Indirizzo email (valido anche per l\'accesso)',
                role: 'Ruolo:',
                password: 'Password',
                confirm: 'Conferma password'
            },
            action: 'Crea utente',
            errors: {
                passwordsMismatch: 'Le password non coincidono'
            }
        },
        edit: {
            title: 'Modifica utente',
            sections: {
                info: 'Informazioni personali'
            },
            fields: {
                name: 'Nome',
                surname: 'Cognome',
                email: 'Indirizzo email (valido anche per l\'accesso)',
                role: 'Ruolo:'
            },
            action: 'Salva informazioni'
        },
        remove: {
            title: 'Rimozione utente',
            message: 'Sei sicuro di voler rimuovere l\'utente <b>{{fullname}}</b>? L\'operazione è irreversibile.',
            buttons: {
                skip: 'Annulla',
                confirm: 'Conferma'
            }
        }
    },
    notifications: {
        create: {
            title: 'Creazione utente',
            message: 'L\'utente <b>{{fullname}}</b> è stato creato con successo'
        },
        edit: {
            title: 'Modifica utente',
            message: 'L\'utente <b>{{fullname}}</b> è stato aggiornato'
        },
        remove: {
            title: 'Rimozione utente',
            message: 'L\'utente è stato rimosso con successo'
        }
    }
};
