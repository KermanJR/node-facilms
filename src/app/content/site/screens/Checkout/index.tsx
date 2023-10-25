import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import { useContext, useEffect, useState} from "react";
import Text from "@src/app/theme/components/Text/Text";
import Icon from "@src/app/theme/components/Icon/Icon";
import Button from "@src/app/theme/components/Button/Button";
import Input from "@src/app/theme/components/Input/Input";
import { useRouter } from "next/router";
import { ModalContext } from "@src/app/context/ModalContext";
import ModalRegister from "../HomeScreen/Components/Modals/RegisterModal";
import ModalLogin from "../HomeScreen/Components/Modals/LoginModal";
import useSize from "@src/app/theme/helpers/useSize";
import ModalBudget from "../HomeScreen/Components/Modals/BudgetModal";
import Link from "@src/app/theme/components/Link/Link";
import { UserContext } from "@src/app/context/UserContext";
import useFormatarMoeda from "@src/app/theme/helpers/useFormatarMoeda";
import PagBankService from "@src/app/api/PagBankService";
import BuffetService from "@src/app/api/BuffetService";
export default function Checkout(){

  const [userNameBuffet, setUserNameBuffet] = useState('');
  const [valuePlan, setValuePlan] = useState('');
  const [namePlan, setNamePlan] = useState('');
  const [plansPagBank, setPlansPagBank] = useState([]);
  const [plansAdmin, setPlansAdmin] = useState([]);
  //Dados do assinante
  const [nomeAssinante, setNomeAssinante] = useState<string>('');
  const [emailAssinante, setEmailAssinante] = useState<string>('');
  const [documentoAssinante, setDocumentoAssinante] = useState<string>('');
  const [telefoneAssinante, setTelefoneAssinante] = useState<string>('');
  const [dataNascimentoAssinante, setDataNascimentoAssinante] = useState<string>('');
  const [enderecoAssinante, setEnderecoAssinante] = useState('');

  //Hooks
    const size = useSize();
    const theme = useTheme();
    const formatarMoeda = useFormatarMoeda();
    const router = useRouter();


  //Functions
    const navigatePlans = (e: any)=>{
      e.preventDefault();
      router.push('/dashboard/buffet')
    }


      // Verifique se o usuário fez o cadastro e selecionou um plano
  /*if (!user || !user.cadastrado || !user.planoSelecionado) {
    // Redirecione o usuário para outra página (por exemplo, a página de cadastro)
    router.push('/cadastro');
    return null; // Não renderize nada nesta página
  }*/

  //Context
    const {
      isNovoModalOpen,
      closeNovoModal,
      isModalOpenBudget,
      closeBudgetModal
    } = useContext(ModalContext)

    const {
      selectedPlan,
      dataUser
    } = useContext(UserContext);


    
    
    async function createSignature(res){
      console.log(res)
      const data = {
        amount: {currency: 'BRL'},
        plan: {
          id: ''
        },
        payment_method:[{type: 'CREDIT_CARD', card: {num: '123'}}],
      }
      PagBankService.createSignature(data)
        .then(async res=>{
          if(res){
            await createSignatureBuffet(res);
            console.log(res);
          }
        })
        .then(err=>{
          console.log(err)
        })
    }

    function createSignatureBuffet(details){
   
      const data = {
        "tipo": "M",
        "status": "Aprovado",
        "valor": Number(localStorage?.getItem('VALUE_PLAN')),
        "desconto": 1.22,
        "id_plano": localStorage?.getItem('ID_PLAN'),
        "id_entidade": dataUser?.['result']?.user?.id_entidade
    }
      PagBankService.createSignatureInBuffet(data)
        .then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
    }

    function handleSubmit(e){
      e.preventDefault();
      const data = {
        name: nomeAssinante,
        email: emailAssinante,
        tax_id: documentoAssinante,
        phones: [{
          country: '55',
          area: '',
          number: ''
        }],
        birth_date: dataNascimentoAssinante
      }
      PagBankService.createCustomer({data})
        .then(async res=>{
          if(res){
            await createSignature(res);
            console.log(res);
          }
        
        })
        .then(err=>{
          console.log(err)
        })
    }

    useEffect(()=>{
      const user = window.localStorage.getItem('USER_NAME');
      const valuePlan = window.localStorage.getItem('VALUE_PLAN');
      const namePlan = window.localStorage.getItem('NAME_PLAN');
      setValuePlan(valuePlan);
      setUserNameBuffet(user);
      setNamePlan(namePlan)


      PagBankService.getPlansPagBank()
        .then((response)=>{
          setPlansPagBank(response)
        })

        BuffetService.showPlans()
        .then((response)=>{
          setPlansAdmin(response)
        })
    }, [])



    return(
        <Box tag="main"
            styleSheet={{
            alignItems: 'center',
            margin: '0 auto'
        }}>
        
       {/* Novo modal que será aberto */}
       {isNovoModalOpen &&(
            <ModalLogin isOpen={isNovoModalOpen} onClose={closeNovoModal} />
          )}

          {isModalOpenBudget &&(
            <ModalBudget isOpen={isModalOpenBudget} onClose={closeBudgetModal} />
          )}  




          <Box styleSheet={{
              display:'flex',
              flexDirection: 'row',
              flexWrap:  size <= 820? 'wrap':'no-wrap',
              margin: '4rem auto',
              width: size <= 820? '100%':'80%',
              gap: '6rem',
              padding: size <= 820? '.5rem':'3rem',
            }}
            tag="form" 
                onSubmit={handleSubmit}
          >

            {/*Primeiro Bloco*/}
            <Box styleSheet={{
              width: size <= 820? '100%':'50%',
            }}>
              <Text variant="heading5semiBold" styleSheet={{textAlign: 'left', padding: '.5rem 0'}} color={theme.colors.primary.x500}>
                Confirme a sua assinatura
              </Text>
              <Text variant="body1" styleSheet={{textAlign: 'left', padding: '.5rem'}} color={theme.colors.neutral.x300}>
                {dataUser && dataUser?.['nome']? 
                  dataUser?.['nome']
                  : 
                  userNameBuffet
                }, você selecionou o <Text tag="label" color={theme.colors.primary.x500}>Plano {selectedPlan['nome']? selectedPlan['nome'] : namePlan} !</Text>
              </Text>

              <Box 
                styleSheet={{
                  marginTop: '.5rem',
                  boxShadow: `0px 8px 40px 0px ${theme.colors.neutral.x100}`,
                  borderRadius: '12px',
                  padding: '2rem'
                }}  
              >
                <Box>
                  <Text styleSheet={{paddingBottom: '1.5rem'}}>Detalhes do Assinante</Text>
                  <Box styleSheet={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <Input 
                      type="text"
                      required={true}
                      onChange={(e)=>setNomeAssinante(e)}
                      placeholder="Nome:"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    />
                    <Input 
                      type="email"
                      required={true}
                      onChange={(e)=>setEmailAssinante(e)}
                      placeholder="E-mail:"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    />
                  </Box>
                </Box>

                <Box styleSheet={{marginTop: '1rem'}}>
                  <Box styleSheet={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <Input 
                      type="text"
                      required={true}
                      onChange={(e)=>setDocumentoAssinante(e)}
                      placeholder="Documento"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    />
                    <input 
                      type="date"
                      required={true}
                      onChange={(e)=>setDataNascimentoAssinante(e.target.value)}
                      placeholder="Data de Nascimento"
                      style={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    />
                  </Box>
                </Box>

                <Box styleSheet={{marginTop: '1rem'}}>
                  <Box styleSheet={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <Input 
                      type="phone"
                      required={true}
                      onChange={(e)=>setTelefoneAssinante(e)}
                      placeholder="Telefone"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    />
                  </Box>
                </Box>
                
              

                

                <Box styleSheet={{paddingTop: '1rem', width: '100%'}}>
                  <Text styleSheet={{padding: '1rem 0'}}>Detalhes do Pagamento</Text>
                  <Box styleSheet={{
                    display: 'grid',
                    gap: '0.67rem',
                    gridTemplateColumns: size <= 820? '1fr ':'repeat(3, 32%)',
                    }}
                  >
                    <Input 
                      type="text"
                      required={true}
                      placeholder="Nº do Cartão"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                    <Input 
                      type="text"
                      required={true}
                      placeholder="Data de Validade"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                    <Input 
                      type="text"
                      required={true}
                      placeholder="CVV"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                </Box>
              </Box>

                <Box styleSheet={{
                  display: 'grid',
                  gap: '0.67rem',
                  gridTemplateColumns: size <= 820? '1fr ':'repeat(3, 32%)',
                  paddingTop: '0.67rem'
                }}>
                  <Input 
                    type="text"
                    required={true}
                    placeholder="Endereço"
                    styleSheet={{
                      padding: '.5rem',
                      backgroundColor: theme.colors.neutral.x050,
                      borderRadius: '6px'
                    }}
                  />
                  <Input 
                      type="text"
                      required={true}
                      placeholder="Cidade"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                    <Input 
                      type="text"
                      required={true}
                      placeholder="Estado"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                    <Input 
                      type="text"
                      required={true}
                      placeholder="CEP"
                      styleSheet={{
                        padding: '.5rem',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    
                    />
                </Box>
              </Box>
            </Box>


            {/*Segundo Bloco*/}
            <Box styleSheet={{
              width: size <= 820? '100%':'40%',
            }}>
              <Box styleSheet={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '1rem',
                width: size <= 820? '70%':'50%',
                margin: '0 auto',
                padding: '1rem 0'
              }}>
                <Box styleSheet={{
                  borderRadius: '100%',
                  width: '6.3vh',
                  height: '6.3vh',
                  backgroundColor: theme.colors.primary.x500,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text variant="body2" styleSheet={{color: theme.colors.neutral.x000}}>1</Text>
                </Box>
                <Box styleSheet={{
                  borderRadius: '100%',
                  width: '6.3vh',
                  height: '6.3vh',
                  backgroundColor: theme.colors.neutral.x000,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text variant="body2" styleSheet={{color: theme.colors.neutral.x100}}> - - - - - - -</Text>
                </Box>
                <Box styleSheet={{
                  borderRadius: '100%',
                  width: '6.3vh',
                  height: '6.3vh',
                  backgroundColor: theme.colors.neutral.x100,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text variant="body2" styleSheet={{color: theme.colors.neutral.x000}}>2</Text>
                </Box>
                <Box styleSheet={{
                  borderRadius: '100%',
                  width: '6.3vh',
                  height: '6.3vh',
                  backgroundColor: theme.colors.neutral.x000,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text variant="body2" styleSheet={{color: theme.colors.neutral.x100}}> - - - - - - -</Text>
                </Box>
                <Box styleSheet={{
                  borderRadius: '100%',
                  width: '6.3vh',
                  height: '6.3vh',
                  backgroundColor: theme.colors.neutral.x100,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text variant="body2" styleSheet={{color: theme.colors.neutral.x000}}>3</Text>
                </Box>
              </Box>
              <Box
                styleSheet={{
                  marginTop: '.5rem',
                  backgroundColor: theme.colors.primary.x500,
                  borderRadius: '12px',
                  padding: '2rem'
                }}>
                <Text variant="body2" styleSheet={{textAlign: 'left', padding: '.5rem 0'}} color={theme.colors.neutral.x000}>
                  Valor da Assinatura
                </Text>
                <Text variant="heading2semiBold" styleSheet={{textAlign: 'left', padding: '.5rem 0'}} color={theme.colors.secondary.x700}>
                  { selectedPlan && selectedPlan?.['valor_mensal']? formatarMoeda(selectedPlan?.['valor_mensal']) : valuePlan}
                </Text>
                <Input 
                    type="text"
                    required={true}
                    placeholder="CUPOM DE DESCONTO"
                    styleSheet={{
                      padding: '.5rem',
                      backgroundColor: theme.colors.neutral.x050,
                      borderRadius: '6px',
                    }}
                  />
                <Text variant="body1" styleSheet={{textAlign: 'left', padding: '.5rem 0'}} color={theme.colors.neutral.x000}>
                  INFORMAÇÕES DO CARD
                </Text>
                <Box styleSheet={{
                  backgroundColor: theme.colors.primary.x600,
                  padding: '1rem',
                  borderRadius: '6px',
                  marginTop: '.5rem'
                }}>
                  <Icon name="default_icon" fill={theme.colors.neutral.x000}/>
                  <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '.4rem', flexWrap: 'wrap'}}>
                    <Text variant="body1" styleSheet={{textAlign: 'left', width: '95%'}} color={theme.colors.neutral.x000}>
                      Ao contratar nossos serviços, você concorda com o 
                    </Text>
                    
                    <Link
                        href='/assets/Contrato_de_Intermediacao.pdf'
                        target="_blank"
                        styleSheet={{color: theme.colors.secondary.x800, textDecoration: `underline 1px ${theme.colors.secondary.x700}`}}
                    >
                      Contrato
                    </Link>
                  </Box>
                </Box>
              </Box>
              <Box styleSheet={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                flexDirection: 'row',
                gap: '2rem'
              }}>
                <Button 
                  fullWidth 
                  type="submit"
                  variant="contained"
                  styleSheet={{
                    padding: '1rem', 
                    marginTop: '1rem',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.neutral.x050,
                    color: theme.colors.secondary.x500
                }}>
                  Cancelar
                </Button>
                <Button 
                  fullWidth
                  variant="contained"
                  colorVariant="secondary"
                  type="submit"
                  styleSheet={{
                    padding: '1rem',
                    marginTop: '1rem',
                    borderRadius: '10px'
                  }}>
                    Concluir assinatura
                </Button>
              </Box>
              
            </Box>

          <Box>

        </Box>
      </Box>
    </Box>
    )

}
