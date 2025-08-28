import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { nombre, email } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Guardar en la base de datos
    try {
      await executeQuery(
        'INSERT INTO suscriptores (nombre, email, fecha_registro) VALUES (?, ?, NOW())',
        [nombre || null, email]
      );
    } catch (dbError: any) {
      // Si el email ya existe, puedes manejar el error según el código de error de MySQL
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Este email ya está registrado.' }, { status: 409 });
      }
      console.error('Error al guardar en la base de datos:', dbError);
      return NextResponse.json({ error: 'Error al guardar en la base de datos.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registro exitoso' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
