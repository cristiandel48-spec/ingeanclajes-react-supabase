# Ingeanclajes - Formato exacto PDF

Esta versión reestructura la cotización para que se parezca al PDF real de Ingeanclajes:

- Encabezado con fecha, número de cotización, señor, obra, teléfono y ciudad
- Bloque descriptivo técnico
- Tabla económica con columnas:
  - DESCRIPCION
  - CANTIDAD
  - VALOR
  - SUBTOTAL
- Bloque de condiciones comerciales
- Página técnica de sistema no continuo
- Página técnica de escalera
- Bloque final de inclusiones, SG-SST y firma
- Ítems dinámicos para que Camila agregue todas las líneas de vida que quiera
- Opciones para:
  - Estructuras metálicas
  - Pérgolas
  - Puntos de anclaje nacionales
  - Puntos de anclaje importados
  - Escotillas
  - Escaleras

## Ejecutar
```bash
npm install
npm run dev
```

## Publicar
Se despliega en Vercel como proyecto Vite con:
- Root Directory: ./
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install
