require('dotenv').config();
import axios from 'axios';
import { API_URL_BUSCABUFFET } from './API_URL';

const apiPagBankKey = '624FD1BF878B4199BD44ED22F44C319C'

export default class PagBankService {

  static async showPlans(): Promise<any> {
    const url = `${API_URL_BUSCABUFFET}/pagbank`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados dos planos:', error);
      throw error;
    }
  }

  static async getPlansPagBank() {
    const url = `${API_URL_BUSCABUFFET}/pagamentos/pagbank?resource=plans`;
    const bearerToken = localStorage.getItem('USER_TOKEN');
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer o upload da galeria do buffet:', error);
      throw error;
    }
  }

  static async createCustomer({ data }): Promise<any> {
    const url = `${API_URL_BUSCABUFFET}/pagamentos/pagbank?resource=customers`;
    const bearerToken = localStorage.getItem('USER_TOKEN');
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao criar assinatura para o usuário: ${response.status} - ${response.statusText}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Erro ao criar assinatura para o usuário:', error);
      throw error;
    }
  }
  
  
  static async createSignature(data): Promise<any> {
    const url = `${API_URL_BUSCABUFFET}/pagamentos/pagbank?resource=subscriptions`;
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${apiPagBankKey}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Erro ao vincular assinante com plano:', error);
      throw error;
    }
  }


  ////Relacionado a api do buffet///
  static async createSignatureInBuffet(data): Promise<any> {
    const url = `${API_URL_BUSCABUFFET}/assinaturas`;
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${apiPagBankKey}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Erro ao criar assinatura para o usuário:', error);
      throw error;
    }
  }


   
}

