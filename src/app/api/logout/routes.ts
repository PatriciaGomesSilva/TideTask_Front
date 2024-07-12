
import { useRouter } from 'next/router';
import AuthService from '@/auth/services/auth-service';
import { NextRequest, NextResponse } from 'next/server';

export function post(req: NextRequest) {
  AuthService.destroySession();
    
  NextResponse.redirect(new URL('/portal/login', req.url));
}
