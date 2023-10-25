import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import { useContext, useEffect, useState } from "react";
import Text from "@src/app/theme/components/Text/Text";
import Icon from "@src/app/theme/components/Icon/Icon";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import BannerAnotherPages from '../../../../../../public/assets/images/banner_another_pages.webp';
import Button from "@src/app/theme/components/Button/Button";
import Input from "@src/app/theme/components/Input/Input";
import { ModalContext } from "@src/app/context/ModalContext";
import ModalRegister from "../HomeScreen/Components/Modals/RegisterModal";
import ModalLogin from "../HomeScreen/Components/Modals/LoginModal";
import useSize from "@src/app/theme/helpers/useSize";
import InputDash from "@src/app/components/system/InputDash";
import Select from "@src/app/theme/components/Select/Select";
import ModalBudget from "../HomeScreen/Components/Modals/BudgetModal";
import BuffetService from "@src/app/api/BuffetService";
import { UserContext } from "@src/app/context/UserContext";

export default function BudgetByRegion(){

  
  const {

    isNovoModalOpen,
    closeNovoModal,
    isModalOpenBudget,
    openNovoModal,
    openBudgetModal,
    closeBudgetModal
  } = useContext(ModalContext)

  const {
    dataBuffet,
    dataUser,
    setDataUser
  } = useContext(UserContext)

     //Dados de configurações
     const [loadingState, setLoadingState] = useState(false);
     const [loadingCities, setLoadingCity] = useState(false);
     const size = useSize();
     const isMobile = useResponsive()
     const theme = useTheme();

     const [error, setError] = useState('');

    
  

    

    //Dados de endereços
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [neighbourhood, setNeighbourhood] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState(null);

    const [idUser, setIdUser] = useState('');

    const [nome, setNome] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [qtdPessoas, setQtdPessoas] = useState(null);
    const [tipo, setTipo] = useState("");
    const [status, setStatus] = useState("");
    const [idEntidade, setIdEntidade] = useState(null);
    const [periodo, setPeriodo] = useState("");
    const [idCidade, setIdCidade] = useState(null);
    const [bairro, setBairro] = useState("");
    const [dataDoEvento, setDataDoEvento] = useState("");
  

    const [idCidadesBuffets, setIdCidadesBuffet] = useState([]);


  

    const options = [
      {
        value: 'Período',
        label: 'Período'
      },
      {
        value: 'Manhã',
        label: 'Manhã'
      },
      {
        value: 'Tarde',
        label: 'Tarde'
      },
      {
        value:'Noite',
        label: 'Noite'
      }
    ]

    
    const optionsTipo = [
      {
        value: '0',
        label: 'Tipo de festa'
      },
      {
        value: '1',
        label: 'Infantil'
      },
      {
        value: '2',
        label: 'Domicílio'
      },
      {
        value: '3',
        label: 'Casamento'
      },
      {
        value: '4',
        label: 'Confraternização'
      }
    ]

    const handleStateChange = async (selectedOption?) => {
      setSelectedStateId(selectedOption);
      setLoadingCity(true)
      try {
        const stateIdentifier = selectedOption; // Use o ID ou o nome do estado
        const response = await BuffetService.getCitiesByState(stateIdentifier);
        let dadosFormatados = response?.map((cidade, index)=>({
          value: cidade?.id,
          label: cidade.nome
        }))
        dadosFormatados.unshift({
          value: '0',
          label: 'Selecione a cidade',
          disabled: true,
          selected: true,
        });
        setCities(dadosFormatados);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
      }
      setLoadingCity(false)
    };

    

    useEffect(() => {
      BuffetService.showStates()
        .then((response) => {
          setLoadingState(true)
          let dadosFormatados = response?.map((estado, index) => ({
            value: estado?.id,
            label: estado.nome
          }));
         
          let dadosOrdenados = dadosFormatados.sort((a, b) => a.label.localeCompare(b.label));
          dadosOrdenados.unshift({
            value: '0',
            label: 'Selecione o estado',
            selected: true,
            disabled: true
          });
          setStates(dadosOrdenados);
        
          setLoadingState(false)
        });

        handleStateChange();
    }, []);




    let idsCidadesIguais = [];
    const [cidadesIguais, setCidadesIguais] = useState([]);
    useEffect(() => {
      BuffetService.showBuffets()
        .then(res => {
          if(idCidade){
            res.map((item, index)=>{
              if(item.entidade.enderecos[0].endereco.cidade.id == idCidade){
                idsCidadesIguais.push(item.id_entidade)
              }else{
                
              }
            })
          }

          idsCidadesIguais = idsCidadesIguais?.filter((valor, indice, self) => {
            return self.indexOf(valor) === indice;
          });

          if (!idsCidadesIguais.includes(dataUser['entidade']?.id)) {
            idsCidadesIguais.unshift(dataUser['entidade']?.id);
          }
          setCidadesIguais(idsCidadesIguais)

      
        });
    }, [idCidade]);
    



   function handleSubmit(e){
      e.preventDefault()
      if(dataUser['usuario']?.id_perfil == 3){
        cidadesIguais.length > 1 && cidadesIguais.map((item, index)=>{
          let data = {
            "nome": nome,
            "observacoes":observacoes,
            "qtd_pessoas": qtdPessoas,
            "tipo": tipo,
            "status": String(cidadesIguais[0]),
            "id_entidade": item,
            "periodo": periodo,
            "id_cidade": idCidade,
            "bairro": bairro,
            "data_do_evento": `${dataDoEvento} 00:00:00`
          }
          BuffetService.sendEvento(data)
          .then(async res=>{
            console.log(res)
            await sendEmailToBuffet();
          }).catch(err=>{
            console.log(err)
          })
        })
        
      }else{
        setError('Faça Login como cliente para enviar orçamentos.')
      }
    }


    async function sendEmailToBuffet(){
      cidadesIguais?.map((item, index)=>{
        let data ={
          id_entidade: item,
          data: {
            "nome": nome,
            "observacoes":observacoes,
            "qtd_pessoas": qtdPessoas,
            "tipo": tipo,
            "status": String(cidadesIguais[0]),
            "id_entidade": item,
            "periodo": periodo,
            "id_cidade": idCidade,
            "bairro": bairro,
            "data_do_evento": `${dataDoEvento} 00:00:00`
          }
        }
        
      })
      
    }

    
    useEffect(()=>{
      let id = JSON.parse(localStorage.getItem('USER_ID'))
      if(id){
        BuffetService.getUserData(id)
        .then(res=>{
          setDataUser(res)
        })
        setIdUser(id)
      }
    }, [])

    useEffect(() => {
      const clearMessages = () => {
        setTimeout(() => {
          setError(null);
        }, 3000);
      };
  
      if (error) {
        clearMessages();
      }
    }, [error]);
  
   

  
    return(
        <Box tag="main"
          styleSheet={{
          alignItems: 'center',
          margin: '0 auto'
        }}
        >

          {/* Novo modal que será aberto */}
          {isNovoModalOpen &&(
            <ModalLogin isOpen={isNovoModalOpen} onClose={closeNovoModal} />
          )}

          {isModalOpenBudget &&(
            <ModalBudget isOpen={isModalOpenBudget} onClose={closeBudgetModal} />
          )}  

          {/*Banner Principal*/}      
          <Box styleSheet={{
              width: '100%',
              height: '281px',
              display: 'flex',
              textAlign: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              background: `url(${BannerAnotherPages.src})`,
              padding: `${isMobile ? '5rem': '6rem'}`,
              marginTop: '5rem'
          }}>
              <Text 
                tag="h1" 
                variant="heading1Bold" 
                styleSheet={{color: theme.colors.neutral.x000, fontSize: !(size < 600) ? '2.5rem' : '1.5rem'}}
              >
                  Faça seu orçamento
              </Text>
          </Box> 

            <Box styleSheet={{
              width: size <= 820? '95%':'45%',
              padding:  size <= 820? '2rem':'2rem 3rem',
              marginTop: '4rem',
              borderRadius: '8px',
              boxShadow: `2px 2px 10px 2px ${theme.colors.neutral.x050}`
            }}>
              <Text variant="heading4Bold" styleSheet={{textAlign: 'left'}} color={theme.colors.primary.x500}>
                Evento
              </Text>
              <Box tag="form" styleSheet={{marginTop: '.5rem'}}    onSubmit={handleSubmit}>
                <Box styleSheet={{
                  display: 'grid',
                  gridTemplateColumns:  size <= 820? '1fr':'65% 33%',
                  gap: '1rem',
                  paddingTop: '1rem'
                }}>
                  <InputDash  
                  required={true}
                  onChange={(e)=>setNome(e)}
                    type="text" placeholder="Nome do evento" styleSheet={{padding: '.5rem', borderRadius: '5px', backgroundColor: theme.colors.neutral.x050}}/>
                  <InputDash type="number" onChange={(e)=>setQtdPessoas(e)} placeholder="Quantidade de pessoas" styleSheet={{padding: '.5rem',  borderRadius: '5px', backgroundColor: theme.colors.neutral.x050}}/>
                </Box>
                <Box styleSheet={{
                  display: 'grid',
                  gridTemplateColumns:  size <= 820? '1fr':'49% 49%',
                  gap: '1rem',
                  paddingTop: '1rem'
                }}>
                  <label htmlFor="dateInput" style={{width: '100%'}}>
                    <input id="dateInput" name="dateInput" type="date" placeholder="Data do evento"  onChange={(e)=>setDataDoEvento(e.target.value)} style={{borderRadius: '5px', backgroundColor: theme.colors.neutral.x050, padding: '.5rem', color: 'black', height: '48px', width: '100%'}}/>
                  </label>
                  <Select 
                  
                    options={options}
                    onChange={(e)=>setPeriodo(e)}
                    styleSheet={{
                      borderRadius: '5px',
                      backgroundColor: theme.colors.neutral.x050,
                      color: 'black',
                      fontSize: '.875rem',
                      padding: '.8rem',
                      border: 'none'
                    }}
                  />
                </Box>
                <Box styleSheet={{
                  display: 'grid',
                  gridTemplateColumns:  size <= 820? '1fr':'49% 49%',
                  gap: '1rem',
                  paddingTop: '1rem'
                }}>
                  <Select 
                    options={optionsTipo}
                    onChange={(e)=>setTipo(e)}
                    styleSheet={{
                      borderRadius: '5px',
                      backgroundColor: theme.colors.neutral.x050,
                      color: 'black',
                      fontSize: '.875rem',
                      padding: '.8rem',
                      border: 'none'
                    }}
                  />
                  <Select
                    onChange={handleStateChange}
                    loading={loadingState}
                    value={states.find((state) => state.value === selectedStateId)}   
                    options={states} 
                    styleSheet={{
                        padding: '.5rem',
                        borderRadius: '5px',
                        fontSize: '.875rem',
                        border: 'none',
                        backgroundColor: theme.colors.neutral.x050
                      }}
                  />
                </Box>
                <Box styleSheet={{
                  display: 'grid',
                  gridTemplateColumns:  size <= 820? '1fr':'49% 49%',
                  gap: '1rem',
                  paddingTop: '1rem'
                }}>
                  <Select
                   loading={loadingCities}
                   onChange={(e)=>setIdCidade(e)}
                    options={cities} 
                    styleSheet={{
                      padding: '.5rem',
                      fontSize: '.875rem',
                      borderRadius: '5px',
                        backgroundColor: theme.colors.neutral.x050, border: 'none'
                      }}
                  />
                  
                  <InputDash onChange={(e)=>setBairro(e)} type="text" required={true} placeholder="Bairro" styleSheet={{padding: '.5rem',  borderRadius: '5px', backgroundColor: theme.colors.neutral.x050}}/>
                </Box>
                
                <Box styleSheet={{paddingTop: '1rem'}}>
                  <InputDash 
                  onChange={(e)=>setObservacoes(e)}
                  required={true}
                    tag="textarea"  
                    placeholder="Observações: Descreva detalhadamente o que precisa para seu evento." 
                    styleSheet={{height: '133px',padding: '.5rem',  borderRadius: '5px', backgroundColor: theme.colors.neutral.x050, width: 'auto'}}/>
                </Box>

                <Button  
                  variant="contained"
                  colorVariant="secondary"
                  type="submit"
               
                  styleSheet={{
                    marginTop: '1rem',
                    alignSelf: 'center',
                    boxShadow: `1px 2px 5px 1px ${theme.colors.neutral.x200}`,
                    fontWeight: 'normal'
                  }}
                >Enviar para todos os buffets da região
              </Button>
              {error ? <Text styleSheet={{color:' red', textAlign: 'center', marginTop: '1rem', fontSize: '.875rem'}}>{error}</Text>: ''}
              </Box>
              {
                idUser == null || idUser == undefined || idUser == '' ? 
                <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', marginTop: '1rem', alignSelf: 'center'}}>
                <Text styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Ainda não tem uma conta?</Text>
                <Box onClick={openBudgetModal} styleSheet={{cursor: 'pointer'}}>
                  <Text styleSheet={{color: theme.colors.secondary.x500}}>Cadastre-se</Text>
                </Box>
              </Box>:''
                
              }
              
            </Box>
          <Box>
        </Box>
      </Box>
    )

}
