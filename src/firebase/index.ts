import {initializeApp, getApp, getApps, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';
import {firebaseConfig} from './config';
import {FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore} from './provider';
import {FirebaseClientProvider} from './client-provider';
import {useCollection, useMemoFirebase} from './firestore/use-collection';
import {useDoc} from './firestore/use-doc';
import {useUser} from './auth/use-user';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);
    } else {
      app = getApp();
      auth = getAuth(app);
      firestore = getFirestore(app);
    }
  }
  // @ts-ignore
  return {app, auth, firestore};
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
  useMemoFirebase
};
