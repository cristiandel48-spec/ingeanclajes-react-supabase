
# Ingeanclajes - Sistema modular completo

Módulos incluidos:
- Dashboard
- Nueva Cotización
- Planos & Obra
- Pagos Bancolombia
- Mis Obras
- Nómina
- Horarios por obra y por empleado

## Incluye
- Cotización con Google Maps URL e imagen satelital
- Planos por cliente y por obra con trazos y puntos
- Costos por plano
- Pagos por cliente y por obra
- Seguimiento de obras y saldo pendiente
- Nómina con 12 empleados de ejemplo
- Generación de CSV tipo plano Bancolombia para obras y nómina
- Horarios semanales por empleado y por obra

## Ejecutar
```bash
npm install
npm run dev
```

## Publicar en Vercel
- Root Directory: ./
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install

## Nota
La generación de "plano Bancolombia" en esta demo exporta CSV. La integración bancaria real necesita credenciales y especificación final del formato del banco.
