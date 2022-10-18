import React , {useState} from 'react';

import { Box } from '@strapi/design-system/Box';
import { BaseHeaderLayout, HeaderLayout, ModalLayout } from '@strapi/design-system/Layout';
import { Link } from '@strapi/design-system/Link';
import { Button } from '@strapi/design-system/Button';

import ArrowLeft from '@strapi/icons/ArrowLeft';
import Plus from '@strapi/icons/Plus';
import { useIntl } from 'react-intl';

import Pencil from '@strapi/icons/Pencil';

const Header = () => {
    const [isVisible, setIsVisible] = useState(false);

  const { formatMessage } = useIntl();
  return (
    <Box background="neutral100">

    <HeaderLayout navigationAction={<Link startIcon={<ArrowLeft />} to="/">
            Retour au dashboard
          </Link>} primaryAction={<Button startIcon={<Plus />} onClick={() => setIsVisible(true)}>
            Ajouter une opération
          </Button>}  title="Campagnes" subtitle="Ajouter votre campagne directement sur le calendrier" as="h2" />


      {isVisible && <ModalLayout onClose={() => setIsVisible(false)} labelledBy="subtitle">
          <button onClick={() => setIsVisible(false)}>Close me</button>
          <h2 id="subtitle">Here we are</h2>
        </ModalLayout>}
  </Box>
  );
};

export default Header;
