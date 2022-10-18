
import React, { memo, useState} from 'react';
import { Layout,ContentLayout,HeaderLayout } from '@strapi/design-system/Layout';
import { ModalLayout } from '@strapi/design-system/ModalLayout';

import {
  
  ContentBox,
  
} from '@strapi/helper-plugin';
import { Main } from '@strapi/design-system/Main';
import { Link } from '@strapi/design-system/Link';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';

import ArrowLeft from '@strapi/icons/ArrowLeft';
import Plus from '@strapi/icons/Plus';

// import PropTypes from 'prop-types';
import InformationSquare from '@strapi/icons/InformationSquare';
import { useIntl } from 'react-intl';
const HomePage = () => {
  const { formatMessage } = useIntl();

  const [isVisible, setIsVisible] = useState(false);

  return (
    <Layout>
<Main>
<Box background="neutral100">

<HeaderLayout navigationAction={<Link startIcon={<ArrowLeft />} to="/">
        Retour
      </Link>} primaryAction={<Button startIcon={<Plus />} onClick={() => setIsVisible(true)}>
        Paramètres
      </Button>}  title="Messageries" subtitle="Discuter, échanger avec les acteurs du LMS" as="h2" />



  {isVisible && <ModalLayout onClose={() => setIsVisible(false)} labelledBy="subtitle" className='modal'>


   
    {/* <div className="cross_close">
    <button onClick={() => setIsVisible(false)}><Cross /></button>
      </div>   */}
      <h2 id="subtitle">
</h2>
    
    </ModalLayout>}
</Box>
<ContentLayout>


</ContentLayout>
</Main>
</Layout>

  );
};

export default memo(HomePage);
