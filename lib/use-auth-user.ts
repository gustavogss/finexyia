'use client';

import React from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuthUser() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  return { user, isReady };
}
