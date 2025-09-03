# Calabria • Demo e-commerce con WhatsApp (Astro + Tailwind + Motion One)

## Requisitos
- Node 18+

## Pasos
```bash
npm install
npm run dev
# abrir http://localhost:4321
```
Para producción:
```bash
npm run build
npm run preview
```
### Cambiar número de WhatsApp
Editá `src/pages/index.astro` y reemplazá `54911XXXXXXXX` por el número real (formato internacional sin +).

### Datos de productos
`src/data/products.json` (colores, talles por prenda).

### Estilos
Tailwind v3 en `src/styles/global.css`.

### Animaciones
[Motion One](https://motion.dev/) ya incluido. Animaciones de cards y modal en `index.astro`.
