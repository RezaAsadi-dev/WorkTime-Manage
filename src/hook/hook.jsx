

export function useRealVh() {
  const setRealVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--real-vh", `${vh}px`);
  };

  setRealVh();
  window.addEventListener("resize", setRealVh);
  return () => window.removeEventListener("resize", setRealVh);
}
