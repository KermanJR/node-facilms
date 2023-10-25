import React, { useEffect, useState } from 'react';

const useResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 830);
        };

        // Checamos se o usuário está usando um dispositivo móvel no momento do carregamento da página
        checkIfMobile();

        // Adicionamos o event listener para a mudança de tamanho da janela
        window.addEventListener("resize", checkIfMobile);

        // Quando o componente for desmontado, removemos o event listener
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []); // Passamos um array vazio para que o useEffect só seja executado uma vez ao carregar a página

    return isMobile;
};

export default useResponsive;
