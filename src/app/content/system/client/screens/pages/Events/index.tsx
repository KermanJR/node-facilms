import React, { useContext, useEffect, useState } from 'react';
import BoxDash from "@src/app/components/system/BoxDash";
import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import Icon from "@src/app/theme/components/Icon/Icon";
import Text from "@src/app/theme/components/Text/Text";
import Image from '@src/app/theme/components/Image/Image';
import FileImage from '../../../../../../../../public/assets/icons/file.jpg';
import theme from '@src/app/theme/theme';
import { UserContext } from '@src/app/context/UserContext';
import BuffetService from '@src/app/api/BuffetService';
import TableHead from '@src/app/components/system/Table/TableHead';
import TableRow from '@src/app/components/system/Table/TableRow';
import TableCell from '@src/app/components/system/Table/TableCell';
import TableBody from '@src/app/components/system/Table/TableBody';
import moment from 'moment-timezone';




const Events = () => {
  const EventActionPopup = ({ onEdit, onDelete, styleSheet, selectedProposta }) => (
    <Box styleSheet={{ 
      display: 'flex',
      flexDirection: 'row',
      gap: '8px' ,
      borderRadius: '4px',
      padding: '4px',
      position: 'absolute',
      right: '-1rem',
      top: '-1rem',
      backgroundColor: theme.colors.neutral.x000,
      boxShadow: `0px 4px 4px 0px ${theme.colors.neutral.x050}`
      }}>
      <Icon name="trash" onClick={handleDelete} />
      <Icon name="eye" onClick={(e)=>openModal(selectedProposta)} />
    </Box>
  );

  const [propostas, setPropostas] = useState([])
  const [selectedProposta, setSelectedProposta] = useState([])

const {
  dataUser
} = useContext(UserContext)
  const theme = useTheme();
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [id, setId] = useState(null);
  const [nome, setNome] = useState(null);
  const [dataDisp, setDataDisp] = useState(null);
  const [qtdPessoas, setQtdPessoas] = useState(null);
  const [valor, setValor] = useState(null);
  const [obs, setObs] = useState(null);
  const [path, setPath] = useState(null);

  const openModal = (selectedProposta) => {
    console.log(selectedProposta)
    
    BuffetService.showBudgetsById(selectedProposta)
    .then(res=>{
      console.log(res)
      setSelectedProposta(res)
    }).catch(err=>{
      console.log(err)
    })
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleEdit = (index) => {
    //BuffetService.deleteEvento(index)

  };

  const handleDelete = (index) => {
    BuffetService.deleteEvento(index)
  };
  function DownloadLink(index){
    const fileURL = `https://buscabuffet.com.br${index}`;
    const newTab = window.open(fileURL, '_blank');
  }

  function converterData(dataOriginal) {
    const dataConvertida = moment(dataOriginal).format('DD/MM/YYYY');
    return dataConvertida;
  }
  
  useEffect(()=>{
    BuffetService.showEventsByStatus(dataUser?.['entidade']?.id)
    .then(res=>{
      setPropostas(res);
    }).catch(err=>{
      console.log(err)
    })
  }, [])

  


  const tiposEncontrados = {};
const eventosUnicos = [];

for (const evento of propostas) {
  if (!tiposEncontrados[evento.nome]) {
    tiposEncontrados[evento.nome] = true;
    eventosUnicos.push(evento);
  }
}

console.log(eventosUnicos);

  return (
    <Box styleSheet={{ display: "flex", flexDirection: "row", gap: "2rem", flexWrap: "wrap" }}>
      
      {isModalOpen &&(
        <Box styleSheet={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100}}>
        <Box styleSheet={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
        
          <button onClick={closeModal} style={{textAlign: 'left', fontWeight: 'bold'}}>X</button>
          <Box tag="table">
          <TableHead >
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row'}}>
              <TableCell>ID Orçamento</TableCell>
              <TableCell>Nome do Buffet</TableCell>
              <TableCell>Data Disponibilidade</TableCell>
              <TableCell>QTD. pessoas</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell>Arquivo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
           
              <TableRow styleSheet={{display: 'flex', flexDirection: 'row'}}>
                <TableCell>{selectedProposta?.['id']}</TableCell>
                <TableCell>{selectedProposta?.['entidade']?.nome}</TableCell>
                <TableCell>{converterData(selectedProposta?.['data_disponibilidade'])}</TableCell>
                <TableCell>{selectedProposta?.['evento']?.qtd_pessoas}</TableCell>
                <TableCell>{(selectedProposta?.['valor'])?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
                <Text styleSheet={{textAlign: 'left', color: 'black', width: '20%'}}>{selectedProposta?.['observacoes']}</Text>
                <TableCell styleSheet={{display: 'flex', justifyContent: 'center', alignItems: 'left'}}>
                  <Box onClick={(e)=>DownloadLink(selectedProposta?.['arquivo']?.path)}>
                    <Icon name="file" id='downloadLink' />
                  </Box>
                </TableCell>
              </TableRow>
            
          </TableBody>
        </Box>
        </Box>
      </Box>
      )}
      {eventosUnicos?.map((eventTitle, index) => (
        <BoxDash
          key={index}
          styleSheet={{
            display: "flex",
            flexDirection: "column",
            width: "201px",
            position: 'relative'
          }}
          onMouseEnter={() => setHoveredEvent(index)}
          onMouseLeave={() => setHoveredEvent(null)}
        >
          {hoveredEvent === index && (
            <EventActionPopup
            selectedProposta={eventTitle?.id_entidade}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
              styleSheet={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 10
              }}
            />
          )}
          
          <Box styleSheet={{
            width: "84px",
            height: "84px",
            borderRadius: "100%",
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={FileImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Text tag="p" styleSheet={{textAlign: 'center'}}>{eventTitle?.nome}</Text>
        </BoxDash>
      ))}
    </Box>
  );
};

export default Events;
