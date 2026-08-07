import React, { useEffect, useState } from "react";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? (window.scrollY / available) * 100 : 0);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent"><div className="h-full bg-leaf transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>;
}

export default ScrollProgress;
