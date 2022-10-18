/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { NotFound } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import Formations from '../Formations';
import Import from '../Import';
import Documentation from '../Documentation';
import Utilisateurs from '../Utilisateurs';
import User from '@strapi/icons/User';
import Book from '@strapi/icons/Book';
import { Layout, HeaderLayout } from '@strapi/design-system/Layout';
import { Link } from '@strapi/design-system/Link';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import Information from '@strapi/icons/Information';
import Write from '@strapi/icons/Write';
import instance from '../../utils/axiosInstance';
import Plus from '@strapi/icons/Plus';
import { TextButton } from '@strapi/design-system/TextButton';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';

import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink,
  SubNavLinkSection,
} from '@strapi/design-system/SubNav';

const App = () => {
  const [links, setLinks] = useState([]);
  let history = useHistory();
  const [title,setTitle] = useState(window.location.pathname.split('/').pop());
  const [linkPrimaryButton,setlinkPrimaryButton] = useState("");
  const [textPrimaryButton,settextPrimaryButton] = useState("");

  const getMenu = async () => {
    try {
      const { data: response } = await instance.get('/dashboard/documentation/menu');
      return response;
    } catch (error) {
      console.error(error.message);
    }
  };

 
  const toggleDoc = async () => {
    const menudoc = await getMenu();
    const linksT = [...links];
    const findIndex = linksT.findIndex((el) => el.label == "Documentation");
    linksT[findIndex].subnav = [];

    if (menudoc.Sections && menudoc.Sections.length > 0) {
      menudoc.Sections.forEach((section) => {
        let subSection = [];
        if (section.content && section.content.length > 0) {
          section.content.forEach((el) => {
            subSection.push({
              id: el.id,
              to:  section.titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-') +"/"+ el.titre.toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-') ,
              label: el.titre
            })
          })

          linksT[findIndex]?.subnav.push({
            id: section.id,
            label: section.titre,
            subnav: subSection
          })
        }
      })
    }

    setLinks(linksT);
  }

  useEffect(async () => {
    let label =  window.location.pathname.split('/').pop();
    (Number.isInteger(parseInt(label))) &&  window.location.pathname.includes("Documentation") ? label = "Documentation" : null;
    setTitle(label);

    const linksT = [
      {
        id: 1,
        label: 'Formations',
        icon: <Book />,
        to: `/plugins/${pluginId}/Formations`,
        active: true,
        primaryButton : {
          link : "/admin/content-manager/collectionType/api::formation.formation/create",
          text :"Ajouter une formation"
        },
      },
      {
        id: 2,
        label: 'Utilisateurs',
        icon: <User />,
        to: `/plugins/${pluginId}/Utilisateurs`,
        primaryButton : {
          link : "/admin/content-manager/collectionType/plugin::users-permissions.user/create",
          text :"Ajouter un utilisateur"
        },
      },
      {
        id: 3,
        label: 'Import',
        icon: <Write />,
        to: `/plugins/${pluginId}/Import`,
        primaryButton : {
          link : "/admin/content-manager/collectionType/api::prospect.prospect/create",
          text :"Ajouter un prospect"
        },
      },
      {
        id: 4,
        label: 'Documentation',
        icon: <Information />,
        to: `/plugins/${pluginId}/Documentation`,
        primaryButton : {
          link : "/admin/content-manager/singleType/api::documentation.documentation",
          text :"Ajouter un article"
        },
        subnav: []
      },
    ];
    if(title != "Dashboard"){
      let findIndex = linksT.findIndex((el)=> el.label.includes(label));

      setlinkPrimaryButton(linksT[findIndex].primaryButton.link);
      settextPrimaryButton(linksT[findIndex].primaryButton.text);
    }
   

    setLinks(linksT);

  }, []);
  const TitleEdit = (e, primaryButton) => {
    setlinkPrimaryButton(primaryButton.link);
    settextPrimaryButton(primaryButton.text);

setTitle(e);
  }
  useEffect(async () => {
    if (title == 'Dashboard') {
      history.push("/plugins/Dashboard/Formations");
    }
  }, [window.location.pathname]);

  return (
    <Layout sideNav={
      <SubNav  ariaLabel="Dashboard sub nav">
        <SubNavHeader  label="Dashboard" />
        <SubNavSections >
          {links.map((link) => (!link.label.includes("Documentation")) 
            ? <span onClick={() => TitleEdit(link.label, link.primaryButton)}> <SubNavLink  key={link.id} to={link.to}  icon={link.icon}>{link.label}</SubNavLink>  </span>
            : <span onClick={() => toggleDoc()}>
              <SubNavLinkSection  collapsable key={link.id}  label="Documentation"> 
                {link.subnav && link.subnav.map(section =>
                  <SubNavLinkSection  label={section.label} key={section.id} >
                    {section.subnav && section.subnav.map(content => <span onClick={() => TitleEdit(content.label, link.primaryButton)}>  <SubNavLink to={"/plugins/Dashboard/Documentation/" +section.id + "/"+content.id}  key={content.id}>{content.label}</SubNavLink></span>)}
                    
                    <Box paddingLeft={7}>
                    <TextButton startIcon={<Plus />} onClick={() =>{ window.location.href = "/admin/content-manager/singleType/api::documentation.documentation"}}>Ajouter un article</TextButton>                </Box>
                  </SubNavLinkSection>
                  
                )}

              </SubNavLinkSection>

            </span>
          )}
        </SubNavSections>
      </SubNav>
    }>
      <Helmet title={title} />

      <HeaderLayout
        title={title}
        navigationAction={
          <Link startIcon={<ArrowLeft />} to="/">
            Retour
          </Link>
        } primaryAction={<a style={{textDecoration: 'none'}} href={linkPrimaryButton}><Button startIcon={<Plus />}>{textPrimaryButton}</Button> </a>}
      />

      <Switch>
        <Route path={`/plugins/${pluginId}/Formations`} component={Formations} exact />
        <Route path={`/plugins/${pluginId}/Utilisateurs`} component={Utilisateurs} exact />
        <Route path={`/plugins/${pluginId}/Import`} component={Import} exact />
        <Route path={'/plugins/'+pluginId +'/Documentation/:id_section/:id'}  component={Documentation} exact />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default App;
