import AuthLogo from './extensions/logo.png';
import MenuLogo from './extensions/logo.png';
import Logo from './extensions/logo.png';

import favicon from './extensions/favicon.ico';

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: AuthLogo,
    },
   // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Add a new locale, other than 'en'
    locales: ['fr'],
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: MenuLogo,
    },
    homepage : {
      logo : Logo
    },
    notifications: { 
      release : false
    
    },
    tutorials : false,
    // Override or extend the theme
    theme: {
      colors: {
        danger100: 'rgb(255 228 230)', // TOGGLE OFF BG
        danger700: 'rgb(244 63 94)', // TOGGLE OFF COLOR

        neutral0: 'rgb(255 255 255)', // BACKGROUND SIDEBAR
        neutral100: 'rgb(245 245 245)', // BACKGROUND CONTENT
        neutral150: 'rgb(229 229 229)', // DISABLED BUTTON BG
        neutral200: 'rgb(212 212 212)', // LINE THROUGH MIDDLE
        neutral500: 'rgb(115 115 115)', // MENU IDLE COLOR
        neutral600: 'rgb(82 82 82)', // MENU HOVER COLOR
        neutral700: 'rgb(64 64 64)', // MENU ACTIVE ICON COLOR
        neutral800: 'rgb(38 38 38)', // TITLE COLORS
        neutral900: 'rgb(23 23 23)', // TOOLTIP BG

        primary100: 'rgb(219 234 254)', // MENU ACTIVE BG
        primary200: 'rgb(191 219 254)', // PLUS SIGN BG
        primary500: 'rgb(59 130 246)', // PRIMARY BUTTON HOVER
        primary600: 'rgb(37 99 235)', // PRIMARY BUTTON COLOR
        primary700: 'rgb(29 78 216)', // HIGHLIGHT COLOR

        success100: 'rgb(187 247 208)', // SUCCESS BOX BG
      },
    },
    translations : {
      fr : {
        "Settings.email.plugin.title" : "Modèles",
        "Auth.form.password.label": "Mot de passe",
        "app.components.LeftMenu.navbrand.title": "Panel",
        "app.components.LeftMenu.navbrand.workplace": "Gestion LMS",
        "Auth.form.welcome.subtitle": "Pour encore mieux gérer",
        "app.components.HomePage.welcomeBlock.content" : "Toutes nos félicitations! Retrouver sur le menu de gauche de nombreux outils pour administrer Efia !",
        "app.components.HomePage.create" : "Créer votre première table de données",
        "app.components.HomePage.welcomeBlock.content.again" : "Rendez-vous dans l'onglet Dashboard sur votre gauche afin de maitriser votre activité",
        "app.components.HomePage.button.blog" : "Pour les développeurs",
        "app.components.HomePage.community": "Communauté ",
        "app.components.HomePage.community.content":  "Vous êtes développeur ? La communauté est là pour vous aider",
        "app.components.HomePage.roadmap": "Lien",
        "app.components.BlockLink.blog": "Infos (développeur)",
        "app.components.BlockLink.blog.content": " ",
        "app.components.BlockLink.code": "Code (développeur)",
        "app.components.BlockLink.code.content": " ",
        "app.components.BlockLink.documentation": "Documentation (développeur)",
        "app.components.BlockLink.documentation.content": " ",
        "app.components.BlockLink.tutorial": "Tutoriel (développeur)",
        "app.components.BlockLink.tutorial.content": " ",

      
      },
     en : {
      "Settings.email.plugin.title" : "Modèles",

        "app.components.LeftMenu.navbrand.title": "Panel",
        "app.components.LeftMenu.navbrand.workplace": "Gestion LMS",
        "Auth.form.welcome.title": "Bienvenue !",
        "Auth.form.welcome.subtitle": "Pour encore mieux gérer",
        "app.components.HomePage.welcomeBlock.content" : "Toutes nos félicitations! Retrouver sur le menu de gauche de nombreux outils pour administrer Efia !",
        "app.components.HomePage.create" : "Créer votre première table de données",
        "app.components.HomePage.welcomeBlock.content.again" : "Rendez-vous dans l'onglet Dashboard sur votre gauche afin de maitriser votre activité",
        "app.components.HomePage.button.blog" : "Pour les développeur",
        "app.components.HomePage.community": "Communauté ",
        "app.components.HomePage.community.content":  "Vous êtes développeur ? La communauté est là pour vous aider",
        "app.components.HomePage.roadmap": "Lien",
        "app.components.BlockLink.blog": "Infos (développeur)",
        "app.components.BlockLink.blog.content": " ",
        "app.components.BlockLink.code": "Code (développeur)",
        "app.components.BlockLink.code.content": " ",
        "app.components.BlockLink.documentation": "Documentation (développeur)",
        "app.components.BlockLink.documentation.content": " ",
        "app.components.BlockLink.tutorial": "Tutoriel (développeur)",
        "app.components.BlockLink.tutorial.content": " ",

      },
    },
   // Disable video tutorials
    tutorials: false,
   // Disable notifications about new Strapi releases
    notifications: { release: false },
  },

  bootstrap() {},
};