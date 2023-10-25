import { useContext, useEffect, useState } from 'react';
import Box from '@src/app/theme/components/Box/Box';
import LinkSystem from '../../LinkSystem';
import { useRouter } from 'next/router';
import ActivePageContext from '@src/app/context/ActivePageContext';
import Icon from '@src/app/theme/components/Icon/Icon';
import theme from '@src/app/theme/theme';
import Text from '@src/app/theme/components/Text/Text';
import BuffetService from '@src/app/api/BuffetService';
import { UserContext } from '@src/app/context/UserContext';


const SidebarMenuIsOpenBuffet = () => {
  const [openedSubmenu, setOpenedSubmenu] = useState('');

  const [href, setHref] = useState('');
  const router = useRouter();
  const { setActivePage, isOpen, activePage } = useContext(ActivePageContext);
  const {
    setIdEvent
  } = useContext(UserContext)
  
  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard'},
    { label: 'Orçamentos', icon: 'events'},
    { 
      label: 'Perfil', 
      icon: 'perfil', 
      submenu: [
        { label: 'Imagens', action: () => setActivePage('Imagens') }
      ]
    },
    { label: 'Voltar ao site', icon: 'site', action: () => BuffetService.logout() }
];


  const toggleSubmenu = (label) => {
    if (openedSubmenu === label) {
      setOpenedSubmenu('');
    } else {
      setOpenedSubmenu(label);
    }
  };


  const menuItemStyle = (itemLabel) => ({
    padding: '1rem 1.5rem',
    borderLeft: activePage === itemLabel ? `6px solid ${theme.colors.primary.x500}` : '',
    backgroundColor: activePage === itemLabel ? theme.colors.primary.x1900 : theme.colors.neutral.x000
  });

  const menuItemStyleClosed = (itemLabel) => ({
    marginTop: '2rem',
    paddingLeft: '1rem',
    backgroundColor: activePage === itemLabel ? theme.colors.primary.x1900 : theme.colors.neutral.x000
  });

  const linkStyle = (itemLabel) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    gap: '.5rem',
    color: activePage === itemLabel ? theme.colors.primary.x500 : theme.colors.neutral.x700
  });

  
  useEffect(() => {
    setHref(window.document.location.pathname);
  }, []);

  return (
    <>
    {isOpen? 
      <Box styleSheet={{marginTop: '-1rem'}}>
        {menuItems.map((item) => (
          <>
            <Box key={item.label} tag='li' styleSheet={menuItemStyle(item.label)}>
              <LinkSystem
                key={item?.label}
                href=""
                onClick={() => {
                  if(item.submenu){
                    toggleSubmenu(item.label);
                    setActivePage(item.label);
                    setIdEvent(null)
                  }else if(item.action){
                    item.action();
                    setIdEvent(null)
                  }else{
                    setActivePage(item.label);
                    setIdEvent(null)
                  }
                }}
                styleSheet={linkStyle(item.label)}
              >
                <Icon name={item.icon} fill={theme.colors.neutral.x500} />
                <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10rem'}}>
                  {isOpen && item.label != 'Voltar ao site'? 
                    <Text color={theme.colors.neutral.x900}>{item.label}</Text>
                    :
                    <>
                      <Text color={theme.colors.neutral.x900}>{item.label}</Text>
                      <Icon name='arrowChevronRight'/>
                    </>
                  }
                </Box>
              </LinkSystem>
            </Box>
            {isOpen && openedSubmenu === item.label && item.submenu && (
              <Box tag='ul'>
                {item.submenu.map(subItem => (
                  <Box key={subItem.label} tag='li' styleSheet={{padding: '.5rem', marginLeft: '3.5rem'}}>
                    <LinkSystem
                      key={item?.label}
                      href=""
                      onClick={() => subItem.action()}
                    >
                      {subItem.label}
                    </LinkSystem>
                  </Box>
                ))}
              </Box>
            )}
          </>
        ))}
      </Box>
    :
      <Box styleSheet={{marginTop: '5.5rem'}}>
        {menuItems.map((item) => (
          <Box key={item.label} tag='li' styleSheet={menuItemStyleClosed(item.label)}>
            <LinkSystem
              href=""
              key={item?.label}
              onClick={() => {
                if(item.submenu){
                  toggleSubmenu(item.label);
                  setActivePage(item.label);  
                  setIdEvent(null)// Defina o activePage aqui
                }else if(item.action){
                  item.action();
                  setIdEvent(null)
                }else{
                  setActivePage(item.label);
                  setIdEvent(null)
                }
              }}
              styleSheet={linkStyle(item.label)}
            >
              <Icon name={item.icon} fill={theme.colors.neutral.x500} />
            </LinkSystem>
            {isOpen && openedSubmenu === item.label && item.submenu && (
              <Box tag='ul'>
                {item.submenu.map(subItem => (
                  <Box key={subItem.label} tag='li' styleSheet={{ paddingLeft: '1.5rem' }}>
                    <LinkSystem
                      key={item?.label}
                      href=""
                      onClick={() => subItem.action()}
                    >
                      {subItem.label}
                    </LinkSystem>
                  </Box>
                ))}
              </Box>
            )}
        </Box>
      ))}
    </Box>
  } 
  </>
  )
};

export default SidebarMenuIsOpenBuffet;
