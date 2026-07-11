import { MessageCircle } from "lucide-react";

const TELEFONO = "+52 444 498 2492";
const MENSAJE = encodeURIComponent("Hola, quiero información sobre EjiXhole 🌊");
const WHATSAPP_URL = `https://wa.me/${TELEFONO.replace(/[^0-9]/g, "")}?text=${MENSAJE}`;

/**
 * MessageCircle ya está probado (se usa en el Footer sin errores).
 * Fijo en la esquina inferior derecha, sobre todo el sitio.
 */
export function WhatsAppFlotante() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
