'use client';

import {useLayoutEffect, useState, type ReactNode} from 'react';
import {initializeFirebase, FirebaseProvider} from '.';
import type {Auth} from 'firebase/auth';
import type {FirebaseApp} from 'firebase/app';
import type {Firestore} from 'firebase/firestore';

export function FirebaseClientProvider({children}: {children: ReactNode}) {
  const [instances, setInstances] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useLayoutEffect(() => {
    if (!instances) {
      const {app, auth, firestore} = initializeFirebase();
      setInstances({app, auth, firestore});
    }
  }, [instances]);

  if (!instances) {
    return null;
  }

  return (
    <FirebaseProvider
      app={instances.app}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
