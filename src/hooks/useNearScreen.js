import { useEffect, useRef, useState } from "react";

const useNearScreen = (rootMargin = "300px") => {
  const ref = useRef(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      // fallback: assume visible
      setIsNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNear(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return [ref, isNear];
};

export default useNearScreen;
