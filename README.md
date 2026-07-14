# EjiXhole — Portal público de reservaciones

Sitio público del ecosistema EjiXhole. Permite a visitantes conocer el
parque, consultar información, revisar disponibilidad, cotizar y enviar
solicitudes de reservación desde celular o computadora.

## Estado

Proyecto en **preproducción**. El flujo principal de reservación ya está
conectado al backend real y actualmente se encuentra en etapa de pruebas
integrales, optimización móvil y validación de contenido operativo.

## Tecnologías

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- React i18next
- Tailwind CSS
- Open-Meteo

## Funciones disponibles

- Página pública del parque
- Español e inglés
- Galería
- Actividades y servicios
- Clima
- Mapa y cómo llegar
- Preguntas frecuentes
- Redes sociales
- Flujo guiado de reservación
- Consulta de disponibilidad
- Cotización calculada por el backend
- Confirmación con folio real
- Metadatos SEO y Open Graph

## Flujo de reservación

```text
Inicio
→ tipo de reservación
→ fechas y número de personas
→ disponibilidad y cotización
→ datos del visitante
→ envío al backend
→ confirmación con folio
```

El total nunca se calcula en el navegador. El portal consulta al backend
para evitar diferencias entre los precios publicados y los precios reales.

## Arquitectura

```text
src/
├── api/          backend público y servicios externos
├── components/   secciones del sitio y elementos compartidos
├── context/      estado del flujo de reservación
├── i18n/         traducciones español/inglés
├── pages/        páginas públicas y pasos del formulario
├── router/       rutas de la aplicación
└── types/        contratos TypeScript
```

## Instalación local

```powershell
git clone https://github.com/JoseLH23/ejixhole-reservas.git
cd ejixhole-reservas

npm install
Copy-Item .env.example .env
npm run dev
```

La aplicación local se abre normalmente en:

```text
http://localhost:5174
```

## Configuración

En `.env` configura la API:

```env
VITE_API_URL=http://127.0.0.1:8000
```

En producción debe apuntar al dominio real del backend.

## Requisitos del backend

Antes de probar el flujo completo:

```powershell
alembic upgrade head
python -m scripts.seed_catalogo_publico
```

El backend debe estar activo y permitir el origen del portal mediante CORS.

## Compilación

```powershell
npm run build
```

## Prueba manual recomendada

1. Abrir el sitio desde celular.
2. Confirmar que carguen clima, actividades, galería y mapa.
3. Elegir un tipo de reservación.
4. Cambiar fechas y número de personas.
5. Verificar disponibilidad y total.
6. Completar los datos de contacto.
7. Enviar la solicitud.
8. Confirmar que aparezca el folio.
9. Revisar que la reservación aparezca en el panel administrativo.
10. Confirmar que llegue la notificación por correo cuando esté configurada.

## Principios del portal

- Experiencia clara y premium.
- Información real, sin promociones ni indicadores inventados.
- Precio y disponibilidad siempre consultados al backend.
- Diseño móvil como prioridad.
- Reservaciones seguras y simples.
- Contenido bilingüe consistente.

## Pendientes principales

1. Añadir pruebas end-to-end del flujo de reservación.
2. Optimizar fotografías y rendimiento móvil.
3. Validar textos, precios, políticas y ubicación final.
4. Añadir analítica de conversión respetuosa de privacidad.
5. Mejorar protección contra spam.
6. Verificar accesibilidad por teclado, contraste y lectores de pantalla.
7. Ejecutar una reservación real controlada de principio a fin.
8. Configurar integración continua con GitHub Actions.

## Relación con el ecosistema

- Consume endpoints públicos de `C-Ejixhole-Backend`.
- Las solicitudes aparecen en `ejixhole-frontend`.
- En una fase posterior, MindHigh podrá dirigir campañas al portal y
  MH-Core analizará qué contenido genera visitas, reservaciones e ingresos.

## Documentación maestra

La visión, arquitectura y roadmap general se mantienen en el repositorio
privado `MH-Ecosystem`.
