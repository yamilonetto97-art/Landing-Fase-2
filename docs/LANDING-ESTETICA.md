# Documentación Estética - Landing Fase 2 (Certificación San Marcos)

## El Secreto del Certificado

### Posicionamiento del Nombre

El certificado usa una imagen real (`/public/certificado-unmsm.jpg`) con el nombre superpuesto usando **CSS `position: absolute`**.

**Las coordenadas exactas son:**

```css
top: '50%'        /* Posición vertical - centrado verticalmente */
left: '28%'       /* Posición horizontal - alineado con el campo del nombre */
```

**Tipografía del nombre:**

```css
fontSize: 'clamp(12px, 2.1vw, 24px)'  /* Tamaño responsivo */
fontFamily: 'serif'                    /* Fuente con serifa (elegante) */
fontWeight: 'bold'                     /* Negrita */
color: 'gray-950'                      /* Casi negro */
letterSpacing: '0.03em'                /* Ligero espaciado entre letras */
textShadow: '0 0 1px rgba(0,0,0,0.1)'  /* Sombra sutil para integración */
```

**Ubicación del archivo:** `src/components/ui/certificate.tsx:38-51`

---

## Arquitectura de Componentes

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `Certificate` | `certificate.tsx` | Certificado con nombre dinámico + glow |
| `BorderBeam` | `border-beam.tsx` | Efecto de borde dorado animado |
| `ProgressBar` | `progress-bar.tsx` | Barra de progreso con fases |
| `CartoonButton` | `cartoon-button.tsx` | Botón estilo cartoon con hover |
| `Confetti` | `confetti.tsx` | Celebración con canvas-confetti |
| `Typewriter` | `typewriter-text.tsx` | Efecto máquina de escribir |
| `AnimatedTestimonials` | `testimonial.tsx` | Carrusel de testimonios |
| `GridBackground` | `grid-background.tsx` | Fondo con patrón de cuadrícula |
| `TimelineContent` | `timeline-animation.tsx` | Animación scroll reveal |

---

## Paleta de Colores

### Colores Primarios (Dorado/Ámbar)
```css
--primary: oklch(0.75 0.18 85)    /* Dorado principal */
#fbbf24                            /* Amarillo (amber-400) */
#f59e0b                            /* Ámbar (amber-500) */
```

### Gradientes por Fase

| Fase | Gradiente | Significado |
|------|-----------|-------------|
| Fase 1 | `from-blue-400 via-blue-500 to-blue-600` | Diferenciación |
| Fase 2 | `from-yellow-400 via-amber-500 to-orange-500` | Resistencia (crítico) |
| Fase 3 | `from-green-400 via-emerald-500 to-teal-600` | Autoridad (logro) |

---

## Efectos Visuales

### 1. BorderBeam (Glow Dorado Rotatorio)
```tsx
<BorderBeam
  duration={10}        // Rotación cada 10 segundos
  colorFrom="#fbbf24"  // Amarillo
  colorTo="#f59e0b"    // Ámbar
  borderWidth={4}      // 4px de grosor
/>
```

**Técnica:** Gradiente cónico (`conic-gradient`) con máscara interior que rota 360° infinitamente.

### 2. Shimmer en Barra de Progreso
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 3. Animación Spin Lento
```css
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spin-slow 8s linear infinite; }
```

### 4. Confetti
Se dispara automáticamente 800ms después de cargar exitosamente:
```tsx
confettiRef.current?.fire({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.3 }
})
```

---

## Tipografía

### Fuentes
- **Geist Sans** → `--font-geist-sans` (textos principales)
- **Geist Mono** → `--font-geist-mono` (código/datos)
- **Serif** → Solo para nombre en certificado

### Escalas de Texto
| Elemento | Clases |
|----------|--------|
| Título principal | `text-4xl sm:text-5xl font-extrabold` |
| Subtítulos | `text-3xl sm:text-4xl font-bold` |
| Texto progreso | `text-xl text-gray-600` |
| Footer | `text-xs text-gray-400` |

---

## Componente Typewriter

Textos que rotan con efecto máquina de escribir:

