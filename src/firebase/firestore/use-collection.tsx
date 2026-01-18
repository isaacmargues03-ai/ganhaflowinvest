'use client';

import {useEffect, useState, useMemo} from 'react';
import {
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import {errorEmitter} from '../error-emitter';
import {FirestorePermissionError} from '../errors';

export function useCollection<T>(q: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({...(doc.data() as T), id: doc.id});
        });
        setData(data);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'collection', // Note: Can't get full path from query object easily
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return {data, isLoading, error};
}

export function useMemoFirebase<T>(factory: () => T, deps: any[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
