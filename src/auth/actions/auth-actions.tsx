import axiosInstance from "../../../utils/axiosInstance";
import { redirect } from 'next/navigation';
import AuthService from '../services/auth-service';

/*
async function createAccount(formData: FormData) {
  'use server';

  const firstName = formData.get('name') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Fazendo a requisição para a API de backend
  
    await axiosInstance.post('/users', {
      firstName,
      lastName,
      email,      
      password,
    });

    // Redirecionando o usuário para a página de login após o cadastro
    redirect('/portal/login');    
}
*/

async function createAccount(formData: FormData) {
  'use server';

  const firstName = formData.get('name') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Fazendo a requisição para a API de backend
    await axiosInstance.post('/users', {
      firstName,
      lastName,
      email,
      password,
    });
    
    // Exibindo o alerta de sucesso
    window.alert('Cadastro realizado com sucesso!');
    // Redirecionando o usuário para a página de login após o cadastro
    redirect('/portal/login');
  } catch (error) {
    // Tratar erro, se necessário
    if (typeof window !== 'undefined') {
      window.alert('Erro ao realizar o cadastro.');
    }
  }
}

async function login(formData: FormData) {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const response = await fetch('http://localhost:3333/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })


  if (!user) {
    // Aqui você pode usar optimistic update para atualizar a tela
    console.log('Error');
    redirect('/portal/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.log('Usuário ou senha inválidos');
    redirect('/portal/login');
  }

  await AuthService.createSessionToken({
    sub: user.id,
    name: user.name,
    email: user.email,
  });

  redirect('/portal');
}

const AuthActions = {
  createAccount,
  login,
};

export default AuthActions;
