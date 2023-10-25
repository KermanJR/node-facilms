
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import InputDash from "@src/app/components/system/InputDash";
import Text from "@src/app/theme/components/Text/Text";
import Button from "@src/app/theme/components/Button/Button";
import { use, useContext, useEffect, useState } from "react";
import { UserContext } from "@src/app/context/UserContext";
import BuffetService from "@src/app/api/BuffetService";
import SelectWithClickToAddAttractives from "@src/app/components/system/SelectAttractives";
import SelectWithClickToAddServices from "@src/app/components/system/SelectServices";
import Icon from "@src/app/theme/components/Icon/Icon";
import Select from "@src/app/theme/components/Select/Select";
import Pagination from "@src/app/components/system/Pagination";

const EditPerfil = () =>{

  //Hooks
  const theme = useTheme();

  //Datas
  const [capacityTotalBuffet, setCapacityTotalBuffet] = useState(null);
  const [areaTotal, setAreaTotal] = useState('');
  const [aboutBuffet, setAboutBuffet] = useState<string>('');
  const [phoneBuffet, setPhoneBuffet] = useState<string>('');
  const [urlYoutube, setUrlYoutube] = useState<string>('');
  const [attractionsBuffets, setAttractionsBuffets] = useState<[]>([]);
  const [servicesBuffets, setServicesBuffets] = useState<[]>([]);


  const [auxAttractiveBuffets, setAuxAttractivesBuffet] = useState([]);
  const [auxServicesBuffets, setAuxServicesBuffet] = useState([]);


  const [detailsBuffet, setDetailsBuffet] = useState([]);
  const [idDetailsBuffet, setIdDetailsBuffet] = useState([]);
  const [idBuffetLocal, setIdBuffetLocal] = useState('');
  const [hoursWeek, setHoursWeek] = useState<string>('');
  const [hoursWeekend, setHoursWeekend] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [addressBuffet, setAddressBuffet] = useState<[]>([])

  const [typeSignature, setTypeSignatue] = useState('')


  //
  const [message, setMessage] = useState('');

  //Data Address BUFFET
  const [cep, setCep] = useState<string>('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
  const [complemento, setComplemento] = useState<string>('');
  const [cidade, setCidade] = useState<string>(null);
  const [idCidade, setIdCidade] = useState<number>(null);
  const [idAddress, setIdAddress] = useState<number>(null);
  const [estado, setEstado] = useState<string>(null);
  const [idEstado, setIdEstado] = useState<number>(null);



  const [categoriasBuffet, setCategoriasBuffet] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);


  //Estados que estão no banco de dados
  const [states, setStates] = useState([]);



  //Variável de controle: EDIÇÃO || CRIAÇÃO do buffet
  const [modeBuffet, setModeBuffet] = useState('create');


  //Variável de controle: EDIÇÃO || CRIAÇÃO dos detalhes do buffet
  const [modeDetails, setModeDetails] = useState('create');


  //Variável de controle: EDIÇÃO || CRIAÇÃO do endereço do buffet
  const [modeAddress, setModeAddress] = useState('create');
  
    
  //Variável de controle: EDIÇÃO || CRIAÇÃO do endereço do buffet
  const [modeCategoria, setModeCategoria] = useState('create');


  const [hoveredEvent, setHoveredEvent] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState([]);

  //Contexts
  const {
    dataUser,
    setIdBuffet,
    idBuffet
  } = useContext(UserContext);

  


  let selectedAttractivesBuffet = detailsBuffet
  .map((userAttraction) => {
    const matchingAttraction = attractionsBuffets.find(
      (attraction) => attraction?.['id'] === userAttraction?.['id_atracao']
    );
    return matchingAttraction
      ? {
          value: matchingAttraction?.['id'],
          label: matchingAttraction?.['nome']
        }
      : null;
  })
  .filter((attraction) => attraction !== null);



  let selectedServicesBuffet: any = detailsBuffet
  .map((userService) => {
    const matchingService = servicesBuffets.find(
      (service) => service?.['id'] === userService?.['id_servico']
    );
    return matchingService
      ? {
          value: matchingService?.['id'],
          label: matchingService?.['nome']
        }
      : null; 
  })
  .filter((service) => service !== null); 



  //CRIAR DETALHES DO BUFFET SERVIÇOS && ATRATIVOS
  async function CreateDetailsBuffet(id){
    await BuffetService.deleteAttractionsServicesBuffets(idBuffet)
      .then((response) => {
        
      })
      .catch((error) => {
        console.log(error);
      });

    let servicesArray = auxServicesBuffets.map((service) => ({
      id_buffet:  id,
      id_servico: service?.value,
      id_atracao: null,
    }))

    let attractivesArray = auxAttractiveBuffets.map((attractive) => ({
      id_buffet: id,
      id_servico: null,
      id_atracao: attractive?.value,
    }));

    let combinedArray = [...servicesArray, ...attractivesArray];


    await BuffetService.postAttractionsServicesBuffets({
      id_buffet: idBuffetLocal,
      items: combinedArray,
    })
      .then((response) => {
        response.map((item)=>(
          setIdDetailsBuffet(item?.id)
        ))
        setAuxAttractivesBuffet([])
        setAuxServicesBuffet([])
      })
      .catch((error) => {
        console.log(error);
      });
  }


  //EDITAR DETALHES DO BUFFET SERVIÇOS && ATRATIVOS
  async function EditDetailsBuffet(){
    let servicesArray = auxServicesBuffets.map((service) => ({
      id_buffet: idBuffet,
      id_servico: service?.value,
      id_atracao: null,
    }))

    let attractivesArray = auxAttractiveBuffets.map((attractive) => ({
      id_buffet: idBuffet,
      id_servico: null,
      id_atracao: attractive?.value,
    }));

    let combinedArray = [...servicesArray, ...attractivesArray];
    combinedArray.forEach((item, index) => {
      item['id'] = detailsBuffet[index]?.id; // Adiciona a propriedade "id" como um valor numérico
    });




    detailsBuffet.map((item)=>(
      BuffetService.editAttractionsServicesBuffets(item?.['id'], {
        id_buffet: idBuffet,
        items: combinedArray.map((item)=>(
          item
        ))
      })
        .then((response) => {
          setAuxAttractivesBuffet([])
          setAuxServicesBuffet([])
        })
        .catch((error) => {
          console.log(error);
        })
    ))
    
  }


  async function CreateAddressBuffet(){
    BuffetService.createAddressBuffets(dataUser?.['entidade']?.id, {
      id_cidade: idCidade,
      cep: cep,
      bairro: bairro,
      complemento: complemento,
      rua: rua,
      numero: numero,
      contato: " ",
      telefone: "",
      email: "",
      tipo: "C"
    }).then((response)=>{
      
    }).catch((error)=>{
      console.log(error)
    })
  }




  //CRIAR BUFFET
  function CreateBuffet(e: any){
    e.preventDefault();
    setLoading(true);
    BuffetService.createBuffets({
      id_entidade: dataUser['entidade']?.id,
      slug: slug,
      capacidade_total: capacityTotalBuffet,
      area_total: areaTotal,
      sobre: aboutBuffet,
      horario_atendimento: hoursWeek,
      horario_atendimento_fds: hoursWeekend,
      redes_sociais: [
        {
            "descricao": "https://www.youtube.com/",
            "tipo": urlYoutube? urlYoutube: 'Nenhum'
        }
      ]
    })
    .then(async (response)=>{
      if(response?.id){
        setIdBuffetLocal(response?.id)
        setIdBuffet(response?.id)
        await CreateDetailsBuffet(response?.id);
        await CreateAddressBuffet();
        await CreateCategoryBuffet(response?.id)
        setMessage('Dados salvos com sucesso.');
        
      }
    }).catch((error)=>{
      setMessage('Erro ao salvar dados, tente novamente.');
      console.log(error)
    })
  }

  async function CreateCategoryBuffet(id){
    const data = {
      id_buffet: id,
      id_categoria: selectedCategoria
    }

    BuffetService.postCategoriaBuffet(data)
      .then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
  }

  //EDITAR BUFFET
  function EditBuffet(e: any){
    e.preventDefault();
    setLoading(true);
    BuffetService.editBuffets(idBuffet, {
      slug: slug,
      capacidade_total: capacityTotalBuffet,
      area_total: areaTotal,
      sobre: aboutBuffet,
      horario_atendimento: hoursWeek,
      horario_atendimento_fds: hoursWeekend,
      redes_sociais: [
        {
            "descricao": "https://www.youtube.com/",
            "tipo": urlYoutube? urlYoutube: 'Nenhum'
        }
      ]
    })
    .then(async (response)=>{
      if(response?.id){
        setAreaTotal(response?.area_total);
        setAboutBuffet(response?.sobre);
        setCapacityTotalBuffet(response?.capacidade_total);
        setSlug(response?.slug);
        setHoursWeek(response?.horario_atendimento);
        setHoursWeekend(response?.horario_atendimento_fds);
        setIdBuffet(response?.id)
        setAddressBuffet(response?.entidade?.enderecos);
        setMessage('Dados salvos com sucesso.')
        await CreateDetailsBuffet(response?.id)
        await CreateCategoryBuffet(response?.id)
        modeAddress === 'create' ? await CreateAddressBuffet() : await EditAddressBuffet();
      }
    }).catch((error)=>{
      setMessage('Erro ao salvar dados, tente novamente');
      console.log(error)
    })
  }


  //RETORNA OS DADOS DO BUFFET PELO SEU ID
  function GetBuffetById(){
    BuffetService.showBuffetByIdEntity(dataUser['entidade']?.id)
    .then((response) => {
      if(response?.id){
        setModeBuffet('edit')
        setSlug(response?.slug)
        setAreaTotal(response?.area_total);
        setAboutBuffet(response?.sobre);
        setCapacityTotalBuffet(response?.capacidade_total);
        setSlug(response?.slug);
        setHoursWeek(response?.horario_atendimento);
        setHoursWeekend(response?.horario_atendimento_fds);
        setIdBuffetLocal(response?.id)
        setIdBuffet(response?.id)
        setRua(response?.entidade?.enderecos[0].endereco.rua)
        setBairro(response?.entidade?.enderecos[0].endereco.bairro)
        setCidade(response?.entidade?.enderecos[0].endereco.cidade.nome)
        setNumero(response?.entidade?.enderecos[0].endereco.numero)
        setCep(response?.entidade?.enderecos[0].endereco.cep)
        setEstado(response?.entidade?.enderecos[0].endereco?.cidade?.estado?.sigla)
        setComplemento(response?.entidade?.enderecos[0].endereco?.complemento)
        setIdCidade(response?.entidade?.enderecos[0].endereco.cidade.id)
        setPhoneBuffet(response?.entidade?.enderecos[0].telefone)
        setAddressBuffet(response?.entidade?.enderecos);
        setIdAddress(response?.entidade?.enderecos[0].endereco.id);
        setTypeSignatue(response?.entidade?.assinaturas[0]?.plano?.nome);
        setSelectedCategoria(response?.categorias[0]?.categoria?.id)
        if(response?.entidade?.enderecos.length > 0){
          setModeAddress('edit')
        }
      }else{
        setModeBuffet('create')
      }
  
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do Buffet:', error);
    });
  }


  //RETORNA AS ATRAÇÕES FIXAS CADASTRADAS NO BANCO DE DADOS
  function showAttractionsBuffets(){
    BuffetService.showAttractionBuffets()
    .then((response) => {
      setAttractionsBuffets(response);
    })
    .catch((error) => {
      console.error('Erro ao buscar atrações para os Buffets:', error);
    });
  }

  //RETORNA OS SERVIÇOS FIXOS CADASTRADOS NO BANCO DE DADOS
  function showServicesBuffets(){
    BuffetService.showServicesBuffets()
    .then((response) => {
      setServicesBuffets(response);
    })
    .catch((error) => {
      console.error('Erro ao buscar serviços para os Buffets:', error);
    });
  }

  
  //RETORNA OS DETALHES CADASTRADOS PARA O BUFFET PELO SEU ID
  function showDetailsBuffetById() {
    BuffetService.showDetailsBuffetById(idBuffet)
      .then((response) => {
        setDetailsBuffet(response);
        if(response.length === 0){
          setModeDetails('create')
        }else if(response.length > 0){
          setModeDetails('edit')
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes do Buffet:', error);
      });
  }

  function formatarTelefone(input) {
    // Remove todos os caracteres não numéricos
    const numeroLimpo = input.value.replace(/\D/g, '');

    // Formata o número conforme o padrão (XX) XXXXX-XXXX
    let numeroFormatado = '';
    if (numeroLimpo.length >= 2) {
        numeroFormatado += `(${numeroLimpo.substring(0, 2)}`;
    }
    if (numeroLimpo.length >= 7) {
        numeroFormatado += `) ${numeroLimpo.substring(2, 7)}-${numeroLimpo.substring(7, 11)}`;
    }
    else if (numeroLimpo.length >= 2) {
        numeroFormatado += `) ${numeroLimpo.substring(2)}`;
    }

    // Define o valor formatado de volta no campo de entrada
    input.value = numeroFormatado;
    setPhoneBuffet(input.value)
}


  async function EditAddressBuffet(){
    BuffetService.editAddressBuffets(idAddress, {
      id_cidade: idCidade,
      cep: cep,
      bairro: bairro,
      complemento: complemento,
      rua: rua,
      numero: numero,
      contato: " ",
      telefone: phoneBuffet,
      email: "",
      tipo: "C"
    }).then((response)=>{
      setRua(response?.rua)
      setBairro(response?.bairro)
      setCidade(response?.entidade?.enderecos[0].endereco.cidade.nome)
      setNumero(response?.numero)
      setCep(response?.cep)
      setIdCidade(response?.id_cidade)
      setAddressBuffet(response?.entidade?.enderecos);
      setIdAddress(response?.id);
    }).catch((error)=>{
      console.log(error)
    })
  }
  

  function showStateBd(){
    BuffetService.showStatesBd()
      .then((response)=>{
        setStates(response);
        states.map(async (state)=>{
          if(state['sigla'] === estado){
            setIdEstado(state?.id)
            showCitiesBd(state?.id)
          }
        })
      }).catch((error)=>{
        console.log(error)
      })
  }

  function showCitiesBd(idEstado: number){
    BuffetService.showCitiesByIdState(idEstado)
      .then((response)=>{
        response.map(async (city)=>{
          if(city['nome'] === cidade.toUpperCase()){
            setIdCidade(city?.id)
          }else{
           ''
          }
        })
      }).catch((error)=>{
        console.log(error)
      })
  }
  


  useEffect(() => {
    GetBuffetById();
    showAttractionsBuffets();
    showServicesBuffets();
    showStateBd();

    BuffetService.getCategoriasBuffet()
    .then(res=>{
      setCategoriasBuffet(res)
    }).catch(err=>{
      console.log(err)
    })
  }, []);

  useEffect(()=>{
    showDetailsBuffetById();
  }, [idBuffet != null])

  useEffect(() => {
    const clearMessages = () => {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    };

    if (message) {
      clearMessages();
    }
  }, [message]);

 

  useEffect(()=>{
    BuffetService.getAddressByCEP(cep)
    .then((response)=>{
      setRua(response?.logradouro);
      setBairro(response?.bairro);
      setCidade(response?.localidade);
      setEstado(response?.uf);
      setCep(response?.cep)
      showStateBd();
    }).catch(err=>{
      console.log(err)
    })
  }, [cep.length === 8])


  
  const EventActionPopup = () => (
    <Box styleSheet={{ 
      display: 'flex',
      flexDirection: 'row',
      gap: '8px' ,
      borderRadius: '4px',
      padding: '8px',
      width: '60%',
      position: 'fixed',
      right: 0,
      top: '0',
      backgroundColor: theme.colors.neutral.x000,
      boxShadow: `0px 4px 4px 0px ${theme.colors.neutral.x050}`,
      }}>
        <Text variant="small" styleSheet={{width: '100%'}}>
        slug é uma versão simplificada do seu título, usada na URL. 
        Use letras minúsculas, hifens e números, evite espaços e caracteres especiais
        </Text>
     
    </Box>
  );


  useEffect(()=>{ 
    
  }, [selectedCategoria])





  return(
    <Box 
      tag="form"
      onSubmit={modeBuffet === 'create'? CreateBuffet:EditBuffet}
      styleSheet={{
      width: '100%',
      height: 'auto',
      backgroundColor: theme.colors.neutral.x000,
      borderRadius: '8px',
      padding: '2rem',
    }}>
      
     <Box styleSheet={{display: 'grid',gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem'}}>
      
      <Box>
        <Text>Nome</Text>
        <InputDash  placeholder="Digite o nome do Buffet" type="text" defaultValue={dataUser['entidade']?.nome} disabled={true} styleSheet={{backgroundColor: theme.colors.neutral.x200}}/>
      </Box>
       <Box>
        <Text>CNPJ</Text>
        <InputDash placeholder="CNPJ" type="text" defaultValue={dataUser['entidade']?.documento} disabled={true} styleSheet={{backgroundColor: theme.colors.neutral.x200}}/>
       </Box>
       <Box>
       <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
            <Text>Slug</Text>
            <Icon
              name="default_icon" 
              size="sm" 
              fill={theme.colors.secondary.x600}  
              onMouseEnter={(e)=>setHoveredEvent(!hoveredEvent)}
              onMouseLeave={(e) => setHoveredEvent(!hoveredEvent)}
            />
              
          </Box>
        <InputDash placeholder="Digite a slug do Buffet" type="text" onChange={(e)=>setSlug(e)} value={slug} disabled={false} required={true}/>
       </Box>
     </Box>

     <Box styleSheet={{display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 2fr', gap: '2rem', padding: '2rem 0 0 0'}}>
        <Box>
          <Text>CEP</Text>
          <InputDash placeholder="Digite o CEP" type="text"  onChange={(e)=>setCep(e)} value={cep}/>
        </Box>
        <Box>
        <Text>Rua</Text>
          <InputDash placeholder="Digite o nome da rua" type="text" value={rua} disabled={true}/>
        </Box>
        <Box>
          <Text>N°</Text>
          <InputDash placeholder="Digite o número" type="text" value={numero} onChange={(e)=>setNumero(e)} required={true}/>
        </Box>
        <Box>
          <Text>Complemento</Text>
          <InputDash placeholder="Digite um complemento" type="text" value={complemento} onChange={(e)=>setComplemento(e)}/>
        </Box>
     </Box>

     <Box styleSheet={{width: '40%',display: 'grid',gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem 0 2rem 0'}}>
        <Box>
          <Text>Cidade</Text>
          <InputDash placeholder="Cidade" type="text" value={cidade} disabled={true}/>
        </Box>
        <Box>
          <Text>Estado</Text>
          <InputDash placeholder="Estado" type="text" value={estado} disabled={true}/>
        </Box>
     </Box>

     <Text variant="heading4Bold" color={theme.colors.neutral.x999}>Informações Técnicas</Text>

     <Box styleSheet={{display: 'grid', gridTemplateColumns: '30% 30% 30%', gap: '2rem', padding: '1rem 0 1rem 0'}}>
        <Box>
          <Text>Categoria do Buffet</Text>
          <select onChange={(e)=>setSelectedCategoria(e.target.value)} value={selectedCategoria} required={true} style={
            {
              padding: '.875rem',
              border: 'none',
              background: theme.colors.neutral.x050,
              borderRadius: '8px'
            }
          }>
            {categoriasBuffet.map((item, index)=>{
              return <option key={index} value={item?.id}>{item?.nome}</option>
            })}
          </select>
        
        </Box>
        <Box>
          <Text>Capacidade Total</Text>
          <InputDash placeholder="Digite a capacidade Total" type="number" value={capacityTotalBuffet} onChange={setCapacityTotalBuffet} required={true}/>
        </Box>
        <Box>
          <Text>Àrea Total</Text>
          <InputDash placeholder="Digite Área total" type="text" value={areaTotal} onChange={setAreaTotal} required={true}/>
        </Box>

        <Box>
          <Text>Horário Atendimento</Text>
          <InputDash placeholder="Atendimento: Seg à Sex" type="text" value={hoursWeek} onChange={setHoursWeek} required={true}/>
        </Box>

        <Box>
          <Text>Horário Atendimento (Fim de semana)</Text>
          <InputDash placeholder="Atendimento: Fim de semana" type="text" value={hoursWeekend} onChange={setHoursWeekend} required={true}/>
        </Box>
     </Box>

     <Box styleSheet={{display: 'grid', gridTemplateColumns: '30% 20% 20% 23%', gap: '2rem', padding: '1rem 0 1rem 0'}}>
        <Box>
          <Text>Telefone</Text>
          <InputDash placeholder="Digite seu telefone" type="text" value={phoneBuffet} onChange={(e)=>setPhoneBuffet(e)} required={true}/>
        </Box>
        {typeSignature === 'Premium'? 
        <Box>
          <Text>URL Youtube</Text>
          <InputDash placeholder="Digite a URL do seu site" type="text"  onChange={(e)=>setUrlYoutube(e)} />
        </Box>: ''
        }
        
     </Box>

     <Box styleSheet={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1rem 0 1rem 0'}}>
     <Box>
        <Text variant="heading4Bold" color={theme.colors.neutral.x999} styleSheet={{padding: '1rem 0'}}>Atrações</Text>
        <SelectWithClickToAddAttractives 
          options={attractionsBuffets} 
          selectedAttractivesBuffet={selectedAttractivesBuffet}
          setAuxAttractivesBuffets = {setAuxAttractivesBuffet}
        />
      </Box>
      <Box>
        <Text variant="heading4Bold" color={theme.colors.neutral.x999} styleSheet={{padding: '1rem 0'}}>Serviços oferecidos</Text>
        <SelectWithClickToAddServices
          options={servicesBuffets}
          selectedServicesBuffet={selectedServicesBuffet}
          setAuxServicesBuffets = {setAuxServicesBuffet}
        />
      </Box>

     </Box>

      <Box>
        <Text variant="heading4Bold" color={theme.colors.neutral.x999} styleSheet={{padding: '1rem 0'}}>Sobre</Text>
        <InputDash 
          tag="textarea" 
          placeholder="Escreva brevemente a história do buffet" 
          styleSheet={{height: '15rem'}} 
          defaultValue={aboutBuffet} 
          onChange={setAboutBuffet} 
          required={true}
        />
      </Box>
      <Box styleSheet={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        justifyContent: 'left',
        alignItems: 'center'
      }}>
        <Button colorVariant="secondary" styleSheet={{width: '115px', marginTop: '1rem'}} type="submit">Salvar</Button>
        {
          message && <Text styleSheet={{
            color: message === 'Dados salvos com sucesso.'? theme.colors.positive.x700 : theme.colors.negative.x800, marginTop: '1rem'
          }}>{message === 'Dados salvos com sucesso.'? 'Dados salvos com sucesso.':  'Erro ao salvar dados, tente novamente.'}</Text>
        }
       
      </Box>
   
      
    </Box>
  )
}

export default EditPerfil;
