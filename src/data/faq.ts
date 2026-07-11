export interface PreguntaFAQ {
  pregunta: string;
  respuesta: string;
  destacada?: boolean;
}

export interface CategoriaFAQ {
  categoria: string;
  emoji: string;
  preguntas: PreguntaFAQ[];
}

/**
 * Todas las respuestas vienen directamente de lo que confirmó el
 * dueño del parque — nada inventado. Las preguntas que no tenían
 * respuesta real confirmada (ej. "¿transporte público cercano?",
 * "¿se puede visitar sin reservación?") se dejaron fuera a propósito,
 * en vez de rellenarlas con una respuesta genérica.
 */
export const FAQ_ES: CategoriaFAQ[] = [
  {
    categoria: "Reservaciones",
    emoji: "📅",
    preguntas: [
      {
        pregunta: "¿Cómo puedo hacer una reservación?",
        destacada: true,
        respuesta: "Directamente desde este sitio web, con el asistente de 3 pasos, o por WhatsApp.",
      },
      {
        pregunta: "¿Necesito reservar con anticipación?",
        respuesta:
          "Es recomendable, sobre todo en temporada alta — el parque tiene cupo limitado en esas fechas.",
      },
      {
        pregunta: "¿Puedo reservar el mismo día?",
        respuesta: "Depende de la disponibilidad real de esa fecha — el sistema la verifica al momento.",
      },
      {
        pregunta: "¿Cómo sé si mi reservación fue confirmada?",
        respuesta: "Te contactaremos para confirmar tu solicitud por correo o teléfono.",
      },
      {
        pregunta: "¿Puedo modificar mi reservación?",
        respuesta: "Sí, puedes solicitar cambios de fecha u horario con anticipación, sujetos a disponibilidad.",
      },
      {
        pregunta: "¿Cuál es la política de cancelación?",
        destacada: true,
        respuesta:
          "Las cancelaciones pueden solicitarse con anticipación (mínimo 48 horas). El reembolso o la reprogramación dependerán del tiempo de anticipación con el que se solicite. Si tienes dudas, contáctanos y revisamos tu caso.",
      },
      {
        pregunta: "¿Qué pasa si llego tarde?",
        respuesta:
          "Te recomendamos llegar al menos 15 minutos antes de tu horario. Si llegas tarde, haremos lo posible por atenderte, pero la experiencia podría verse afectada según la disponibilidad del día.",
      },
    ],
  },
  {
    categoria: "Pagos",
    emoji: "💳",
    preguntas: [
      {
        pregunta: "¿Qué métodos de pago aceptan?",
        destacada: true,
        respuesta: "Efectivo, tarjeta de crédito y tarjeta de débito.",
      },
      { pregunta: "¿Se requiere un anticipo?",
        destacada: true, respuesta: "Sí, se maneja un modelo de depósito parcial." },
      { pregunta: "¿Puedo pagar a meses sin intereses?", respuesta: "Por el momento no contamos con meses sin intereses." },
      {
        pregunta: "¿Emiten factura?",
        respuesta: "Sí. Solicítala al momento de tu pago o dentro del plazo que marca la legislación fiscal.",
      },
    ],
  },
  {
    categoria: "Experiencia",
    emoji: "🏕️",
    preguntas: [
      {
        pregunta: "¿Qué incluye la experiencia?",
        respuesta:
          "La entrada al parque incluye acceso a las zonas naturales. Camping y hospedaje se cotizan aparte. Las actividades (lancha, kayak, tubing, snorkel, etc.) se contratan directamente en el parque.",
      },
      {
        pregunta: "¿Cuánto dura el recorrido?",
        respuesta: "Depende de la experiencia o paquete elegido — al reservar puedes consultar el tiempo estimado.",
      },
      { pregunta: "¿Hay paquetes disponibles?", respuesta: "Sí, contamos con diferentes experiencias y paquetes." },
      { pregunta: "¿Hay guías durante el recorrido?", respuesta: "Sí, contamos con guías turísticos." },
    ],
  },
  {
    categoria: "Ubicación",
    emoji: "📍",
    preguntas: [
      { pregunta: "¿Dónde se encuentra EjiXhole?", respuesta: "En El Naranjo, San Luis Potosí, en la Huasteca Potosina." },
      {
        pregunta: "¿Cómo puedo llegar?",
        respuesta: "El camino final es de terracería — te recomendamos revisar la ruta antes de salir (ver el mapa arriba).",
      },
      { pregunta: "¿Hay estacionamiento?",
        destacada: true, respuesta: "Sí, contamos con estacionamiento para visitantes." },
      {
        pregunta: "¿El acceso es apto para cualquier vehículo?",
        respuesta: "Es adecuado para automóviles, camionetas y combis — no para autobuses.",
      },
    ],
  },
  {
    categoria: "Visitantes",
    emoji: "👨‍👩‍👧‍👦",
    preguntas: [
      { pregunta: "¿Hay descuentos para niños?",
        destacada: true, respuesta: "No, el costo es el mismo para adultos y niños." },
      {
        pregunta: "¿Aceptan grupos grandes?",
        respuesta: "Sí, recibimos grupos familiares, escolares, empresariales y agencias de viaje.",
      },
      { pregunta: "¿Organizan eventos privados?", respuesta: "Sí, si aplica según el tipo de evento." },
    ],
  },
  {
    categoria: "Mascotas",
    emoji: "🐶",
    preguntas: [
      { pregunta: "¿Se permiten mascotas?",
        destacada: true, respuesta: "Sí, las mascotas son bienvenidas." },
      {
        pregunta: "¿Hay restricciones para las mascotas?",
        respuesta: "Por seguridad de todos, deberán permanecer bajo supervisión y respetar las áreas permitidas.",
      },
    ],
  },
  {
    categoria: "Clima",
    emoji: "🌦️",
    preguntas: [
      {
        pregunta: "¿Qué pasa si llueve?",
        respuesta:
          "La mayoría de las actividades pueden continuar con lluvia ligera. Si las condiciones representan un riesgo, podemos reprogramar la experiencia.",
      },
      {
        pregunta: "¿Cuál es la mejor temporada para visitar?",
        destacada: true,
        respuesta:
          "EjiXhole puede disfrutarse todo el año — cada temporada ofrece paisajes distintos. Si buscas el tono turquesa más intenso del río, se recomienda visitar de noviembre a abril.",
      },
    ],
  },
  {
    categoria: "Recomendaciones",
    emoji: "🎒",
    preguntas: [
      {
        pregunta: "¿Qué ropa y calzado recomiendan?",
        respuesta: "Ropa cómoda, gorra o sombrero, y calzado deportivo o antiderrapante.",
      },
      {
        pregunta: "¿Qué objetos debo llevar?",
        respuesta: "Agua, protector solar, repelente de insectos, gorra o sombrero, lentes de sol, y cámara o celular.",
      },
      {
        pregunta: "¿Hay lockers o área para guardar pertenencias?",
        respuesta: "Por el momento no contamos con lockers — te recomendamos llevar solo lo necesario.",
      },
    ],
  },
  {
    categoria: "Servicios",
    emoji: "🍽️",
    preguntas: [
      {
        pregunta: "¿Hay restaurante o cafetería?",
        respuesta: "Todavía no — te recomendamos traer tus alimentos. La tienda más cercana está a 15-20 min.",
      },
      { pregunta: "¿Hay baños?", respuesta: "Sí, contamos con baños y regaderas." },
      {
        pregunta: "¿Hay acceso para personas con discapacidad?",
        respuesta:
          "Estamos trabajando en ofrecer una experiencia cada vez más accesible. Contáctanos antes de tu visita si tienes algún requerimiento especial.",
      },
      {
        pregunta: "¿Hay señal de celular o Wi-Fi?",
        respuesta: "La señal celular puede variar según la compañía. Por ahora no contamos con Wi-Fi para visitantes.",
      },
    ],
  },
  {
    categoria: "Fotografía",
    emoji: "📸",
    preguntas: [
      { pregunta: "¿Se permiten drones?", respuesta: "Sí, con autorización previa del personal." },
      {
        pregunta: "¿Se permiten sesiones fotográficas profesionales?",
        respuesta: "Sí — si es una sesión profesional o comercial, te recomendamos contactarnos antes.",
      },
    ],
  },
  {
    categoria: "Seguridad",
    emoji: "🛡️",
    preguntas: [
      { pregunta: "¿Cuentan con primeros auxilios?", respuesta: "Sí, contamos con personal preparado para atender situaciones básicas." },
      { pregunta: "¿Hay personal capacitado?", respuesta: "Sí, nuestro equipo está capacitado para brindar atención y orientación." },
    ],
  },
  {
    categoria: "Contacto",
    emoji: "📞",
    preguntas: [
      { pregunta: "¿Tienen WhatsApp?", respuesta: "Sí." },
      { pregunta: "¿Cuáles son sus horarios de atención?",
        destacada: true, respuesta: "Lunes a domingo, de 8:00 a.m. a 7:00 p.m." },
      { pregunta: "¿Dónde puedo seguirlos en redes sociales?",
        destacada: true, respuesta: "En TikTok y Facebook — ver enlaces abajo." },
    ],
  },
];

