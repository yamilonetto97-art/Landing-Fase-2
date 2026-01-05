"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import Image from "next/image";
import { useRef } from "react";

/**
 * Testimonios de docentes que completaron su certificación.
 * Diseñado para generar confianza y prueba social.
 */
export function DocenteTestimonials() {
  const testimonialRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: 20,
      opacity: 0,
    },
  };

  // Testimonios de docentes (datos de ejemplo)
  const testimonios = [
    {
      nombre: "María Elena Quispe",
      cargo: "Docente de Primaria",
      ciudad: "Lima",
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
      texto: "Pensé en abandonar varias veces, pero valió cada esfuerzo. Ahora tengo mi certificado de San Marcos y me abrió puertas que nunca imaginé.",
      destacado: true,
      colorBg: "bg-gradient-to-br from-orange-500 to-red-600",
      colorTexto: "text-white"
    },
    {
      nombre: "Carlos Mendoza",
      cargo: "Docente de Secundaria",
      ciudad: "Arequipa",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      texto: "El certificado de San Marcos marca la diferencia. Mis colegas me preguntan cómo lo conseguí.",
      destacado: false,
      colorBg: "bg-white",
      colorTexto: "text-gray-800"
    },
    {
      nombre: "Ana Lucía Torres",
      cargo: "Docente de Inicial",
      ciudad: "Cusco",
      foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
      texto: "12 meses de dedicación que cambiaron mi carrera profesional. Lo recomiendo a todos mis colegas.",
      destacado: false,
      colorBg: "bg-gray-900",
      colorTexto: "text-white"
    },
    {
      nombre: "Roberto Huamán",
      cargo: "Docente de Matemáticas",
      ciudad: "Trujillo",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      texto: "El respaldo de San Marcos en mi CV fue clave para mi ascenso. No hay mejor inversión.",
      destacado: false,
      colorBg: "bg-white",
      colorTexto: "text-gray-800"
    }
  ];

  return (
    <section 
      ref={testimonialRef}
      className="w-full py-12"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <TimelineContent
          animationNum={0}
          customVariants={revealVariants}
          timelineRef={testimonialRef}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Docentes que ya recibieron su certificado este mes
          </h2>
          <p className="text-gray-500">
            Ellos también estuvieron donde tú estás ahora
          </p>
        </TimelineContent>
      </div>

      {/* Grid de testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonios.map((testimonio, index) => (
          <TimelineContent
            key={index}
            animationNum={index + 1}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
            className={`
              ${testimonio.colorBg} ${testimonio.colorTexto}
              rounded-xl p-5 shadow-lg border border-gray-100
              ${testimonio.destacado ? 'md:col-span-2' : ''}
            `}
          >
            {/* Texto del testimonio */}
            <p className={`
              ${testimonio.destacado ? 'text-lg' : 'text-base'}
              mb-4 leading-relaxed
            `}>
              &ldquo;{testimonio.texto}&rdquo;
            </p>
            
            {/* Info del docente */}
            <div className="flex items-center gap-3">
              <Image
                src={testimonio.foto}
                alt={testimonio.nombre}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <p className="font-semibold">{testimonio.nombre}</p>
                <p className={`text-sm ${testimonio.colorTexto === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>
                  {testimonio.cargo} · {testimonio.ciudad}
                </p>
              </div>
            </div>
          </TimelineContent>
        ))}
      </div>

      {/* Estadística final */}
      <TimelineContent
        animationNum={testimonios.length + 1}
        customVariants={revealVariants}
        timelineRef={testimonialRef}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500">
          <span className="font-bold text-orange-600">+127 docentes</span> ya recibieron su certificado este mes
        </p>
      </TimelineContent>
    </section>
  );
}

export default DocenteTestimonials;
