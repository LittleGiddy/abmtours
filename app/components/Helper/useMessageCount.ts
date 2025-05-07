// hooks/useMessageCount.ts
'use client';
import { useEffect, useState } from 'react';

export function useMessageCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => setCount(data.length))
      .catch((err) => console.error('Failed to load message count:', err));
  }, []);

  return count;
}
