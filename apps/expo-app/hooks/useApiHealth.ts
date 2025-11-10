import { useEffect, useState } from "react";

export default function useApiHealth(apiUrl: string) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${apiUrl}/health`);
      if (res.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000); // check every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return isOnline;
}