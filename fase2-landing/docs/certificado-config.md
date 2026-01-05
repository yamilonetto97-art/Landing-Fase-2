# Configuración del Certificado UNMSM

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `/public/certificado-unmsm.jpg` | Imagen del certificado oficial de San Marcos |
| `/src/components/ui/certificate.tsx` | Componente que renderiza el certificado con nombre dinámico |

---

## Posicionamiento del Nombre

El nombre del docente se superpone sobre la imagen del certificado usando CSS `position: absolute`.

### Valores actuales

```css
top: '50%'        /* Posición vertical */
left: '34%'       /* Posición horizontal */
fontSize: 'clamp(12px, 2.1vw, 24px)'  /* Tamaño responsivo */
fontFamily: 'serif'
fontWeight: 'bold'
color: 'gray-950'
letterSpacing: '0.03em'
```

### Cómo ajustar la posición

- **Mover hacia abajo:** Aumentar `top` (ej: `top: '52%'`)
- **Mover hacia arriba:** Disminuir `top` (ej: `top: '48%'`)
- **Mover hacia la derecha:** Aumentar `left` (ej: `left: '38%'`)
- **Mover hacia la izquierda:** Disminuir `left` (ej: `left: '30%'`)

---

## Efecto BorderBeam (Glow)

El certificado tiene un efecto de glow dorado animado que rota alrededor del borde.

### Configuración actual

```tsx
<BorderBeam
  duration={10}        // Velocidad de rotación (segundos)
  colorFrom="#fbbf24"  // Color inicial (amarillo)
  colorTo="#f59e0b"    // Color final (ámbar)
  borderWidth={4}      // Grosor del borde
/>
```

---

## Uso del Componente

```tsx
import { Certificate } from "@/components/ui/certificate"

<Certificate
  recipientName="María García Quispe"  // Nombre del docente
  className="max-w-2xl"                 // Clases opcionales
/>
```

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `recipientName` | `string` | Nombre del docente a mostrar en el certificado |
| `className` | `string?` | Clases CSS adicionales (opcional) |

---

## Flujo de Datos

```
API (token) → page.tsx (user.name) → Certificate (recipientName) → Texto superpuesto
```

El nombre del docente viene de la API cuando se carga la página con un token válido.
