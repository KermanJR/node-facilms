"use client"

import BoxDash from "@src/app/components/system/BoxDash";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableBody from "@src/app/components/system/Table/TableBody";
import FilterTableTime from "@src/app/components/system/FilterTableTime";
import FileImage from '../../../../../../../public/assets/icons/file_doc.png'
import DolarYellowImage from '../../../../../../../public/assets/icons/dolar_yellow_svg.png'
import ActivityImage from '../../../../../../../public/assets/icons/activity_svg.png'
import Image from "@src/app/theme/components/Image/Image";
import Pagination from "@src/app/components/system/Pagination";
import { useContext, useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";

import moment from 'moment-timezone';
import Link from "next/link";
import { UserContext } from "@src/app/context/UserContext";
import ActivePageContext from "@src/app/context/ActivePageContext";
import { useFilterFunctions } from "../../../admin/screens/pages/common/useFilterFunctions";
import { FilterArrows } from "../../../admin/screens/pages/common/FilterArrows";


const Homedash = () =>{  

  const {
    setIdEvent,
    dataUser
  } = useContext(UserContext);
  
  const theme = useTheme();
  const [propostas, setPropostas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página


  
  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending,
    orderByStringGrowing,
    orderByStringDescending
    } = useFilterFunctions({hook: orcamentos, setHook: setOrcamentos})

  const {
    activePage,
    setActivePage
  } = useContext(ActivePageContext)



  const handleBuffetClick = (id) => {
    setIdEvent(id);
    setActivePage('Responda o orçamento')
  };

   const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

  };
  

  function converterData(dataOriginal) {
    const dataConvertida = moment(dataOriginal).format('DD/MM/YYYY');
    return dataConvertida;
  }

  const startIndex = (currentPage - 1) * elementsPerPage;
  const endIndex = startIndex + elementsPerPage;
  const currentPropostas = propostas.slice(startIndex, endIndex);


  useEffect(()=>{
    if(dataUser?.['entidade']?.id){
      BuffetService.showEventsByIdEntity(dataUser?.['entidade']?.id)
      .then((response)=>{
        setPropostas(response);
      })
    }
  }, [dataUser?.['entidade']?.id])

  useEffect(()=>{
    if(dataUser?.['entidade']?.id){
      BuffetService.showBudgetsByIdEntity(dataUser?.['entidade']?.id)
      .then((response)=>{
        setOrcamentos(response);
      }).catch(err=>{
        console.log(err)
      })
    }
  }, [dataUser?.['entidade']?.id])
  

  return(
    <Box styleSheet={{height: 'auto'}}>
      <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '2rem'}}>
        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '1.2rem', width: '25%'}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image src={ActivityImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box styleSheet={{width: '70%'}}>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{orcamentos?.length}</Text>
            <Text tag="p" color={theme.colors.neutral.x999} styleSheet={{width: '100%'}}>Orçamentos enviados</Text>
          </Box>
        </BoxDash>
        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '1.2rem', width: '25%'}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={FileImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box styleSheet={{width: '70%'}}>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{propostas?.length}</Text>
            <Text tag="p" color={theme.colors.neutral.x999} styleSheet={{width: '100%'}}>Solicitações de orçamentos recebidos</Text>
          </Box>
        </BoxDash>
        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '2rem', width: '45.2%', backgroundColor: theme.colors.secondary.x700}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={DolarYellowImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box styleSheet={{width: '90%'}}>
            <Text variant="heading3Bold" tag="p" color={theme.colors.neutral.x000}>Aviso</Text>
            <Text tag="p" color={theme.colors.neutral.x000} styleSheet={{width: '70%'}}>Não perca a oportunidade de continuar desfrutando de todos os benefícios! Renove sua assinatura.</Text>
          </Box>
        </BoxDash>
      </Box>

      <Box 
        styleSheet={{
        width: '100%',
        height: 'auto',
        marginTop: '2rem',
        padding: '2rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '.4rem',
      }}>
        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '2rem'}}>
          <Box>
            <Text variant='body3' styleSheet={{padding: '.5rem 0'}} color={theme.colors.neutral.x999}>Propostas Recentes</Text>
            <Text variant='caption' color={theme.colors.neutral.x800}>Consulte as propostas recentes</Text>
          </Box>
          <FilterTableTime setViewPayments={setPropostas} payments={propostas}/>
        </Box>

        <Box tag="table">
          <TableHead>
            <TableRow styleSheet={{justifyContent: 'center'}}>
              <TableCell>ID Proposta<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Data<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="update_at"/></TableCell>
              <TableCell>Nome do Evento<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="entidade.nome"/></TableCell>
              <TableCell>Qtd. Pessoas<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="qtd_pessoas"/></TableCell>
              <TableCell>Período<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="periodo"/></TableCell>
              <TableCell>Tipo do Evento<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="tipo"/></TableCell>
              <TableCell>Status<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
             
            </TableRow>
          </TableHead>

          <TableBody>
            
            {currentPropostas.map((item, index)=>(
              <Link href={`buffet/`} key={index} onClick={(e)=>handleBuffetClick(item?.id)}>
              <TableRow key={index} >
                <TableCell>{item?.['id']}</TableCell>
                <TableCell>{converterData(item?.['data_do_evento'])}</TableCell>
                <TableCell>{item?.['nome']}</TableCell>
                <TableCell>{item?.['qtd_pessoas']}</TableCell>

                {item?.['periodo'] === 'Manhã' && 
                <TableCell>Manhã</TableCell>
                }
                {item?.['periodo'] === 'Tarde' && 
                <TableCell>Tarde</TableCell>
                }
                {item?.['periodo'] === 'Noite' && 
                <TableCell>Noite</TableCell>
                }

                {item?.['tipo'] === "1"&& 
                <TableCell>Infantil</TableCell>
                }
                {item?.['tipo'] === "2" && 
                <TableCell>Domicílio</TableCell>
                }
                {item?.['tipo'] === "3" && 
                <TableCell>Casamento</TableCell>
                }
                {item?.['tipo'] === "4" && 
                <TableCell>Confraternização</TableCell>
                }

  
                <Box tag="td"
                  styleSheet={{
                    padding: '.7rem',
                    borderRadius: '10px',
                    backgroundColor: item?.status === 'Não clicou no whatsapp'? 
                    theme.colors.negative.x050 : theme.colors.positive.x050
                  }}    
                >
                  <Text styleSheet={{
                      color: item?.status === 'Não clicou no whatsapp'? 
                      theme.colors.negative.x300 : theme.colors.positive.x400,
                      textAlign: 'center'
                    }}
                  >
                    {item?.['status']}
                  </Text>
                 
                </Box>
              </TableRow>
              </Link>
            ))}
          </TableBody>
        </Box>
      </Box>
      <Pagination
        currentPage={currentPage}
        elementsPerPage={elementsPerPage}
        qtdElements={propostas.length}
        onPageChange={handlePageChange}
      />
    </Box>
  )
}

export default Homedash;
