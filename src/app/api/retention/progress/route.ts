/**
 * API Endpoint MOCK: GET /api/retention/progress?dni=XXXXXXXX
 *
 * Este es un endpoint temporal que simula la respuesta del webhook de n8n.
 * En producción, la landing llamará directamente al webhook de n8n.
 */

import { NextRequest, NextResponse } from 'next/server'

// Datos mockeados de docentes (basados en el Sheet real)
const MOCK_DOCENTES = [
  { dni: '24462219', nombres: 'Sabina', apellidos: 'Bueno Oros', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-04T17:49:52.000Z' },
  { dni: '24462772', nombres: 'Aquiles', apellidos: 'Cruz Chaparro', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-12T19:51:43.000Z' },
  { dni: '41728286', nombres: 'Benigna Jovita', apellidos: 'Huillca Quispe', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-12T19:52:02.000Z' },
  { dni: '02167713', nombres: 'Jose', apellidos: 'Ramos Quisocala', cargo: 'Docente Contratado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-12T19:53:25.000Z' },
  { dni: '71107940', nombres: 'Nieves Brígida', apellidos: 'Merma Llamacponcca', cargo: 'Docente Contratado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-15T17:06:41.000Z' },
  { dni: '23989905', nombres: 'Carlos', apellidos: 'Puma Aucca', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-15T17:13:16.000Z' },
  { dni: '73815096', nombres: 'Flor Angélica', apellidos: 'Cayavilca Condori', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-15T17:24:41.000Z' },
  { dni: '24493843', nombres: 'Edgard', apellidos: 'Zapata Quispe', cargo: 'Docente Contratado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-15T17:39:30.000Z' },
  { dni: '80186530', nombres: 'Yanet Lucy', apellidos: 'Sullca Arana', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-15T20:55:18.000Z' },
  { dni: '42124998', nombres: 'Jesus', apellidos: 'Huahuasoncco Mayo', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-15T21:22:16.000Z' },
  { dni: '25302217', nombres: 'Patricia Eliana', apellidos: 'Vargas Montañez', cargo: 'Docente Nombrado', ugel: 'UGEL CALCA', fechaRegistro: '2025-12-15T21:34:02.000Z' },
  { dni: '23978138', nombres: 'María Elena', apellidos: 'Yabar Villa', cargo: 'Docente Contratado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-10T19:44:09.000Z' },
  { dni: '76047396', nombres: 'Alexander Felipe', apellidos: 'Ccorimanya Yuca', cargo: 'Docente Contratado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-10T19:46:02.000Z' },
  { dni: '76579788', nombres: 'Soledad Bleni', apellidos: 'Apaza Chino', cargo: 'Docente Contratado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-10T19:46:55.000Z' },
  { dni: '25222787', nombres: 'Flavio Larry', apellidos: 'Quispe Quispe', cargo: 'Docente Nombrado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-10T19:50:34.000Z' },
  { dni: '23968841', nombres: 'Antonio', apellidos: 'Vargas Rodríguez', cargo: 'Docente Nombrado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-10T19:57:41.000Z' },
  { dni: '71667934', nombres: 'Henry', apellidos: 'Vilavila', cargo: 'Docente Contratado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-10T20:46:40.000Z' },
  { dni: '80319354', nombres: 'Ysmael', apellidos: 'Mamani Camacho', cargo: 'Docente Nombrado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-11T09:25:39.000Z' },
  { dni: '48553058', nombres: 'Maritza', apellidos: 'Qquenaya Tunquipa', cargo: 'Docente Contratado', ugel: 'UGEL QUISPICANCHI', fechaRegistro: '2025-12-11T11:20:52.000Z' },
]

export async function GET(request: NextRequest) {
  try {
    // Obtener DNI del query parameter
    const { searchParams } = new URL(request.url)
    const dni = searchParams.get('dni')

    // Validar que se proporcionó un DNI
    if (!dni) {
      return NextResponse.json(
        { success: false, error: 'DNI no proporcionado' },
        { status: 400 }
      )
    }

    // Validar formato de DNI (8 dígitos)
    if (!/^\d{8}$/.test(dni)) {
      return NextResponse.json(
        { success: false, error: 'Formato de DNI inválido' },
        { status: 400 }
      )
    }

    // Buscar docente por DNI
    const docente = MOCK_DOCENTES.find(d => d.dni === dni)

    if (!docente) {
      return NextResponse.json(
        { success: false, error: 'DNI no encontrado en el sistema' },
        { status: 404 }
      )
    }

    // Retornar respuesta en formato de n8n
    return NextResponse.json({
      success: true,
      data: {
        dni: docente.dni,
        nombreCompleto: `${docente.nombres} ${docente.apellidos}`,
        cargo: docente.cargo,
        ugel: docente.ugel,
        fechaRegistro: docente.fechaRegistro
      }
    })

  } catch (error) {
    console.error('Error en /api/retention/progress:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}
