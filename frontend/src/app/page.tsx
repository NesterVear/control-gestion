'use client'

import { useState, useEffect, use } from "react"
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User } from "@nextui-org/react"
import CapturaForm from "@/components/CapturaForm";

export default function Home() {
  const [user, setUser] = useState<{ id: number, rol: string } | null>(null)
  const [capturas, setCapturas] = useState([])

  const login = async () => {
    const res = await fetch('http://localhost:5000/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'admin', contrasena: 'admin123' }),
    })
    const data = await res.json()
    if (data.id) setUser({ id: data.id, rol: data.rol })
      alert(data.mensaje || data.error)
  }

  const fetchCapturas = async () => {
    if (!user) return
    const res = await fetch('http://localhost:5000/captura/',{
      headers: { 'User-ID': user.id.toString() }
    })
    const data = await res.json()
    setCapturas(data)
  }

  useEffect(() => {
    fetchCapturas()
  }, [user])

  return (
    <main className="min-h-screen p-8 bg-gra-900">
      <h1 className="text-3xl font-bold mb-8">Control de Gestión</h1>
      {!user ? ( 
        <Button onClick={login} color="primary">Iniciar Sesión</Button>
      ) : (
        <>
        <CapturaForm userId={user.id} rol={user.rol} />
        <Table arial-label="Capturas" className="mt-8">
          <TableHeader>
            <TableColumn>Folio</TableColumn>
            <TableColumn>Fecha Elaboración</TableColumn>
            <TableColumn>Fecha Recepción</TableColumn>
            <TableColumn>Número Oficio</TableColumn>
            <TableColumn>Tipo</TableColumn>
            <TableColumn>Atendió</TableColumn>
            <TableColumn>Completado</TableColumn>
           </TableHeader>
           <TableBody>
              {capturas.map((captura: any) => (
                <TableRow key={captura.folio_acaac}>
                  <TableCell>{captura.folio_acaac}</TableCell>
                  <TableCell>{captura.fecha_elaboracion}</TableCell>
                  <TableCell>{captura.fecha_recepcion}</TableCell>
                  <TableCell>{captura.numero_oficio}</TableCell>
                  <TableCell>{captura.tipo}</TableCell>
                  <TableCell>{captura.atendio}</TableCell>
                  <TableCell>{captura.completado ? 'Si' : 'No'} </TableCell>
                </TableRow>
              ))}
           </TableBody>
          </Table>
        </>
      )}          
    </main>
  )
}
