
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  isNovoModalOpen: boolean,
  isModalOpenBudget: boolean,

  openModal: () => void;
  closeModal: () => void;
  openNovoModal: () => void;
  closeNovoModal: () => void,
  openBudgetModal: () => void;
  closeBudgetModal: () => void,
  setIsNovoModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalBudgetOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultContextData: ModalContextType = {
  isModalOpen: false,
  isNovoModalOpen: false,
  isModalOpenBudget: false,

  openNovoModal: () => {},
  openModal: () => {},
  openBudgetModal: () => {},

  closeNovoModal: () => {},
  closeModal: () => {},
  closeBudgetModal: ()=>{},

  setModalBudgetOpen: ()=>{},
  setModalOpen: ()=>{},
  setIsNovoModalOpen: ()=>{},
  
};

export const ModalContext = createContext<ModalContextType>(defaultContextData);

interface Props {
  children: ReactNode;
}

export const useModal = (): ModalContextType => {
  return useContext(ModalContext);
};

export const ModalProvider: React.FC<Props> = ({ children }: Props) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isModalOpenBudget, setModalBudgetOpen] = useState<boolean>(false);
  const [isNovoModalOpen, setIsNovoModalOpen] = useState<boolean>(false); // Novo estado para o novo modal

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openBudgetModal = () => {
    setModalBudgetOpen(true);
  };

  const closeBudgetModal = () => {
    setModalBudgetOpen(false);
  };
  
  const openNovoModal = () => {
    setModalOpen(false); // Fechar o modal existente
    setModalBudgetOpen(false); // Fechar o modal existente
    setTimeout(() => {
      setIsNovoModalOpen(true); // Abrir o novo modal após um breve atraso para animações
    }, 300); // Ajuste o tempo conforme necessário
  };

  const closeNovoModal = () => {
    setIsNovoModalOpen(false);
  };


  return (
    <ModalContext.Provider 
      value={{
        isModalOpen,
        isNovoModalOpen,
        isModalOpenBudget,
        setModalOpen,
        openModal,
        closeModal,
        openNovoModal, 
        closeNovoModal, 
        setIsNovoModalOpen,
        setModalBudgetOpen,
        closeBudgetModal,
        openBudgetModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
