'use client'

import { Button, Input, Select, SelectItem } from "@heroui/react"
import React, { useState } from "react"

export default function CapturaForm({ userId, rol }: { userId: number, rol: string }) {
    const [form, setForm] = useState({
        usuario_id: userId,
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
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/captura/', { 
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'User-ID': userId.toString(), 
            },
            body: JSON.stringify(form),
        })
        const data = await res.json();
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
                onChange={(e) => setForm({ ...form, numero_oficio: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Input
                label="Asunto"
                value={form.asunto}
                onChange={(e) => setForm({ ...form, asunto: e.target.value })}
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
                value={form.destinatario} // Corregido: era form.prioridad
                onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
                isDisabled={rol === 'Lector'}
            />
            <Select
                label="Prioridad"
                selectedKeys={form.prioridad ? [form.prioridad] : []}
                onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setForm({ ...form, prioridad: value });
                }}
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
                selectedKeys={form.atendio ? [form.atendio] : []}
                onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setForm({ ...form, atendio: value });
                }}
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
                selectedKeys={form.tipo ? [form.tipo] : []}
                onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setForm({ ...form, tipo: value });
                }}
                isRequired
                isDisabled={rol === 'Lector'}
            >
                <SelectItem key="Entrada">Entrada</SelectItem>
                <SelectItem key="Salida">Salida</SelectItem>
            </Select>
            <Select
                label="Status"
                selectedKeys={form.status ? [form.status] : []}
                onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setForm({ ...form, status: value });
                }}
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