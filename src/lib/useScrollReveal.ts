import * as React from "react";

/**
 * Hook simple de "aparición al hacer scroll" usando IntersectionObserver
 * (API nativa del navegador, sin librería extra). Devuelve un ref para
 * poner en el elemento y una clase que se agrega cuando entra en pantalla.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // solo una vez, no se re-oculta al salir de vista
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(nodo);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `scroll-reveal ${visible ? "visible" : ""}` };
}
