import * as React from "react";

export function BarraProgreso() {
  const [progreso, setProgreso] = React.useState(0);

  React.useEffect(() => {
    const calcular = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const scroll = window.scrollY;
      setProgreso(alto > 0 ? (scroll / alto) * 100 : 0);
    };
    window.addEventListener("scroll", calcular, { passive: true });
    calcular();
    return () => window.removeEventListener("scroll", calcular);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-150 ease-out"
        style={{ width: `${progreso}%` }}
      />
    </div>
  );
}
