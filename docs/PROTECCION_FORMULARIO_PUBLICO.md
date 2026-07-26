# Protección del formulario público

El portal obtiene un desafío firmado antes del envío, conserva la misma identidad durante reintentos idempotentes y agrega un honeypot que no participa en la navegación ni en la accesibilidad del formulario.

## Privacidad

- El identificador del navegador es aleatorio, temporal y se conserva solo durante la pestaña actual.
- Cuando `sessionStorage` no está disponible, se usa memoria local de la aplicación.
- El portal no recibe ni almacena las huellas seudónimas calculadas por el backend.

## Recuperación

- Si falla la carga inicial del desafío, se vuelve a intentar al enviar.
- Si el desafío caduca antes del primer envío, se solicita uno nuevo.
- Después del primer intento, el desafío, el cuerpo y la `Idempotency-Key` permanecen iguales durante los reintentos.

El backend debe desplegarse primero en modo `monitor`; posteriormente se despliega este portal y, tras revisar la telemetría, puede activarse el modo `enforce`.
