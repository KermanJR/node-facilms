
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import Image from "@src/app/theme/components/Image/Image";
import Icon from "@src/app/theme/components/Icon/Icon";
import BuffetService from "@src/app/api/BuffetService";
import {useContext, useEffect, useState } from "react";
import Button from "@src/app/theme/components/Button/Button";
import { UserContext } from "@src/app/context/UserContext";
import MockImage1 from 'public/assets/images/mock_image.jpg';
import MockImage2 from 'public/assets/images/mock_image_2.jpg'
import { it } from "node:test";


const ImagesBuffet = () =>{

  const [selectedImageOne, setSelectedImageOne] = useState(null);
  const [selectedImageTwo, setSelectedImageTwo] = useState(null);
  const [selectedImageThree, setSelectedImageThree] = useState([]);

  const [idImageOne, setIdImageOne] = useState(null);
  const [idImageTwo, setIdImageTwo] = useState(null);
  const [idImageThree, setIdImageThree] = useState([]);


  const [hoveredEvent, setHoveredEvent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imagesBuffetDatabase, setImagesBuffetDatabase] = useState([]);



  const [modeFirstImage, setModeFirstImage] = useState('create');
  const [modeSecondImage, setModeSecondImage] = useState('create');
  const [modeGalleryImage, setModeGalleryImage] = useState('create');

  const [messageFirstImage, setMessageFirstImage] = useState('');
  const [messageSecondImage, setMessageSecondImage] = useState('');
  const [messageThreeImage, setMessageThreeImage] = useState('');

  const [modeGallery, setModeGallery] = useState('create');

  let idImagesGallery = []

  const theme = useTheme();

  const {
    idBuffet
  } = useContext(UserContext)


  //Selecionar Imagens
  const handleImageSelectOne = (event) => {
    const file = event.target.files[0];
    setSelectedImageOne(file);
  };

  const handleImageSelectTwo = (event) => {
    const file = event.target.files[0];
    setSelectedImageTwo(file);
  };

  const handleImageSelectThree = (event) => {
    const files = event.target.files;
    let newImages = [...selectedImageThree];
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
    }
    setSelectedImageThree(newImages);
    
  };

  const removeAllImages = ()=>{  setSelectedImageThree([])
    selectedImageThree.map((item, index)=>{
      BuffetService.deleteFiles(item?.id_arquivo)
      .then(res=>{
        setSelectedImageThree([])
      }).catch(err=>{
        console.log(err)
      })
    })
  }


  //Remover Imagens
  const removeImage = (index) => {
    const newImages = [...selectedImageThree];
  
    // Encontre o índice da imagem no array
    const imageIndex = newImages.findIndex((image) => image.id_arquivo === index.id_arquivo);
  
    if (imageIndex !== -1) {
      // Remove a imagem do array
      newImages.splice(imageIndex, 1);
  
      // Atualize o estado com as novas imagens
      setSelectedImageThree(newImages);
    }
  
    // Agora, você pode continuar com a exclusão do arquivo
    BuffetService.deleteFiles(index.id_arquivo)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  
    if (newImages.length === 0) {
      // Se não houver mais imagens, defina o estado inicial
      setSelectedImageThree([]);
      setModeGalleryImage('create');
    }
  };
  
  