export const FAQ_EN: CategoriaFAQ[] = [
  {
    categoria: "Reservations",
    emoji: "📅",
    preguntas: [
      { pregunta: "How do I make a reservation?",
        destacada: true, respuesta: "Directly on this website with the 3-step wizard, or via WhatsApp." },
      {
        pregunta: "Do I need to book in advance?",
        respuesta: "It's recommended, especially in high season — the park has limited capacity during those dates.",
      },
      { pregunta: "Can I book the same day?", respuesta: "It depends on real availability for that date — the system checks it instantly." },
      { pregunta: "How do I know my reservation was confirmed?", respuesta: "We'll contact you to confirm your request by email or phone." },
      { pregunta: "Can I change my reservation?", respuesta: "Yes, you can request date or time changes in advance, subject to availability." },
      {
        pregunta: "What is the cancellation policy?",
        destacada: true,
        respuesta:
          "Cancellations can be requested in advance (minimum 48 hours). Refund or rescheduling depends on how much notice is given. Contact us with any questions and we'll review your case.",
      },
      {
        pregunta: "What happens if I arrive late?",
        respuesta:
          "We recommend arriving at least 15 minutes early. If you're late, we'll do our best to assist you, but the experience may be affected depending on the day's availability.",
      },
    ],
  },
  {
    categoria: "Payments",
    emoji: "💳",
    preguntas: [
      { pregunta: "What payment methods do you accept?",
        destacada: true, respuesta: "Cash, credit card, and debit card." },
      { pregunta: "Is a deposit required?",
        destacada: true, respuesta: "Yes, we use a partial deposit model." },
      { pregunta: "Can I pay in interest-free installments?", respuesta: "Not at this time." },
      { pregunta: "Do you issue invoices?", respuesta: "Yes. Request it when paying or within the legal tax filing window." },
    ],
  },
  {
    categoria: "Experience",
    emoji: "🏕️",
    preguntas: [
      {
        pregunta: "What does the experience include?",
        respuesta:
          "Park entrance includes access to the natural areas. Camping and lodging are quoted separately. Activities (boat rides, kayaking, tubing, snorkeling, etc.) are booked directly at the park.",
      },
      { pregunta: "How long does the visit last?", respuesta: "It depends on the experience or package chosen — you can check the estimated time when booking." },
      { pregunta: "Are there packages available?", respuesta: "Yes, we offer different experiences and packages." },
      { pregunta: "Are there guides during the tour?", respuesta: "Yes, we have tour guides." },
    ],
  },
  {
    categoria: "Location",
    emoji: "📍",
    preguntas: [
      { pregunta: "Where is EjiXhole located?", respuesta: "In El Naranjo, San Luis Potosí, in the Huasteca Potosina." },
      { pregunta: "How do I get there?", respuesta: "The final stretch is a dirt road — check your route before heading out (see the map above)." },
      { pregunta: "Is there parking?",
        destacada: true, respuesta: "Yes, we have parking for visitors." },
      { pregunta: "Is the access suitable for any vehicle?", respuesta: "It's suitable for cars, pickup trucks, and vans — not for buses." },
    ],
  },
  {
    categoria: "Visitors",
    emoji: "👨‍👩‍👧‍👦",
    preguntas: [
      { pregunta: "Are there discounts for children?",
        destacada: true, respuesta: "No, the cost is the same for adults and children." },
      { pregunta: "Do you accept large groups?", respuesta: "Yes, we welcome family, school, and corporate groups, as well as travel agencies." },
      { pregunta: "Do you organize private events?", respuesta: "Yes, depending on the type of event." },
    ],
  },
  {
    categoria: "Pets",
    emoji: "🐶",
    preguntas: [
      { pregunta: "Are pets allowed?",
        destacada: true, respuesta: "Yes, pets are welcome." },
      { pregunta: "Are there restrictions for pets?", respuesta: "For everyone's safety, pets must stay supervised and within permitted areas." },
    ],
  },
  {
    categoria: "Weather",
    emoji: "🌦️",
    preguntas: [
      {
        pregunta: "What happens if it rains?",
        respuesta: "Most activities can continue in light rain. If conditions become risky, we may reschedule the experience.",
      },
      {
        pregunta: "What's the best season to visit?",
        destacada: true,
        respuesta:
          "EjiXhole can be enjoyed year-round — each season offers different scenery. For the most intense turquoise color in the river, visitors recommend November to April.",
      },
    ],
  },
  {
    categoria: "Recommendations",
    emoji: "🎒",
    preguntas: [
      { pregunta: "What clothing and footwear do you recommend?", respuesta: "Comfortable clothing, a cap or hat, and sports or non-slip shoes." },
      { pregunta: "What should I bring?", respuesta: "Water, sunscreen, insect repellent, a cap or hat, sunglasses, and a camera or phone." },
      { pregunta: "Are there lockers or a storage area?", respuesta: "Not at this time — we recommend bringing only what you need." },
    ],
  },
  {
    categoria: "Services",
    emoji: "🍽️",
    preguntas: [
      { pregunta: "Is there a restaurant or café?", respuesta: "Not yet — we recommend bringing your own food. The nearest store is 15-20 minutes away." },
      { pregunta: "Are there restrooms?", respuesta: "Yes, we have restrooms and showers." },
      {
        pregunta: "Is there accessible access for people with disabilities?",
        respuesta: "We're working on making the experience more accessible. Contact us before your visit if you have any special requirements.",
      },
      { pregunta: "Is there cell signal or Wi-Fi?", respuesta: "Cell signal may vary by carrier. We don't currently offer Wi-Fi for visitors." },
    ],
  },
  {
    categoria: "Photography",
    emoji: "📸",
    preguntas: [
      { pregunta: "Are drones allowed?", respuesta: "Yes, with prior authorization from staff." },
      { pregunta: "Are professional photo sessions allowed?", respuesta: "Yes — for professional or commercial sessions, please contact us beforehand." },
    ],
  },
  {
    categoria: "Safety",
    emoji: "🛡️",
    preguntas: [
      { pregunta: "Do you have first aid?", respuesta: "Yes, we have staff prepared to handle basic first aid situations." },
      { pregunta: "Is the staff trained?", respuesta: "Yes, our team is trained to provide guidance and assistance." },
    ],
  },
  {
    categoria: "Contact",
    emoji: "📞",
    preguntas: [
      { pregunta: "Do you have WhatsApp?", respuesta: "Yes." },
      { pregunta: "What are your business hours?",
        destacada: true, respuesta: "Monday to Sunday, 8:00 a.m. to 7:00 p.m." },
      { pregunta: "Where can I follow you on social media?",
        destacada: true, respuesta: "TikTok and Facebook — see the links below." },
    ],
  },
];
