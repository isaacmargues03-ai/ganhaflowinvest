'use client';

import {useEffect, useState, useMemo} from 'react';
import {
  onSnapshot,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';
import {errorEmitter} from '../error-emitter';
import {FirestorePermissionError} from '../errors';

export function useDoc<T>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          setData({...(doc.data() as T), id: doc.id});
        } else {
          setData(null);
        }
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return {data, isLoading, error};
}
