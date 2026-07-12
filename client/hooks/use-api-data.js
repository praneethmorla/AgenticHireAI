"use client";

import { useEffect, useState } from "react";

export function useApiData(loader, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loader()
      .then((result) => mounted && setData(result))
      .catch((loadError) => mounted && setError(loadError.message))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, error, loading, setData };
}
