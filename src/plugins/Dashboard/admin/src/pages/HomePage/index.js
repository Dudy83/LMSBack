import React, { memo, useState } from 'react';

import {  ContentLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';



const HomePage = () => {


  return (
    <Main>
      <ContentLayout>
        Homepage
      </ContentLayout>
    </Main>
  );
};

export default memo(HomePage);