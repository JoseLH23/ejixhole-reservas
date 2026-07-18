# Contribuir a ejixhole-reservas

## Flujo obligatorio

1. Crear una rama desde `main`.
2. Mantener un objetivo principal por cambio.
3. Conservar al backend como fuente de precio, disponibilidad y reglas.
4. Añadir o actualizar pruebas.
5. Ejecutar pruebas, compilación y presupuesto de rendimiento.
6. Abrir un pull request usando la plantilla.
7. Verificar el preview desde celular antes de fusionar.

## Nombres de ramas

- `feat/...` para funciones.
- `fix/...` para correcciones.
- `security/...` para endurecimiento.
- `docs/...` para documentación.
- `cto/...` para bloques coordinados del roadmap.

## Reglas técnicas

- No guardar datos personales del formulario en almacenamiento persistente del navegador.
- No calcular totales comerciales en el frontend.
- Reutilizar la misma identidad de operación cuando un resultado sea incierto.
- Mantener español e inglés alineados.
- Considerar teclado, contraste, lectores de pantalla y movimiento reducido.
- Evitar cargar fotografías o secciones innecesarias en el primer render.

## Comandos mínimos

```powershell
npm ci
npm test
npm run build
npm run performance:check
```

La definición completa de terminado incluye pruebas, CI verde, manejo de errores, preview móvil, documentación y rollback cuando corresponda.
