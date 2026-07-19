# Release y rollback del portal

## Gate

- La etiqueta coincide con el manifiesto y `package.json`.
- Tests, build, presupuesto de rendimiento y seguridad están verdes.
- La compatibilidad central confirma la API pública v1.
- El artefacto construido y sus hashes quedan adjuntos al release.

## Despliegue

El backend compatible se despliega primero. Después se publica el portal y se ejecuta el smoke test con su URL HTTPS definitiva. La creación de reservaciones reales se valida únicamente en un entorno controlado.

## Rollback

El portal puede volver al artefacto anterior mientras su contrato público siga disponible. Conservar etiqueta, commit, evidencia, métricas de rendimiento y resultado del smoke test.
