'use client';

import {useEffect} from 'react';
import {errorEmitter} from '@/firebase/error-emitter';
import {useToast} from '@/hooks/use-toast';
import {FirestorePermissionError} from '@/firebase/errors';
import {useRouter} from 'next/navigation';

export function FirebaseErrorListener() {
  const {toast} = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.toContextObject());

      // In a real app, you might want to log this to a service like Sentry
      // For this example, we'll show a toast notification
      toast({
        variant: 'destructive',
        title: 'Erro de Permissão',
        description:
          'Você não tem permissão para realizar esta ação. Contate o suporte se achar que isso é um erro.',
      });

      // You could also redirect the user to a more appropriate page
      // For example, if they are not authenticated, redirect to login
      // For this example, we just show the toast.
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast, router]);

  return null;
}
