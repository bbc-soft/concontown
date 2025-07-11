// hooks/useSiteInfo.ts
import { useEffect, useState } from 'react';

export default function useSiteInfo(lang: string) {
  const [data, setData] = useState<{ Terms_of_Use?: string; Privacy_Policy?: string } | null>(null);

  useEffect(() => {
    fetch(`/api/siteInfo?LangId=${lang.toUpperCase()}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => {
        console.error('사이트 정보 로드 실패:', err);
        setData(null);
      });
  }, [lang]);

  return data;
}
