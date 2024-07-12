'use server';

import  { destroySession } from '@/auth/services/auth-service';

export async function logout() {
    destroySession();
  }