import React, { memo, useState, useCallback, createRef } from 'react';

import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
import { FieldInput } from '@strapi/design-system/Field';

import { Box } from '@strapi/design-system/Box';
import { Main } from '@strapi/design-system/Main';
import Dropzone from 'react-dropzone'
import { useDropzone } from 'react-dropzone'


import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Typography } from '@strapi/design-system/Typography';
import './style.css';
const Import = () => {

  const [items, setItems] = useState([])
  const file = {
    display: 'flex',
    justifyContent: 'center',


  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })

  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const dropzoneRef = createRef();
  const openDialog = () => {

    if (dropzoneRef.current) {
      dropzoneRef.current.open()
    }
  };

  return (
    <Main>

      <Box padding={4} >
        <TabGroup label="Some stuff for the label" id="tabs" onTabChange={selected => console.log(selected)}>
          <Tabs>
            <Tab>Utilisateurs</Tab>
            <Tab>Prospects</Tab>
            <Tab>Formations</Tab>
            <Tab>Blog</Tab>
          </Tabs>
          <TabPanels>
            <TabPanel>

              <Box color="neutral800" padding={4} background="neutral0" >
                <Typography padding={2} variant="beta">Exemple du modèle à importer*</Typography>

                <Table colCount={60} rowCount={8} >
                  <Thead>
                    <Tr>
                      <Th>
                        <Typography variant="sigma">Nom</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Téléphone</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Email</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Formation(s)</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Status</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Profession</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Attrbution</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Session(s)</Typography>
                      </Th>

                    </Tr>
                  </Thead>

                </Table>
              </Box>
              <Box style={file} color="neutral800" padding={4} background="neutral0" >
                <Dropzone onDrop={onDrop} ref={dropzoneRef} className="dropzone" noClick noKeyboard>
                  {({ getRootProps, getInputProps, acceptedFiles }) => {
                    return (
                      <div className="container">
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <button
                            type="button"

                            className="button"
                            onClick={openDialog}
                          >
                            <p>Glisser / Déposer votre fichier</p>


                          </button>
                        </div>
                        <aside>
                          <h4>Fichiers</h4>
                          <ul>
                            {acceptedFiles.map(file => (
                              <li key={file.path}>
                                {file.path} - {file.size} bytes
                              </li>
                            ))}
                          </ul>
                        </aside>
                      </div>
                    );
                  }}
                </Dropzone>


              </Box>

            </TabPanel>
            <TabPanel>

              <Box color="neutral800" padding={4} background="neutral0" >
                <Typography padding={2} variant="beta">Exemple du modèle à importer*</Typography>

                <Table colCount={60} rowCount={8} >
                  <Thead>
                    <Tr>
                      <Th>
                        <Typography variant="sigma">Nom</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Téléphone</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Email</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Formation(s)</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Status</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Profession</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Attrbution</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Source</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Fournisseur</Typography>
                      </Th>
                    </Tr>
                  </Thead>

                </Table>
              </Box>
              <Box style={file} color="neutral800" padding={4} background="neutral0" >
                <Dropzone onDrop={onDrop} ref={dropzoneRef} className="dropzone" noClick noKeyboard>
                  {({ getRootProps, getInputProps, acceptedFiles }) => {
                    return (
                      <div className="container">
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <button
                            type="button"
                            className="button"
                            onClick={openDialog}
                          >
                            <p>Glisser / Déposer votre fichier</p>


                          </button>
                        </div>
                        <aside>
                          <h4>Fichiers</h4>
                          <ul>
                            {acceptedFiles.map(file => (
                              <li key={file.path}>
                                {file.path} - {file.size} bytes
                              </li>
                            ))}
                          </ul>
                        </aside>
                      </div>
                    );
                  }}
                </Dropzone>


              </Box>

            </TabPanel>
            <TabPanel>

              <Box color="neutral800" padding={4} background="neutral0" >
                <Typography padding={2} variant="beta">Exemple du modèle à importer*</Typography>

                <Table colCount={60} rowCount={8} >
                  <Thead>
                    <Tr>
                      <Th>
                        <Typography variant="sigma">Titre</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Catégorie</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Prix</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Description</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Objectifs</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Temps Cours (min)</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Enseignant</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Référence</Typography>
                      </Th>



                    </Tr>
                  </Thead>

                </Table>
              </Box>
              <Box style={file} color="neutral800" padding={4} background="neutral0" >
                <Dropzone onDrop={onDrop} ref={dropzoneRef} className="dropzone" noClick noKeyboard>
                  {({ getRootProps, getInputProps, acceptedFiles }) => {
                    return (
                      <div className="container">
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <button
                            type="button"
                            className="button"
                            onClick={openDialog}
                          >
                            <p>Glisser / Déposer votre fichier</p>


                          </button>
                        </div>
                        <aside>
                          <h4>Fichiers</h4>
                          <ul>
                            {acceptedFiles.map(file => (
                              <li key={file.path}>
                                {file.path} - {file.size} bytes
                              </li>
                            ))}
                          </ul>
                        </aside>
                      </div>
                    );
                  }}
                </Dropzone>


              </Box>
            </TabPanel>
            <TabPanel>

              <Box color="neutral800" padding={4} background="neutral0" >
                <Typography padding={2} variant="beta">Exemple du modèle à importer*</Typography>

                <Table colCount={60} rowCount={4} >
                  <Thead>
                    <Tr>
                      <Th>
                        <Typography variant="sigma">Titre</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Catégorie</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Tags</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Contenu</Typography>
                      </Th>




                    </Tr>
                  </Thead>

                </Table>
              </Box>
              <Box style={file} color="neutral800" padding={4} background="neutral0" >
                <Dropzone onDrop={onDrop} ref={dropzoneRef} className="dropzone" noClick noKeyboard>
                  {({ getRootProps, getInputProps, acceptedFiles }) => {
                    return (
                      <div className="container">
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <button
                            className="button"
                            type="button"
                            onClick={openDialog}
                          >
                            <p>Glisser / Déposer votre fichier</p>


                          </button>
                        </div>
                        <aside>
                          <h4>Fichiers</h4>
                          <ul>
                            {acceptedFiles.map(file => (
                              <li key={file.path}>
                                {file.path} - {file.size} bytes
                              </li>
                            ))}
                          </ul>
                        </aside>
                      </div>
                    );
                  }}
                </Dropzone>


              </Box>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Box>
    </Main>

  );
};

export default Import;
