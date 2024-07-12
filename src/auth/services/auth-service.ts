import axiosInstance from "../../../utils/axiosInstance";
//import { cookies } from 'next/headers';
//import { redirect } from 'next/navigation';

// Função para criar um token de sessão
async function createSessionToken(payload = {}) {
  const { data } = await axiosInstance.post('users/login', payload);
  document.cookie = `session=${data.token}; path=/; httpOnly`;
}


async function isSessionValid() {
  try {
    const { data } = await axiosInstance.get('/session');
    return data.isValid;
  } catch (error) {
    //onsole.error('Failed to check session validity:', error.message);
    return false;
  }
}

// Função para destruir a sessão
export function destroySession() {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
      
    }
  }
}
/*
async function destroySession() {
  document.cookie = 'session=; Max-Age=0; path=/;';
}


export function deleteSession() {
  'use.server';
  cookies().delete('session');
  redirect('/portal/login');
}
*/


// Exportar as funções necessárias
const AuthService = {
  createSessionToken,
  destroySession,
  isSessionValid,
};

export default AuthService;