//Postar Imagens
async function PostFirstImageBuffetOne() {
  if(selectedImageOne){
    BuffetService.postFileBuffet(selectedImageOne)
    .then(async (response) => {
      try {
        const imageUrl = await loadImagePreview(selectedImageOne);
        await setIdImageOne(response?.id)
        createGalleryBuffet(response?.id);
        setModeFirstImage('edit')
        setMessageFirstImage('Imagem cadastrada com sucesso.')
      } catch (error) {
        setMessageFirstImage('Erro no cadastro da imagem.')
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do usuário:', error);
    });
  }else if(selectedImageOne == null){
    setMessageFirstImage('Por favor, selecione uma imagem.')
  }
  
   
}

async function PostFirstImageBuffetTwo() {
  if(selectedImageTwo && selectedImageOne){
    BuffetService.postFileBuffet(selectedImageTwo)
    .then(async (response) => {
      try {
        const imageUrl = await loadImagePreview(selectedImageTwo);
        await setIdImageTwo(response?.id);
        createGalleryBuffet(response?.id);
        setModeSecondImage('edit')
        setMessageSecondImage('Imagem cadastrada com sucesso.')
      } catch (error) {
        setMessageSecondImage('Erro no cadastro da imagem.')
        console.error('Erro ao carregar e exibir a imagem:', error);
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do usuário:', error);
    });
  }else if(selectedImageTwo == null){
    setMessageSecondImage('Por favor, selecione uma imagem.')
  }else if(selectedImageTwo && !selectedImageOne){
    setMessageSecondImage('Por favor, primeiro selecione a foto de capa do perfil.')
  }
  
}

async function PostFirstImageBuffetThree() {
  if(selectedImageThree?.length > 0 && selectedImageOne && selectedImageTwo){
    selectedImageThree.forEach((imageFile) => {
      BuffetService.postFileBuffet(imageFile)
        .then(async (response) => {
  
          const imageUrl = await loadImagePreview(imageFile);
          setModeGalleryImage('edit')
          setIdImageThree([...idImageThree, await response?.id])
          createGalleryBuffet(await response?.id)
          setMessageThreeImage('Imagens cadastradas com sucesso.')
          
        })
        .catch((error) => {
          setMessageThreeImage('Erro no cadastro das imagens.')
        });
    });
  }else if(selectedImageThree?.length == 0){
    setMessageThreeImage('Por favor, selecione uma imagem.')
  }
  else if(selectedImageThree?.length > 0 && !selectedImageOne && !selectedImageTwo){
    setMessageThreeImage('Por favor, primeiro selecione a foto de capa e perfil do buffet.')
  }
  
}


//Editar Imagens
async function EditFirstImageBuffetOne() {
  if(selectedImageOne){
  BuffetService.editFileBuffet(selectedImageOne, idImageOne)
    .then(async (response) => {
      try {
        const imageUrl = await loadImagePreview(selectedImageOne);
        setMessageFirstImage('Imagem editada com sucesso.')
        await setIdImageOne(response?.id)
       
      } catch (error) {
        setMessageFirstImage('Falha ao editar imagem.')
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do usuário:', error);
    });
  }else if(selectedImageOne == null){
      setMessageFirstImage('Por favor, selecione uma imagem.')
    }
}

async function EditFirstImageBuffetTwo() {
  if(selectedImageTwo){
  BuffetService.editFileBuffet(selectedImageTwo, idImageTwo)
    .then(async (response) => {
      try {
        const imageUrl = await loadImagePreview(selectedImageTwo);
        await setIdImageTwo(response?.id)
        setMessageFirstImage('Imagem editada com sucesso.')
      } catch (error) {
        setMessageFirstImage('Falha ao editar imagem.')
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do usuário:', error);
    });
  }else if(selectedImageTwo == null){
      setMessageSecondImage('Por favor, selecione uma imagem.')
    }
}

async function EditFirstImageBuffetThree() {
  if(selectedImageThree?.length > 0){
    selectedImageThree.forEach((imageFile) => {
      BuffetService.editFileBuffet(imageFile, imageFile?.id_arquivo)
        .then(async (response) => {
          idImagesGallery.push(await response?.id)
          setMessageFirstImage('Imagens editadas com sucesso.')
        })
        .catch((error) => {
          setMessageFirstImage('Falha ao editar imagens.')
          console.error('Erro ao editar imagens da galeria:', error);
        });
    });
  }else if(selectedImageThree?.length == 0){
    setMessageThreeImage('Por favor, selecione uma imagem.')
  }
  
}



//Pré renderizar imagens
function loadImagePreview(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(imageFile);
  });
}



function createGalleryBuffet(id_image){
  setTimeout(()=>{
      BuffetService.postGalleryBuffet(idBuffet, id_image)
      .then((response)=>{
        console.log('response')
      })
      .catch((error)=>{
        console.log(error)
      })
  }, 4000)
}



  useEffect(()=>{
    BuffetService.getImagesGallery(idBuffet)
    .then((response)=>{
      setImagesBuffetDatabase(response);
      if(response[0]){
        setIdImageOne(response[0]?.arquivo?.id)
        setSelectedImageOne(response[0]?.arquivo?.path);
        setModeFirstImage('edit')
      }
      if(response[1]){
      
        setSelectedImageTwo(response[1]?.arquivo?.path);
        setModeSecondImage('edit')
        setIdImageTwo(response[1]?.arquivo?.id)
      }

      if(response[2]){
        setSelectedImageThree(response?.slice(2).map((item, index)=>{
          return item
        }))
        setIdImageThree(response?.slice(2).map((item, index)=>{
          return item.id
        }))
        setModeGalleryImage('edit')
      }
    })
    .catch((error)=>{
      console.log(error)
    })
  }, [])

  
  useEffect(() => {
    const clearMessages = () => {
      setTimeout(() => {
        setMessageFirstImage(null);
        setMessageSecondImage(null)
        setMessageThreeImage(null)
      }, 3000);
    };

    if (messageFirstImage || messageSecondImage || messageThreeImage) {
      clearMessages();
    }
  }, [messageFirstImage, messageSecondImage, messageThreeImage]);

 





  const EventActionPopup = () => (
    <Box styleSheet={{ 
      display: 'flex',
      flexDirection: 'row',
      gap: '8px' ,
      borderRadius: '4px',
      padding: '8px',
      position: 'static',
      right: 0,
      top: '0',
      backgroundColor: theme.colors.neutral.x000,
      boxShadow: `0px 4px 4px 0px ${theme.colors.neutral.x050}`,
      }}>
        <Text variant="small">
         Imagens no formato jpg. Capa do perfil, Capa do card, Imagens da galeria.
        </Text>
     
    </Box>
  );




  return(
    <Box  styleSheet={{
      width: '100%',
      height: 'auto',
      backgroundColor: theme.colors.neutral.x000,
      borderRadius: '8px',
      padding: '2rem'
    }}>
     <Box styleSheet={{display: 'grid',gridTemplateColumns: '1fr 1fr', gap: '4rem'}}>
   
          
        <Box>
          <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
            <Text variant="small" color={theme.colors.neutral.x500}>Recomendação</Text>
            <Icon 
              name="default_icon" 
              size="sm" 
              fill={theme.colors.secondary.x600}  
              onMouseEnter={(e)=>setHoveredEvent(!hoveredEvent)}
              onMouseLeave={(e) => setHoveredEvent(!hoveredEvent)}
            />
              {hoveredEvent  && (
                <EventActionPopup/>
              )}
          </Box>

          <label 
            htmlFor="capaPerfil" 
            style={{
              cursor: 'pointer', 
              backgroundColor: theme.colors.neutral.x050,
              padding: '.875rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <Text color={theme.colors.neutral.x800} styleSheet={{fontWeight: '400'}}>Selecione a imagem de capa do perfil</Text>
              <input id="capaPerfil" name="capaPerfil" placeholder="Nome do buffet" type="file" required={true} onChange={(e)=>handleImageSelectOne(e)} style={{
                display: 'none'
              }}/>
          </label>
        </Box>
        <Box styleSheet={{marginTop: '2.3rem'}}>
          <label 
            htmlFor="capaCard" 
            style={{
              cursor: 'pointer', 
              backgroundColor: theme.colors.neutral.x050,
              padding: '.875rem',
              borderRadius: '8px',
            }}>
              <Text color={theme.colors.neutral.x800} styleSheet={{fontWeight: '400'}}>Selecione a imagem de capa do card</Text>
              <input id="capaCard" name="capaCard" placeholder="Nome do buffet" type="file" required={true} onChange={(e)=>handleImageSelectTwo(e)}  style={{
                display: 'none'
              }}/>
          </label>
          
        </Box>
        
     </Box>

     <Box styleSheet={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4.235rem', padding: '1rem 0', justifyContent: 'space-between'}}>
        <Box>
          {selectedImageOne ? (
              <Box>
                <Image
                  src={typeof selectedImageOne === "string" ?
                      selectedImageOne?.startsWith('/')? 
                      `https://buscabuffet.com.br${selectedImageOne}` : '': URL.createObjectURL(selectedImageOne)
                  }
                  alt="Pré-visualização da imagem"
                  styleSheet={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px'}}
                />
              </Box>
            ):
            (
              <Box>
              <img
                src={MockImage1.src}
                alt="Pré-visualização da imagem"
                style={{ maxWidth: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px'}}
              />
            </Box>
            
            )
          }
          <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Button  
              type="submit" 
              styleSheet={{
                width: '100px',
                marginTop: '1rem'
              }}
              colorVariant="secondary"
              onClick={modeFirstImage == 'create'? PostFirstImageBuffetOne : EditFirstImageBuffetOne}
              >
              Salvar
            </Button>
            {messageFirstImage == 'Imagem cadastrada com sucesso.' && 
              <Text styleSheet={{color: 'green', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Imagem cadastrada com sucesso.</Text>
            }

            {messageFirstImage == 'Imagem editada com sucesso.' && 
              <Text styleSheet={{color: 'green', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Imagem editada com sucesso.</Text>
            }


              {messageFirstImage == 'Erro no cadastro da imagem.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Erro no cadastro da imagem.</Text>
            }

            {messageFirstImage == 'Por favor, selecione uma imagem.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Por favor, selecione uma imagem.</Text>
            }
          </Box>
            
        </Box>
        
        <Box>
          {selectedImageTwo ?(
            <Box>
              <Image
                src={typeof selectedImageTwo === "string" ?
                  selectedImageTwo?.startsWith('/')? 
                  `https://buscabuffet.com.br${selectedImageTwo}` : '': URL.createObjectURL(selectedImageTwo)
                }
                alt="Pré-visualização da imagem"
                styleSheet={{ maxWidth: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px'}}
              />
            </Box>
          ):
          (
            <Box>
            <img
              src={MockImage1.src}
              alt="Pré-visualização da imagem"
              style={{ maxWidth: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px'}}
            />
          </Box>
          )}
          
        <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Button  
              type="submit" 
              styleSheet={{
                width: '100px',
                marginTop: '1rem'
              }}
              colorVariant="secondary"
              onClick={modeSecondImage == 'create'? PostFirstImageBuffetTwo : EditFirstImageBuffetTwo}
              >
              Salvar
            </Button>
            {messageSecondImage == 'Imagem cadastrada com sucesso.' && 
              <Text styleSheet={{color: 'green', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Imagem cadastrada com sucesso.</Text>
            }

            {messageSecondImage == 'Imagem editada com sucesso.' && 
              <Text styleSheet={{color: 'green', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Imagem editada com sucesso.</Text>
            }


              {messageSecondImage == 'Erro no cadastro da imagem.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Erro no cadastro da imagem.</Text>
            }

            {messageSecondImage == 'Por favor, selecione uma imagem.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Por favor, selecione uma imagem.</Text>
            }

          {messageSecondImage == 'Por favor, primeiro selecione a foto de capa.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Por favor, primeiro selecione a foto de capa do perfil.</Text>
            }
          
          
        </Box>
        </Box>

     </Box>

     <Box styleSheet={{marginTop: '3rem'}}>
        <label 
            htmlFor="galeriaBuffet" 
            style={{
              cursor: 'pointer', 
              backgroundColor: theme.colors.neutral.x050,
              padding: '.875rem',
              borderRadius: '8px',
              marginTop: '1rem',
              width: '50%'
            }}>
              <Text color={theme.colors.neutral.x800} styleSheet={{fontWeight: '400'}}>Selecione as imagens da galeria</Text>
              <input id="galeriaBuffet" name="galeriaBuffet" placeholder="Nome do buffet" type="file" onChange={(e)=>handleImageSelectThree(e)}  style={{
                display: 'none'
              }}/>
          </label>
      
     </Box>

     <Box styleSheet={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', marginTop: '1rem', height: 'auto', gap: '1rem'}}>
        {selectedImageThree.length > 0 ? selectedImageThree.map((image, index) => (
          <Box key={index} className="thumbnail">
            <Box className="overlay">
              <button className="remove-button" onClick={() => removeImage(image)}>
                X
              </button>
            </Box>
            <Image src={modeGalleryImage === 'edit'? image?.arquivo?.nome ? `https://buscabuffet.com.br/api/uploads/${image?.arquivo?.nome} `: URL.createObjectURL(image): URL.createObjectURL(image)} alt={`Miniatura ${index + 1}`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover', borderRadius: '8px'}}/>
          </Box>
        )) 
        :
        <Box styleSheet={{display: 'flex', flexDirection: 'column', marginTop: '1rem', height: 'auto', gap: '1.5rem'}}>
          <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}}/>
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}}/>
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}}/>
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}}/>
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}}/>
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}} />
          </Box>

          <Box  styleSheet={{display: 'flex', flexDirection: 'row',gap: '1rem'}}>
          <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}} />
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}} />
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}} />
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}} />
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}} />
            <Image src={MockImage2.src} alt={`Miniatura`} styleSheet={{height: '168px', width: '261px', objectFit: 'cover'}} />
          </Box>
        </Box>
      }
     </Box>
     <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem'}}>
      <Button  
        styleSheet={{
          width: '100px',
          marginTop: '6rem'
        }}
        onClick={modeGalleryImage === 'create'? PostFirstImageBuffetThree:EditFirstImageBuffetThree}
        colorVariant="secondary"
      >
          Salvar
      </Button>
     

      <Button  
        styleSheet={{
          width: '200px',
          marginTop: '6rem'
        }}
        onClick={(e)=>removeAllImages()}
        colorVariant="primary"
      >
          Remover imagens
      </Button>
    
    <Box styleSheet={{alignSelf: 'center', marginTop: '4rem'}}>
    {messageThreeImage == 'Imagens cadastradas com sucesso.' && 
              <Text styleSheet={{color: 'green', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Imagens cadastradas com sucesso.</Text>
            }

            {messageThreeImage == 'Imagem editada com sucesso.' && 
              <Text styleSheet={{color: 'green', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Imagem editada com sucesso.</Text>
            }


              {messageThreeImage == 'Erro no cadastro das imagens.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Erro no cadastro das imagens.</Text>
            }

            {messageThreeImage == 'Por favor, selecione uma imagem.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>Por favor, selecione uma imagem.</Text>
            }

            {messageThreeImage == 'Por favor, primeiro selecione a foto de capa e perfil do buffet.' && 
              <Text styleSheet={{color: 'red', fontSize: '.8rem', alignSelf:' center', padding: '1rem', height: '10px'}}>
              Por favor, primeiro selecione a foto de capa e perfil do buffet.</Text>
            }


    </Box>
      
          
      </Box>
    

      
      

    </Box>
  )
}

export default ImagesBuffet;
