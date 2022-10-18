module.exports = [
  {
    method: 'GET',
    path: '/categoriesformations',
    handler: 'myController.Categs',
    config: {
      policies: [],
    },
  },

  {
    method: 'POST',
    path: '/formations',
    handler: 'myController.StatsCardFormation',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/formation/:id_formation',
    handler: 'myController.InfoFormation',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/utilisateurs',
    handler: 'myController.usersInfo',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/documentation/menu',
    handler: 'myController.MenuDoc',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/documentation/article',
    handler: 'myController.RecupArticle',
    config: {
      policies: [],
    },
  },

];
