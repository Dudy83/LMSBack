/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { useIntl } from 'react-intl';
import { getTrad } from '../../utils';
import {
  CheckPermissions,
  ConfirmDialog,
  LoadingIndicatorPage,
  stopPropagation,
  EmptyStateLayout,

} from '@strapi/helper-plugin';

import Calendar from '@strapi/icons/Calendar';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
import Trash from '@strapi/icons/Trash';
import { SimpleMenu, MenuItem } from '@strapi/design-system/SimpleMenu';
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Layout, HeaderLayout, ContentLayout, GridLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { Helmet } from 'react-helmet';
import Pencil from '@strapi/icons/Pencil';
import Eye from '@strapi/icons/Eye';
import Plus from '@strapi/icons/Plus';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
import { Accordion, AccordionToggle, AccordionContent, AccordionGroup } from '@strapi/design-system/Accordion';
import { Flex } from '@strapi/design-system/Flex';
import { Link } from '@strapi/design-system/Link';
import { TextButton } from '@strapi/design-system/TextButton';
import { IconButton } from '@strapi/design-system/IconButton';
import User from '@strapi/icons/User';
import { Typography } from '@strapi/design-system/Typography';
import { DatePicker } from '@strapi/design-system/DatePicker';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Avatar, AvatarGroup, Initials } from '@strapi/design-system/Avatar';
import ExclamationMarkCircle from '@strapi/icons/ExclamationMarkCircle';
import { Select, Option } from '@strapi/design-system/Select';
import { Stack } from '@strapi/design-system/Stack';

