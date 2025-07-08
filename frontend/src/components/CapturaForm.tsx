'use client'

import { Button, Input, Select, SelectItem, useRadio } from "@nextui-org/react"
import React, { useState } from "react"

export default function CapturaForm({ userId, rol }: { userId: number, rol: string }) {
    const [form, setForm] = useState({
        usuario_id: useRadio,
        fecha_elaboracion: '',
        fecha_recepcion: '',
        numero_oficio: '', 
        asunto: '', 
        remitente: '',
        destinatario: '',
        prioridad: '',
        observacion: '', 
        atendio: '',
        pdf_url: '',
        tipo: '',
        status: '',
        respuesta_pdf_url: '', 
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('htt://localhost:5000/captura/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'User-ID': useRadio.toString(), 
            },
            body: JSON.stringify(form),
        })
        const data = await res.json()
        alert(data.mensaje || data.error)
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 bg-gray-800 rounded-lg">
            <Input
                label="Fecha Elaboración"
                type="text"
                placeholder="DD-MM-YYYY"
                value={form.fecha_elaboracion}
                onChange={(e) => setForm({ ...form, fecha_elaboracion: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Input
                label="Fecha Recepción"    
                type="text"
                placeholder="DD-MM-YYYY"
                value={form.fecha_recepcion}
                onChange={(e) => setForm({ ...form, fecha_recepcion: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Input
                label="Número de Oficio"
                value={form.numero_oficio}
                onChange={(e) => setForm ({ ...form, numero_oficio: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Input
                label="Asunto"
                value={form.asunto}
                onChange={(e) => setForm({ ...form, numero_oficio: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Input
                label="Remitente"
                value={form.remitente}
                onChange={(e) => setForm({ ...form, remitente: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Input  
                label="Destinatario"
                value={form.prioridad}
                onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Select
                label="Prioridad"
                value={form.prioridad}
                onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                isDisabled={rol === 'Lector'}
            >
                <SelectItem key="Extraurgente">Extraurgente</SelectItem>
                <SelectItem key="Urgente">Urgente</SelectItem>
                <SelectItem key="Ordinario">Ordinario</SelectItem>
            </Select>
            <Input
                label="Observacion"
                value={form.observacion}
                onChange={(e) => setForm({ ...form, observacion: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Select
                label="Atendió"
                value={form.atendio}
                onChange={(e) => setForm({ ...form, atendio: e.target.value })}
                isDisabled={rol === 'Lector'}
            >
                <SelectItem key="Mitzi">Mitzi</SelectItem>
                <SelectItem key="Rosy">Rosy</SelectItem>
                <SelectItem key="Edgar">Edgar</SelectItem>
                <SelectItem key="Chiqui">Chiqui</SelectItem>
            </Select>
            <Input
                label="PDF"
                value={form.pdf_url}
                onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                isDisabled={rol === 'Lector' && form.tipo !== 'Salida'}
            />
            <Select
                label="Tipo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value})}
                isRequired
                isDisabled={rol === 'Lector'}
            >
                <SelectItem key="Entrada">Entrada</SelectItem>
                <SelectItem key="Salida">Salida</SelectItem>
            </Select>
            <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                isDisabled={rol === 'Lector' || form.tipo !== 'Entrada'}
            >
                <SelectItem key="Conocimiento">Conocimiento</SelectItem>
                <SelectItem key="Respuesta">Respuesta</SelectItem>
            </Select>
            <Input
                label="Respuesta PDF URL"
                value={form.respuesta_pdf_url}
                onChange={(e) => setForm({ ...form, respuesta_pdf_url: e.target.value })}
                isDisabled={rol === 'Administrador' || form.tipo !== 'Entrada'}
            />
            <Button type="submit" color="primary" disabled={rol === 'Lector' && !form.respuesta_pdf_url && !form.pdf_url}>
                {rol === 'Lector' ? 'Subir PDF' : 'Crear Carpeta'} 
            </Button>
        </form> 
    )
}