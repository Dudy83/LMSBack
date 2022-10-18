import React, { memo, useState, useEffect } from 'react';
import { ContentLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { Select, Option } from '@strapi/design-system/Select';
import { Flex } from '@strapi/design-system/Flex';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Accordion, AccordionToggle, AccordionContent, AccordionGroup } from '@strapi/design-system/Accordion';
import { Loader } from '@strapi/design-system/Loader';
import User from '@strapi/icons/User';
import Mail from '@strapi/icons/Mail';
import Check from '@strapi/icons/Check';
import dayjs from 'dayjs';
// import { Stack } from '@strapi/design-system/Stack';
import { Table, Thead, Tbody, Tr, Td, Th, TFooter } from '@strapi/design-system/Table';
import styled from 'styled-components';
import instance from '../../utils/axiosInstance';
import { DatePicker } from '@strapi/design-system/DatePicker';

const Right = styled.div`
  margin-left: auto;
  max-width: 50%;
`;
const Left = styled.div`
  margin-right: auto;
  max-width: 50%;
  display : flex;
  justify-content: center;
  gap: 10%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

const CardItem = styled.div`
  position: relative;
  max-width: 25%;
  min-width: 20%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-width: 1px;
  padding: 0 15px;
  border-color: ${props => props.theme.colors.primary200};
  color: ${props => props.theme.colors.primary600};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.primary100};
`;

const CardContent = styled.div`
  margin: 15px 0;
`;

const CardTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes[3]};
  font-weight: ${props => props.theme.fontWeights.semiBold};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes[4]};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.neutral800};
  margin-bottom: 15px;
`;


const CardText = styled.h2`
  margin: 15px 0;
  font-size: ${props => props.theme.fontSizes[5]};
  font-weight: ${props => props.theme.fontWeights.bold};
`;

const Margin = styled.div`
  margin: 10px 0;
`

const Center = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 50px;
`

const CourseItem = styled.div`
  max-width: 50%;
  width: fit-content;