const HomePage = () => {
  const [expanded, setExpanded] = useState(false);
  const [modalTask, setModalTask] = useState(false);
  const [modalNewTask, setModalNewTask] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [val, setValue] = useState('MF');
  const [values, setValues] = useState([]);
  const [error, toggleError] = useState();
  const [disabled, toggleDisabled] = useState();
  const entries = [
    {
      user: 'https://avatars.githubusercontent.com/u/3874873?v=4',
      description: 'Chez Léon is a human sized Parisian',
      title: 'French cuisine',
      priority: 'faible'
    }
  ];

  const { formatMessage } = useIntl();

  const title = formatMessage({
    id: getTrad('plugin.name'),
    defaultMessage: 'Tâches',
  });

  return (
    <Layout>
      <Helmet title={title} />
      {/* aria-busy={isLoading} */}
      <Main >
        <HeaderLayout
          title={title}
          subtitle={formatMessage({
            id: getTrad('pages.HomePage.header.description'),
            defaultMessage: 'Bienvenue dans le configurateur de tâches',
          })}
          navigationAction={
            <Link startIcon={<ArrowLeft />} to="/">
              Retour
            </Link>
          }
        />

        <ContentLayout>
          {isLoading && <LoadingIndicatorPage>Plugin is loading</LoadingIndicatorPage>}
          {!isLoading ? (
            <Grid gap={4}>
              <GridItem col={4} >
                <TabGroup label="tabs_tasks" variant="simple" id="tabs">
                  <Tabs>
                    <Tab>OPEN</Tab>
                  </Tabs>
                  <TabPanels>
                    <TabPanel style={{ borderRadius: '4px' }}>
                      <Box color="neutral800" padding={3} background="neutral0">
                        <AccordionGroup
                          // error="The components contain error(s)" 
                          footer={
                            <Flex justifyContent="center" height="48px" background="primary100" border="primary-500">
                              <TextButton onClick={() => setModalNewTask(prev => !prev)} startIcon={<Plus />}>
                                Ajouter une nouvellle tâche
                              </TextButton>
                            </Flex>
                          }
                        >
                          <Accordion size="S" style={{ marginTop: '.5rem' }} variant="secondary" expanded={expanded} toggle={() => setExpanded(s => !s)} id="acc-3">
                            <AccordionToggle
                              togglePosition="left"
                              title="Tache 1 titre"
                              description="Tache 1 description"
                              action={
                                <>
                                  <SimpleMenu id="label" label={<Initials>{val}</Initials>} style={{
                                    marginRight: ".25rem"
                                  }}>
                                    <MenuItem id="menuItem-January" onClick={() => setValue('MF')}>
                                      <Initials>MF</Initials>
                                    </MenuItem>
                                    <MenuItem id="menuItem-February" onClick={() => setValue('GZ')}>
                                      <Initials>GZ</Initials>
                                    </MenuItem>
                                  </SimpleMenu>
                                  <IconButton onClick={() => setModalTask(prev => !prev)} label="Edit" icon={<Eye />} />
                                </>
                              }
                            />
                            <AccordionContent>
                              <Box padding={3}>
                                <Flex alignItems="center" style={{ justifyContent: "space-between" }}>
                                  <Typography variant="beta">Sous tâches</Typography>
                                  <Stack >
                                    <Select id="select1" placeholder="Filtrer par priorité" onClear={() => setValues([])} error={error} value={values} onChange={setValues} disabled={disabled} customizeContent={values => `${values.length} currently selected`} multi withTags>
                                      {Array(20).fill(null).map((_, i) => <Option key={i} value={`${i}`}>
                                        Another option
                                      </Option>)}
                                    </Select>
                                  </Stack>
                                </Flex>
                                <Flex direction="column">
                                  {entries.map(entry =>
                                    <Flex background="neutral100" paddingLeft={2} paddingRight={2} hasRadius alignItems="center" width="100%" style={{ width: '100%', justifyContent: 'space-between', margin: '.5rem' }}>
                                      <Box><Typography textColor="primary600" fontWeight="800">{entry.title}</Typography></Box>

                                      <Flex alignItems="center">
                                        <SimpleMenu id="label" label={<Initials>{val}</Initials>} style={{
                                          marginRight: ".25rem"
                                        }}>
                                          <MenuItem id="menuItem-January" onClick={() => setValue('MF')}>
                                            <Initials>MF</Initials>
                                          </MenuItem>
                                          <MenuItem id="menuItem-February" onClick={() => setValue('GZ')}>
                                            <Initials>GZ</Initials>
                                          </MenuItem>
                                        </SimpleMenu>
                                        <IconButton onClick={() => setModalTask(prev => !prev)} label="Edit" noBorder icon={<Eye />} />
                                      </Flex>
                                    </Flex>
                                  )}
                                </Flex>
                              </Box>
                            </AccordionContent>
                          </Accordion>
                        </AccordionGroup>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </GridItem>
            </Grid>
          ) : (
            <EmptyStateLayout />
          )}
        </ContentLayout>
        {/* <ConfirmDialog
          isConfirmButtonLoading={isConfirmButtonLoading}
          onConfirm={handleConfirmDelete}
          onToggleDialog={handleShowConfirmDelete}
          isOpen={showConfirmDelete}
        /> */}
        {modalTask && <ModalLayout onClose={() => setModalTask(prev => !prev)} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              Détails de la tâche
            </Typography>
          </ModalHeader>
          <ModalBody>

          </ModalBody>
          <ModalFooter startActions={<Button onClick={() => setModalTask(prev => !prev)} variant="tertiary">
            Annuler
          </Button>} endActions={<>
            <Button onClick={() => setModalTask(prev => !prev)}>Terminer</Button>
          </>} />
        </ModalLayout>}

        {modalNewTask && <ModalLayout onClose={() => setModalNewTask(prev => !prev)} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              Nouvelle Tâche
            </Typography>
          </ModalHeader>
          <ModalBody>

          </ModalBody>
          <ModalFooter startActions={<Button onClick={() => setModalNewTask(prev => !prev)} variant="tertiary">
            Annuler
          </Button>} endActions={<>
            <Button onClick={() => setModalNewTask(prev => !prev)}>Terminer</Button>
          </>} />
        </ModalLayout>}
      </Main>
    </Layout>
  );
};

export default memo(HomePage);