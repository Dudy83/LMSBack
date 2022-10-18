import React, { memo, useState, useEffect } from 'react';
import {  ContentLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { Select, Option } from '@strapi/design-system/Select';
import styled from 'styled-components';
import { Flex } from '@strapi/design-system/Flex';
import instance from '../../utils/axiosInstance';
import { DatePicker } from '@strapi/design-system/DatePicker';
import './style.css';
import { Box } from '@strapi/design-system/Box';
import { Accordion, AccordionToggle, AccordionContent, AccordionGroup } from '@strapi/design-system/Accordion';
import { Typography } from '@strapi/design-system/Typography';

const Margin = styled.div`
  margin: 10px 0;
`
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
const CardText = styled.h2`
  margin: 15px 0;
  font-size: ${props => props.theme.fontSizes[5]};
  font-weight: ${props => props.theme.fontWeights.bold};
`;
const CardContent = styled.div`
margin: 15px 0;
`;

const CardTitle = styled.h1`
font-size: ${props => props.theme.fontSizes[3]};
font-weight: ${props => props.theme.fontWeights.semiBold};
`;
const Utilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState([]);
  const [dateStart, setDateStart] = useState();
  const [dateEnd, setDateEnd] = useState();
  const [data,setData] = useState();


  useEffect(async () => {
    const Users = await getUser(values,dateStart,dateEnd);
    setData(Users);
    console.log('Users :>> ', Users);
    setUsers(["client","prospect"]);
    
  }, []);



  useEffect(async () => {
    const Users = await getUser(values,dateStart,dateEnd);
    setData(Users);
  }, [values,dateStart,dateEnd])

  const getUser = async (value,dateStart,dateEnd) => {
    try {
      const { data: response } = await instance.post('/dashboard/utilisateurs',{data : { type : value, createdAt_start : dateStart, createdAt_end : dateEnd}});
      console.log('response :>> ', response);
      return response;
    } catch (error) {
      console.error(error.message);
    }
  };


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
  return (
    <Main>
      <ContentLayout>
      <Flex marginTop={8}>

      <Left>
       
       <DatePicker  onChange={setDateStart} selectedDate={dateStart} label="Créé apres le" placeholder="01/01/2022" name="datepicker" clearLabel={'Réinitialiser'} onClear={() => setDateStart(undefined)} selectedDateLabel={formattedDate => `Date sélectionnée ${formattedDate}`}  minDate={new Date(2010, 1, 1)} maxDate={new Date(2030, 1, 1)}/>
       <DatePicker onChange={setDateEnd} selectedDate={dateEnd} label="Créé avant le" placeholder="01/01/2022" name="datepicker" clearLabel={'Réinitialiser'} onClear={() => setDateEnd(undefined)} selectedDateLabel={formattedDate => `Date sélectionnée ${formattedDate}`} minDate={new Date(2010, 1, 1)} maxDate={new Date(2030, 1, 1)} />
   
       </Left>
        <Right>
          <Select id="filter" placeholder="Filtrer par type d'utilisateurs" value={values} onChange={setValues} multi withTags>
            {users && users.map((user) => <Option key={user} value={user}>{user}</Option>)}
          </Select>
        </Right>
        </Flex>
        <Flex marginTop="50px" alignItems="stretch" className="flexBox" >
        {data && <Status status={data}></Status>}
          </Flex>
          <Box marginTop={8} background="neutral100">
          {data && <Type type={data}></Type>}
        </Box>
      </ContentLayout>
    </Main>
  );
};
const Type = (props) => {
  const { type } = props;

  return (
    <>
      {type && Object.keys(type).map((key, i) => {
                  const typeContent = type[key];

        return <Margin key={i}>
          <Typography variant="delta" fontWeight="semiBold">{key}</Typography>
          <AccordionGroup>
            {typeContent && typeContent.map((el) => <Content key={el.id} type={key} content={el}></Content>)}
          </AccordionGroup>
        </Margin>
      })}
    </>
  )
}

const Content = (props) => {
  const { content,type } = props;
  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState(null);
  const fetchContentInfo = async (id) => {
    try {
     
      return  {};
    } catch (error) {
      console.error(error.message);
    }
  }
  const email = ((content.email) ? content.email : " Aucun ")
  const phone = (type.includes("prospect")) ? ((content.phone) ? content.phone : " Aucun ") : (content.phoneNumber) ? content.phoneNumber : " Aucun "; 
  const title = (type.includes("prospect")) ? content.name + " / Email : " + email + " / Téléphone : " + phone : content.username + " / Email : " + email + " /  Téléphone : " +  phone;
  return (
    <Accordion expanded={open} onToggle={() => setOpen(s =>  {
      fetchContentInfo(content).then(res => setContents(res))
      return !s;
    })} size="S">
    {type.includes("prospect") ? <AccordionToggle togglePosition="left" title={title} />  : <AccordionToggle togglePosition="left" title={title} />}
      <AccordionContent>
        
      </AccordionContent>
    </Accordion>
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
              <CardText>{statusData.length} </CardText>
            </CardContent>
          </CardItem>
        })}
    </>
  )
}

export default Utilisateurs;