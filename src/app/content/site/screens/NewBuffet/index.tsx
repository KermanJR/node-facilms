"use client"

import { ModalContext } from "@src/app/context/ModalContext";
import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Image from "@src/app/theme/components/Image/Image";
import Input from "@src/app/theme/components/Input/Input";
import Link from "@src/app/theme/components/Link/Link";
import Text from "@src/app/theme/components/Text/Text";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import IconPassword from '../../../../../../public/assets/icons/password_svg.jpg'
import IconUser from '../../../../../../public/assets/icons/user_svg.jpg'
import IconEmail from '../../../../../../public/assets/icons/email_svg.jpg'
import IconCnpj from '../../../../../../public/assets/icons/cil_building.jpg'
import { UserContext } from "@src/app/context/UserContext";
import BuffetService from "@src/app/api/BuffetService";
import { BsCheck } from "react-icons/bs";
import useSize from "@src/app/theme/helpers/useSize";
import ModalBudget from "../HomeScreen/Components/Modals/BudgetModal";
import ModalLogin from "../HomeScreen/Components/Modals/LoginModal";
import FundoLogin from '../../../../../../public/assets/images/fundo-login.jpg';
export default function NewBuffet() {

  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    setEmail,
    setNome,
    setPassword,
    setDocumento,
    nome,
    email,
    documento,
    password,
    setDataUser
  } = useContext(UserContext);

  const {
    isModalOpen,
    closeModal,
    isNovoModalOpen,
    closeNovoModal,
    closeBudgetModal,
    isModalOpenBudget
  } = useContext(ModalContext)

  
  const theme = useTheme();
  const size = useSize()
  const router = useRouter();

  
  const {
    openNovoModal,
    setModalOpen
  } = useContext(ModalContext)



  const handleSubmit = (e) => {
    e.preventDefault();
    const buffetData = {
        nome: nome,
        email: email,
        password: password,
        documento: documento,
        id_perfil: 2
    };

    try{
      BuffetService.createUser(buffetData)
      .then(res => {
        if(res.result.status){
          setResponse(res);
          setDataUser(res)
          setModalOpen(false)
          window.localStorage.setItem('ID_ENTITY', res?.result?.entidade?.id);
          window.localStorage.setItem('USER_NAME', res?.result?.entidade?.nome);
          window.localStorage.setItem('USER_TOKEN', res?.token?.token);
          router.push('/planos')
        }else{
          console.log(res)
        }
      })
      .catch(err => {
          console.log(err)
          setError(err);
      });
    }catch(err){
      console.log(err)
    }

   
  };

  return (
    <Box styleSheet={{ 
    backgroundColor:theme.colors.neutral.x050, 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr',
     flexWrap: 'wrap', 
     flexDirection: 'row', 
     justifyContent: 'space-evenly',
      gap: (size < 910) && '30px', paddingTop: !(size < 910) ? '90px' : '60px', height: '80vh'}}>
       {/* Novo modal que será aberto */}
       {isNovoModalOpen &&(
            <ModalLogin isOpen={isNovoModalOpen} onClose={closeNovoModal} />
          )}

          {isModalOpenBudget &&(
            <ModalBudget isOpen={isModalOpenBudget} onClose={closeBudgetModal} />
          )}  
      <Box styleSheet={{
        display: 'flex',
        flexDirection: 'column',
        gap: (!(size < 1230) ? '15%' : !(size < 910) ? '5%' : '20px'),
        marginLeft: (!(size < 1230) ? '0' : '0px'),
        marginBottom: '-65px',
        padding: (!(size < 1230) ? '75px' : !(size < 410) ? '50px 30px' : '30px 0px'),
        backgroundImage: `URL(${FundoLogin.src})`,
        backgroundPosition: 'left bottom',
        backgroundSize: 'cover',
        height: 'auto'
      }}>
        <Text tag={!(size < 1230) ? "h3" : 'h5'} variant={!(size < 1230) ? "heading3semiBold" : "heading5semiBold"} color="#fff" styleSheet={{textAlign: 'center'}}>EXPERIMENTE GRÁTIS POR 90 DIAS</Text>
        <ul>
          <li style={{display: 'flex', width: 'auto', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Seu negócio exposto para o público alvo do seu negócio.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Receba solicitações de orçamento.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Plataforma intuitiva para gestão dos clientes.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Perfil exclusivo para sua empresa.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Sem fidelidade, cancele quando quiser.</p>
          </li>
        </ul>
      </Box>
      <Box
        styleSheet={{

          marginTop: '65px',
          padding: '1rem 2rem',
          borderRadius: '1rem',
          height: 'auto', 

        }}
      >
        <Box tag="form" styleSheet={{display: 'flex', flexDirection: 'column', gap: '0.7rem', marginLeft: '13rem', width: '60%'}} onSubmit={handleSubmit}>
          <Box styleSheet={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignSelf: 'center', padding: '0', width: '100%'}}>
            <Text variant="heading5semiBold">Quer começar a anunciar seu espaço?</Text>
            <Text variant="small" styleSheet={{width: '90%', textAlign: 'center', margin: '0 auto'}}>
              Crie sua conta abaixo, ative sua conta, adicione as informações do seu espaço
              e aproveite dos benefícios!
            </Text>
          </Box>

          <Box>
            <span style={{display: 'inline-block', width: '50%', height: '3px', margin: '10px auto', backgroundColor: '#EA760A88'}}></span>
          </Box>

          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.585rem'}}>
            <Image src={IconEmail.src} alt="" styleSheet={{width: '29px'}}/>
            </Box>
            <Input 
              type="email" 
              required={true}
              placeholder="Insira seu e-mail"
              onChange={(e)=>setEmail(e)}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.5rem .8rem',
                border: 'none'
              }}
            />
          </Box>
          
          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
            <Image src={IconUser.src} alt="" styleSheet={{width: '29px'}}/>
            </Box>
            <Input 
              type="text" 
              required={true}
              placeholder="Nome do seu espaço"
              onChange={(e)=>setNome(e)}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.5rem .8rem',
                border: 'none',
                filter: 'dropShadow(0px 8px 40px rgba(0, 0, 0, 0.05))'
              }}
            />
          </Box>

          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
              <Image src={IconPassword.src} alt="" styleSheet={{width: '29px'}}/>
            </Box>
            <Input 
              type="password" 
              required={true}
              placeholder="Insira sua senha"
              onChange={(e)=>setPassword(e)}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.5rem .8rem',
                border: 'none'
              }}
            />
          </Box>
          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
              <Image src={IconCnpj.src} alt="" styleSheet={{width: '24px'}}/>
            </Box>
            <Input 
              type="text" 
              required={true}
              placeholder="CNPJ"
              onChange={(e)=>setDocumento(e)}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.5rem .8rem',
                border: 'none',
                boxShadow: '(0px 8px 40px rgba(0, 0, 0, 0.05))'
              }}
            />
          </Box>

          <Box styleSheet={{display: 'grid', gridTemplateColumns: '2fr 30fr', padding: '0.5rem'}}>
              <Input type="checkbox" styleSheet={{width: '15px', height: '15px'}} required={true}/>
              <Text variant="body1">Eu concordo com todas as declarações incluídas nos <b>Termos de Uso</b></Text>
          </Box>
          
          <Button fullWidth colorVariant="secondary" type="submit" >
            Confirmar
          </Button>
          <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <Text styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Você tem uma conta?</Text>
            <Box onClick={openNovoModal} styleSheet={{cursor: 'pointer'}}>
              <Text styleSheet={{color: theme.colors.secondary.x500}}>Entrar</Text>
            </Box>
          </Box>
          <Link href="/" styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Esqueceu sua senha?</Link>
          <Link href="/" styleSheet={{textAlign: 'left'}} colorVariant="secondary" variant="body1">Redefinir senha</Link>
        </Box>
      </Box>
    </Box>
  )
}
