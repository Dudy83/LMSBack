/*
 *
 * Import
 *
 */

import React, { memo, useState,useEffect } from 'react';
import { ContentLayout } from '@strapi/design-system/Layout';
import { GridLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { useParams } from 'react-router-dom';
import instance from '../../utils/axiosInstance';

import {
    SubNav,
    SubNavHeader,
    SubNavSection,
    SubNavSections,
    SubNavLink,
    SubNavLinkSection,
} from '@strapi/design-system/SubNav'
import { Main } from '@strapi/design-system/Main';
import { ExclamationMarkCircle } from '@strapi/icons/ExclamationMarkCircle';
import { Apps } from '@strapi/icons/Apps';
import { Flex } from '@strapi/design-system/Flex';
import styled from 'styled-components';
import { Tag } from '@strapi/design-system/Tag';
import './style.css';
import { CarouselInput, CarouselSlide, CarouselImage, CarouselActions } from '@strapi/design-system/CarouselInput';
import ReactMarkdown from "react-markdown";
import ReactHtmlParser from 'react-html-parser'; 

const Left = styled.div`
  margin-left: auto;
  max-width: 33%;
`;

const Documentation = () => {
    const { id_section,id } = useParams();
    const [article,setArticle] = useState([]);
    const getArticle = async (id, id_section) => {
        try {
          const { data: response } = await instance.post('/dashboard/documentation/article', { data: { id: id, id_section: id_section } });
          return response;
        } catch (error) {
          console.error(error.message);
        }
      };
      useEffect(async () => {
        const article = await getArticle(id,id_section);
        setArticle(article["Sections"][0]["content"][0]);
      },[id_section,id])

    return (
        <Main>
            
            <ContentLayout>
                <Flex marginTop="20px" flexWrap="wrap" alignItems="stretch" justifyContent="center">

                    {article && <Box marginRight="10px" style={{
                        height: '100vh',
                        width: '100%'
                    }} background="neutral0" >
 <Box paddingTop={3} paddingLeft={4}>
<div>Rédigé par {article.admin_user?.firstname && article.admin_user?.lastname ? article.admin_user?.firstname + " " + article.admin_user?.lastname : " Aucun auteur "}</div> 
        <Typography  variant="alpha"  className="titre">{article.titre}</Typography>
      </Box>
      <Box paddingTop={8} paddingLeft={4}>
      <div className="article" > { ReactHtmlParser (article.text) } </div>
      </Box>

                    </Box>}

                </Flex>


            </ContentLayout>
        </Main>

    );
};

export default Documentation;
