/*
 *
 * HomePage
 *
 */
import { format, subHours, startOfMonth } from 'date-fns';
import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
} from '@zach.codes/react-calendar';
import React, { memo,useState,useEffect } from 'react';
import { Layout,ContentLayout,HeaderLayout } from '@strapi/design-system/Layout';
import { ModalLayout } from '@strapi/design-system/ModalLayout';
import { Field, FieldLabel, FieldHint, FieldError, FieldInput, FieldAction } from '@strapi/design-system/Field';
import { Stack } from '@strapi/design-system/Stack';
import { Textarea } from '@strapi/design-system/Textarea';
import {
  
  ContentBox,
  
} from '@strapi/helper-plugin';
import { Main } from '@strapi/design-system/Main';
import Header from '../../components/Header';
import { Link } from '@strapi/design-system/Link';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';
import Cross from '@strapi/icons/Cross';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import Plus from '@strapi/icons/Plus';
import { fr } from 'date-fns/esm/locale'
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import './index.css';
import InformationSquare from '@strapi/icons/InformationSquare';

import { useIntl } from 'react-intl';

const HomePage = () => {
  const { formatMessage } = useIntl();

useEffect(() =>{

  for(let el of document.getElementsByTagName("button")){
    if(el.innerHTML.includes("Next")){
      el.innerHTML = "Suivant"
    }
    else if (el.innerHTML.includes("Previous")){
      el.innerHTML = "Précédent"

    }
  }
  

},[])
  let [currentMonth, setCurrentMonth] = useState(
    startOfMonth(new Date())
  );
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Layout>
<Main>
<Box background="neutral100">

<HeaderLayout navigationAction={<Link startIcon={<ArrowLeft />} to="/">
        Retour
      </Link>} primaryAction={<Button startIcon={<Plus />} onClick={() => setIsVisible(true)}>
        Ajouter une opération
      </Button>}  title="Campagnes" subtitle="Créer des campagnes à une date personnalisée ou à une date récurrente" as="h2" />



  {isVisible && <ModalLayout onClose={() => setIsVisible(false)} labelledBy="subtitle" className='modal'>


   
    {/* <div className="cross_close">
    <button onClick={() => setIsVisible(false)}><Cross /></button>
      </div>   */}
      <h2 id="subtitle">
      <Field name="Titre" error={'Titre trop court'}>
      <Stack spacing={1}>
        <FieldLabel>Titre</FieldLabel>
        <FieldInput type="text" placeholder="Titre de l'opération" value={''} onChange={() => {}} />
        <FieldLabel>Description</FieldLabel>
        <Textarea type="text" placeholder="Description de l'opération" value={''} onChange={() => {}} />
        <FieldHint />
        <FieldError />
      </Stack>
    </Field></h2>
    
    </ModalLayout>}
</Box>
<ContentLayout>
<Box padding={1} marginBottom={9}>
        <ContentBox
          title={formatMessage({
            id: 'Information',
            defaultMessage: 'Information',
          })}
          subtitle={formatMessage({
            id: 'informa',
            defaultMessage:
              "Ajouter votre campagne directement sur le calendrier ou via le bouton en haut à droite",
          })}
          icon={<InformationSquare />}
          iconBackground="primary100"
        />
      </Box>
<MonthlyCalendar
      currentMonth={currentMonth}
      onCurrentMonthChange={date => setCurrentMonth(date)}
      locale={fr}
    >
      <MonthlyNav />
      <MonthlyBody
        events={[
          { title: '📅 Email session 1', date: subHours(new Date(), 2) },
          { title: '📅 Campagne tel formation 2', date: subHours(new Date(), 1) },
          { title: '📅 Message tous les apprenants', date: new Date() },
        ]}
      >
       <MonthlyDay
          renderDay={data =>
            data.map((item, index) => (
              <DefaultMonthlyEventItem
                key={index}
                title={item.title}
                // Format the date here to be in the format you prefer
                date={format(item.date, 'k:mm')}
                
              />
            ))
          }
        />
      </MonthlyBody>
    </MonthlyCalendar>
</ContentLayout>
</Main>
</Layout>

  
  );
};

export default memo(HomePage);