`

const Formations = (props) => {
  const [values, setValues] = useState([]);
  const [categs, setCategs] = useState([]);
  const [formationsData, setFormationsData] = useState(null);
  const [dateStart, setDateStart] = useState();
  const [dateEnd, setDateEnd] = useState();

  const getCategs = async () => {
    try {
      const { data: response } = await instance.get('/dashboard/categoriesformations');
      return response;
    } catch (error) {
      console.error(error.message);
    }
  };

  const getData = async (id,dateStart,dateEnd) => {
    try {
      const { data: response } = await instance.post('/dashboard/formations', { data: { id_category: id, date_start: dateStart, date_end : dateEnd } });
      return response;
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(async () => {
    const findCategs = await getCategs();
    setCategs(findCategs);
  }, []);

  useEffect(async () => {
    const findFormations = await getData(values,dateStart,dateEnd);
    setFormationsData(findFormations);
  }, [values,dateStart,dateEnd])

  

  return (
    <Main>
      <ContentLayout>
        <Flex marginTop={8}>
        <Left>
       
        <DatePicker  onChange={setDateStart} selectedDate={dateStart} label="Date de début" placeholder="01/01/2022" name="datepicker" clearLabel={'Réinitialiser'} onClear={() => setDateStart(undefined)} selectedDateLabel={formattedDate => `Date sélectionnée ${formattedDate}`}  minDate={new Date(2010, 1, 1)} maxDate={new Date(2030, 1, 1)}/>
        <DatePicker onChange={setDateEnd} selectedDate={dateEnd} label="Date de fin" placeholder="01/01/2022" name="datepicker" clearLabel={'Réinitialiser'} onClear={() => setDateEnd(undefined)} selectedDateLabel={formattedDate => `Date sélectionnée ${formattedDate}`} minDate={new Date(2010, 1, 1)} maxDate={new Date(2030, 1, 1)} />
    
        </Left>
        <Right>
          <Select id="filter" placeholder="Filtrer par catégorie..." value={values} onChange={setValues} multi withTags>
            {categs && categs.map(categ => <Option key={categ.id} value={categ.id}>{categ.title}</Option>)}
          </Select>
        </Right>
        </Flex>
   
        <Flex marginTop="50px" flexWrap="wrap" alignItems="stretch" justifyContent="space-between">
          {formationsData && <Status status={formationsData.StatusOrder}></Status>}
          <Column>
            <Title>Sessions</Title>
            {formationsData && <Session sessions={formationsData.StatusSessions}></Session>}
          </Column>
        </Flex>
        <Box marginTop={8} background="neutral100">
          {formationsData && <Categorie categs={formationsData.formations}></Categorie>}
        </Box>
      </ContentLayout>
    </Main>
  );
};

const Categorie = (props) => {
  const { categs } = props;

  return (
    <>
      {categs && categs.map((categ, i) => {
        return <Margin key={i}>
          <Typography variant="delta" fontWeight="semiBold">{categ.title}</Typography>
          <AccordionGroup>
            {categ.formations && categ.formations.map((formation) => <Course key={formation.id} formation={formation}></Course>)}
          </AccordionGroup>
        </Margin>
      })}
    </>
  )
}


const Course = (props) => {
  const { formation } = props;
  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState(null);

  const fetchFormation = async (id) => {
    try {
      const { data: response } = await instance.get('/dashboard/formation/' + id);
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <Accordion expanded={open} onToggle={() => setOpen(s => {
      fetchFormation(formation.id).then(res => setContents(res))
      return !s;
    })} size="S">
      <AccordionToggle togglePosition="left" title={formation.title} />
      <AccordionContent>
        {contents ?
          contents.map((content, i) => <CourseContent key={i} content={content}></CourseContent>)
          : <Center><Loader>Loading content...</Loader></Center>
        }
      </AccordionContent>
    </Accordion>
  )
}

const CourseContent = (props) => {
  const { content } = props;

  return (
    <div style={{width: "100%", display: 'flex', alignItems: 'start', justifyContent: 'center', flexWrap: 'wrap'}}>
      {content.enseignant && <CourseContentTeacher teacher={content.enseignant}></CourseContentTeacher>}
      {content.commandes_formations && content.commandes_formations.length > 0 && <CourseContentCommandes commandes={content.commandes_formations}></CourseContentCommandes>}
      {content.sessions && content.sessions.length > 0 && <CourseContentSessions sessions={content.sessions}></CourseContentSessions>}
      {content.Modules && content.Modules.length > 0 && content.Modules[0].module && <CourseContentModules modules={content.Modules}></CourseContentModules>}
      {(!content.enseignant
        && content.commandes_formations.length == 0
        && content.sessions.length == 0
        && (content.Modules.length == 0 || !content.Modules[0].module)
      ) && <div style={{width: "100%"}}>
          <Box padding={8}>
            <Column>
              <Typography variant="beta">Pas de donnée</Typography>
            </Column>
          </Box>
        </div>}
    </div>
  )
}

const Module = (props) => {
  const { module } = props;
  const [open, setOpen] = useState(false);
  return (
    <Accordion expanded={open} onToggle={() => setOpen(s => !s)} size="S">
      <AccordionToggle title={module.titre} togglePosition="left" />
      <AccordionContent>
        {module.Activites && <Box padding={3}>
          <Typography variant="epsilon" fontWeight="semiBold">Activités</Typography>
          <Table colCount={10} rowCount={6}>
            <Thead>
              <Tr>
                <Th><Typography variant="sigma">Titre</Typography></Th>
                <Th><Typography variant="sigma">Catégorie</Typography></Th>
                <Th><Typography variant="sigma">Temps Min</Typography></Th>
                <Th><Typography variant="sigma">Temps Max</Typography></Th>
              </Tr>
            </Thead>
            <Tbody>
              {module.Activites.map(act => <Activite key={act.id} activite={act.activite}></Activite>)}
            </Tbody>
          </Table>

        </Box>}
      </AccordionContent>
    </Accordion>
  )
}

const Activite = (props) => {
  const { activite } = props;

  return (
    <Tr>
      <Td><Typography textColor="neutral800">{activite.titre}</Typography></Td>
      <Td><Typography textColor="neutral800">{activite.activiteCategorie?.name || 'Pas de catégorie'}</Typography></Td>
      <Td><Typography textColor="neutral800">{activite.tempsMin} min</Typography></Td>
      <Td><Typography textColor="neutral800">{activite.tempsMax} min</Typography></Td>
    </Tr>
  )
}

const CourseContentModules = (props) => {
  const { modules } = props;
  const [open, setOpen] = useState(false)

  return (
    <Box style={{width: "100%"}} padding={4}>
      <AccordionGroup>
        <Accordion expanded={open} onToggle={() => setOpen(s => !s)} size="S">
          <AccordionToggle title="Modules" togglePosition="left" />
          <AccordionContent>
            <Box padding={4}>
              <AccordionGroup>
                {modules.map(mod => mod.module && <Module key={mod.id} module={mod.module}></Module>)}
              </AccordionGroup>
            </Box>
          </AccordionContent>
        </Accordion>
      </AccordionGroup>
    </Box>
  )
}

const CourseContentTeacher = (props) => {
  const { teacher } = props;

  return (
    <CourseItem>
      <Box flexDirection='column' padding={3}>
        <Typography variant="epsilon" fontWeight="semiBold">Enseignant</Typography>
        {teacher?.username && <Typography variant="omega" fontWeight="regular">
          <Flex marginTop={2}>
            <Flex marginRight={1}>
              <User />
            </Flex>{teacher.username}
          </Flex>
        </Typography>}
        {teacher?.email && <Typography variant="omega" fontWeight="regular">
          <Flex>
            <Flex marginRight={1}>
              <Mail />
            </Flex>{teacher.email}
          </Flex>
        </Typography>}
      </Box>
    </CourseItem>
  )
}

const CourseContentCommandes = (props) => {
  const { commandes } = props;

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let price = 0;
    commandes.forEach(el => {
      price += el.totalPrice;
    });
    setTotalCount(price);
  }, []);

  return (
    <CourseItem>
      <Box flexDirection='column' padding={3}>
        <Typography variant="epsilon" fontWeight="semiBold">Ventes</Typography>
        <Flex marginTop={2}>
          <Table colCount={10} rowCount={6} footer={<TFooter icon={<Check />}>{String(totalCount + '€')}</TFooter>}>
            <Thead>
              <Tr>
                <Th><Typography variant="sigma">Statut</Typography></Th>
                <Th><Typography variant="sigma">Prix</Typography></Th>
                <Th><Typography variant="sigma">Type</Typography></Th>
              </Tr>
            </Thead>
            <Tbody>
              {commandes.map(commande => <Tr key={commande.id}>
                <Td><Typography textColor="neutral800">{commande.payement}</Typography></Td>
                <Td><Typography textColor="neutral800">{commande.totalPrice}</Typography></Td>
                <Td><Typography textColor="neutral800">{commande.with || "Aucune donnée"}</Typography></Td>
              </Tr>
              )}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </CourseItem>
  )
}

const CourseContentSessions = (props) => {
  const { sessions } = props;
  return (
    <CourseItem>
      <Box flexDirection='column' padding={3}>
        <Typography variant="epsilon" fontWeight="semiBold">Sessions</Typography>
        <Flex marginTop={2}>
          <Table colCount={10} rowCount={6}>
            <Thead>
              <Tr>
                <Th><Typography variant="sigma">Titre</Typography></Th>
                <Th><Typography variant="sigma">Date début</Typography></Th>
                <Th><Typography variant="sigma">Date fin</Typography></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sessions.map(session => <Tr key={session.id}>
                <Td><Typography textColor="neutral800">{session.titre}</Typography></Td>
                <Td><Typography textColor="neutral800">{dayjs(session.date_start).format('DD/MM/YYYY')}</Typography></Td>
                <Td><Typography textColor="neutral800">{dayjs(session.date_finish).format('DD/MM/YYYY')}</Typography></Td>
              </Tr>
              )}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </CourseItem>
  )
}

const Session = (props) => {
  const { sessions } = props;

  return (
    <>
      {sessions && Object.keys(sessions).map((key, i) => {
        return <Margin key={i}>
          <Button variant={key == 'open' ? 'success-light' : 'danger-light'} size="L">
            {key == 'open' ? 'Ouvertes' : 'Fermées'}
            {' '}
            ({key == 'open' ? (sessions.open?.length || 0) : (sessions.close?.length || 0)})
          </Button>
        </Margin>
      })}
    </>
  )
}

const Status = (props) => {
  const { status } = props;

  return (
    <>
      {status &&
        Object.keys(status).map((key, i) => {
          const statusData = status[key];

          return <CardItem key={i}>
            <CardContent>
              <CardTitle>{key}</CardTitle>
            </CardContent>
            <CardContent>
              <CardText>{statusData.totalPrice} €</CardText>
            </CardContent>
          </CardItem>
        })}
    </>
  )
}


export default Formations;
