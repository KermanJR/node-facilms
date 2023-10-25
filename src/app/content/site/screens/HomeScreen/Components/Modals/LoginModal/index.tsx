import { ModalContext } from "@src/app/context/ModalContext";
import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Input from "@src/app/theme/components/Input/Input";
import Link from "@src/app/theme/components/Link/Link";
import Text from "@src/app/theme/components/Text/Text";
import { useContext, useEffect, useState } from "react";
import IconPassword from '../../../../../../../../../public/assets/icons/password_svg.jpg'
import IconEmail from '../../../../../../../../../public/assets/icons/email_svg.jpg'
import Image from "@src/app/theme/components/Image/Image";
import GoogleLoginButton from "../../GoogleLoginButton";
import BuffetService from "@src/app/api/BuffetService";
import { UserContext } from "@src/app/context/UserContext";
import { useRouter } from "next/router";

export default function ModalLogin({ isOpen, onClose }) {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);


  const {
    setEmail,
    setPassword,
    setErrorLogin,
    setSuccessLogin,
    login, 
    errorLogin,
    successLogin
  } = useContext(UserContext);

  const {
    isModalOpen,
    closeModal,
    isNovoModalOpen,
    closeNovoModal,
    closeBudgetModal,
    isModalOpenBudget,
    setIsNovoModalOpen
  } = useContext(ModalContext)


  if (!isOpen) return null;

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault();
    login();
    setLoading(false)
  };

  useEffect(() => {
    const clearMessages = () => {
      setTimeout(() => {
        setErrorLogin(null);
        setSuccessLogin(null);
      }, 3000);
    };

    if (errorLogin || successLogin) {
      clearMessages();
    }
  }, [errorLogin, successLogin]);


  return (
    <Box
      styleSheet={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: '120'
      }}
    >
      <Box
        styleSheet={{
          width: '570px',
          padding: '2rem',
          backgroundColor: theme.colors.neutral.x050,
          borderRadius: '1rem'
        }}
      >
        <Button
          onClick={onClose}
          fullWidth={false}
          styleSheet={{
            justifyContent: 'flex-end',
            backgroundColor: theme.colors.primary.x700
          }}
        >
          X
      </Button>
      
        <Box tag="form" styleSheet={{display: 'flex', flexDirection: 'column', gap: '1rem'}} onSubmit={handleSubmit}>
          <Box styleSheet={{textAlign: 'center', display: 'flex', flexDirection: 'row', alignSelf: 'center', padding: '0 2rem', gap: '.5rem'}}>
            <Text variant="heading5">Bem vindo de volta ao</Text>
            <Text variant="heading5semiBold">Busca Buffet</Text>
          </Box>


          <GoogleLoginButton/>


          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
            <Image src={IconEmail.src} alt="" styleSheet={{width: '28px'}}/>
            </Box>
            <Input 
              type="email" 
              placeholder="Insira seu e-mail"
              onChange={(e)=>setEmail(e)}
              required={true}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.8rem',
                border: 'none',
              }}
            />
          </Box>
          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
            <Image src={IconPassword.src} alt="" styleSheet={{width: '28px'}}/>
            </Box>
            <Input 
              type="password" 
              placeholder="Insira sua senha"
              onChange={(e)=>setPassword(e)}
              required={true}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.8rem',
                border: 'none',
                height: '47px'
              }}
            />
          </Box>
          <Button fullWidth colorVariant="secondary" type="submit" isLoading={loading}>
            Entrar
          </Button>
          {errorLogin && (
            <Text color={theme.colors.negative.x700}>{errorLogin}</Text>
          )}
          {successLogin && (
            <Text color={theme.colors.positive.x700}>{successLogin}</Text>
          )}
          <Link href="/" styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Esqueceu sua senha?</Link>
          <Link href="/" styleSheet={{textAlign: 'left'}} colorVariant="secondary" >Redefinir senha</Link>
        </Box>
      </Box>
    </Box>
  );
}
