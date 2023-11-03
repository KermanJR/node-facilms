import { ModalContext } from "@src/app/context/ModalContext";
import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
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
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function ModalLogin({ isOpen, onClose }) {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    setEmail,
    setPassword,
    setErrorLogin,
    setSuccessLogin,
    login, 
    errorLogin,
    successLogin
  } = useContext(UserContext);


  if (!isOpen) return null;

  const handleSubmit = (e) => {
    setIsLoading(true)
    e.preventDefault();
    login();
    setIsLoading(false)
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
          type="submit"
          variant="contained"
          onClick={onClose}
          
          style={{
            backgroundColor: theme.colors.secondary.x500,
            borderRadius: '20px',
            position: 'relative',
            left: '0',
            top: '0',
            width: '20px',
            height: '20px'
          }}
          
        >
          X
        </Button>
      
        <Box tag="form" styleSheet={{display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem'}} onSubmit={handleSubmit}>
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
          <Button
          type="submit"
          variant="contained"
          
          disabled={isLoading}
          style={{
            backgroundColor: theme.colors.secondary.x500,
            borderRadius: '20px'
          }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? <Text color={theme.colors.neutral.x000}>Entrando...</Text> : <Text  color={theme.colors.neutral.x000}>Entrar</Text>}
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
