import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Text from "@src/app/theme/components/Text/Text";

import ImageBanner from '../../../../../../../../public/assets/images/banner_singlePage_buffet.webp'

export default function Banner({data}){

    const theme = useTheme();
    return(
        <Box tag="div"
            styleSheet={{
                width: '100%',
                height: '487px',
                background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://buscabuffet.com.br/api/uploads/${data?.galerias?.length > 0 ? data?.galerias[0]?.arquivo?.nome : ''})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '5.5rem'
            }}    
        >     {/* Pseudo-elemento para escurecer o fundo */}
  
            <Box tag="div" 
                styleSheet={{
                    width: {md: '70%', sx:'50%'},
                    margin: '0 auto',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirectioc: 'column'
                }}
            >
                <Text tag="h3" variant="heading3semiBold"
                    styleSheet={{color: `${theme.colors.complementar.x500}`}}
                >
                    {data?.entidade?.nome}
                </Text>

                <Text tag="p" variant="body2"
                    styleSheet={{color: `${theme.colors.complementar.x500}`}}
                >
                    Cadastre-se e solicite seu orçamento
                </Text>

                <Button href="/orcamento-por-regiao" variant="contained" colorVariant="secondary" size="lg" styleSheet={{margin: '2rem auto'}}>Faça seu orçamento</Button>
            </Box>
        </Box>
    )
}