```tsx
<Typewriter
  text={[
    "Docentes que ya dominan la Inteligencia Artificial",
    "Docentes que corrigen en minutos, no en horas",
    "Docentes que sus colegas consultan como expertos",
    "Docentes que consiguieron su certificado este mes",
    "Docentes que dejaron de improvisar sus clases"
  ]}
  speed={60}         // ms por caracter
  deleteSpeed={30}   // ms al borrar
  delay={3000}       // pausa antes de borrar
  loop={true}
  cursor="_"
/>
```

---

## Background

### Grid Background
```tsx
// Fondo con gradiente radial + cuadrícula sutil
background: "radial-gradient(circle at center, #e8e8e8, #f0f0f0)"

// Líneas de cuadrícula (20x20px)
backgroundImage: `
  linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
`
backgroundSize: "20px 20px"
```

---

## CartoonButton

Botón con estilo cartoon y efectos hover:

```tsx
<CartoonButton
  label="Continuar mi progreso"
  color="bg-yellow-400"
  onClick={() => window.open('https://generaapp.com/')}
/>
```

**Efectos:**
- Sombra elevada al hover: `hover:shadow-[0_4px_0_0_#262626]`
- Elevación: `hover:-translate-y-1`
- Efecto de luz que cruza (shine)

---

## Testimonios

### Estilo AnimatedTestimonials
- Imágenes con rotación determinista: `((i * 7) % 15) - 7` grados
- Transición suave entre testimonios
- Autoplay cada 5 segundos
- Grid responsive: `grid-cols-1 md:grid-cols-2`

### Datos de Ejemplo
```tsx
{
  quote: "Conseguir mi certificación de San Marcos fue...",
  name: "Docente Certificada",
  designation: "Profesora de Primaria - Lima",
  src: "/testimonios/g1.png"
}
```

---

## Flujo de Datos del Certificado

```
URL con ?token=xxx
       ↓
API getProgress(token)
       ↓
ProgressResponse { user: { name }, progress: { ... } }
       ↓
<Certificate recipientName={user.name} />
       ↓
Nombre superpuesto con position: absolute
```

---

## SEO y Metadata

```tsx
metadata: {
  title: "Tu Progreso | Certificación San Marcos - Genera",
  description: "Visualiza tu progreso en la certificación...",
  robots: "noindex, nofollow"  // Landing privada
}
```

---

## Resumen Visual

```
┌─────────────────────────────────────────────────────┐
│               GRID BACKGROUND                       │
│  ┌───────────────────────────────────────────────┐  │
│  │  🎉 CONFETTI (al cargar)                      │  │
│  ├───────────────────────────────────────────────┤  │
│  │         TÍTULO GRADIENT DORADO               │  │
│  ├───────────────────────────────────────────────┤  │
│  │  ┌───────────────────────────────────────┐   │  │
│  │  │ 🏛️ CERTIFICADO SAN MARCOS            │   │  │
│  │  │    ┌─ GLOW BORDER DORADO ─┐           │   │  │
│  │  │    │  [imagen.jpg]        │           │   │  │
│  │  │    │      "María García"  │ ← top:50% │   │  │
│  │  │    │                      │   left:28%│   │  │
│  │  │    └──────────────────────┘           │   │  │
│  │  └───────────────────────────────────────┘   │  │
│  ├───────────────────────────────────────────────┤  │
│  │  ████████████░░░░░░░░  54% BARRA PROGRESO    │  │
│  ├───────────────────────────────────────────────┤  │
│  │  "María García, ya invertiste 6.5 meses..."   │  │
│  ├───────────────────────────────────────────────┤  │
│  │       [ Continuar mi progreso ]              │  │
│  ├───────────────────────────────────────────────┤  │
│  │  TYPEWRITER: "Docentes que ya dominan IA_"   │  │
│  ├───────────────────────────────────────────────┤  │
│  │  📸 TESTIMONIOS ANIMADOS                     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Resumen del "Secreto" del Certificado

El nombre aparece centrado y correcto porque:

1. **Posición absoluta** sobre la imagen del certificado
2. **`top: 50%`** - lo coloca verticalmente en el centro
3. **`left: 28%`** - lo coloca horizontalmente donde está el campo del nombre en el certificado real
4. **`clamp(12px, 2.1vw, 24px)`** - tamaño responsivo que escala con el viewport
5. **`fontFamily: 'serif'`** - fuente elegante que combina con el estilo del certificado
6. **`letterSpacing: '0.03em'`** - espaciado sutil para mejor legibilidad
