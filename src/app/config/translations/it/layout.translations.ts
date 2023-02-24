export const LayoutLanguagePartialDefinition = {
    menu: {
        user: {
            edit: {
                short: 'MP',
                long: 'Modifica profilo'
            },
            logout: {
                short: 'L',
                long: 'Logout'
            }
        },
        items: {
            dashboard: 'Tablet Bordo Macchina',
            crm: 'CRM',
            contracts: 'Contratti',
            controlRoom: 'Control Room',

            users: {
                label: 'Gestione Utenti'
            },
            admin:{
              label: 'Gestione Ambiente',
              children:{
                  home: 'Home',
                  listDesk: 'Gestione Postazioni'
              }
            },
            projects:{
                label: 'Commesse',
                children:{
                    home: 'Home',
                    list: 'Gestione Lavorazioni',
                    dashboard: 'Stato Attività',
                    dashboard_desk:'Dashboard Postazioni',
                    dashboard_project:'Dashboard Fitok'
                }
            },
            phases:{
              label: 'Fasi',
              children:{
                  insert: 'Inserimento Fasi',
                  list: 'Gestione Fasi'
              }
            },
            production:{
              label: 'Produzione',
              children:{
                  insert: 'Inserimento Fasi',
                  list: 'Gestione Fasi'
              }
            },
            orders: {
                label: 'Ordini',
                children: {
                    sale: 'Ordini di vendita',
                    purchase: 'Ordini di acquisto',
                }
            },
            attendance:{
                label: 'Risorse Umane',
                labelEmployee: 'Gestione Presenze',
                children:{
                    home: 'Home',
                    justification: 'Giustificativi',
                    stamping: 'Presenze',
                    settings: 'Configurazione',
                    journal: 'Reportistica',
                    card: 'Cartellino',
                    dash:'Dashboard'

                }
            },
            employees:{
              label: 'Risorse Umane',
              children:{
                  home: 'Home',
                  justification: 'Giustificativi',
                  stamping: 'Presenze',
                  settings: 'Configurazione',
                  journal: 'Reportistica',
                  card: 'Cartellino',
                  dash:'Dashboard',
                  list:'Gestione Dipendenti'

              }
          },
            warehouse: {
                label: 'Magazzino',
                children: {
                    spares: 'Magazzino ricambi',
                    vehicleWarehouseNew: 'Magazzino veicoli Nuovi',
                    vehicleWarehouseUsed: 'Magazzino veicoli Usati',
                }
            },
            management: {
                label: 'Management',
                children: {
                    table: 'Gestione Ambiente',
                    users: 'Utenti',
                    areas: 'Mansioni',
                    branches: 'Reparti',
                    unitmeasures: 'Unità di Misura',
                    catemployee: 'Categorie Dipendenti',
                    extrasurcharges: 'Tabella Maggiorazioni',
                    othercosts: 'Tabella Altri Costi',
                    companies: 'Aziende'
                }
            },

            task: {
                label: 'Dettaglio attività'
            },
            discounts: {
                label: 'Sconti',
                children: {
                    categories: 'Categorie',
                    classes: 'Classi',
                    values: {
                        label: 'Sconti applicati',
                        children: {
                            purchase: 'Acquisto',
                            sale: 'Vendita',
                        }
                    }
                }
            },
        }
    }
};
