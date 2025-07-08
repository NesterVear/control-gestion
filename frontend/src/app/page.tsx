'use client'

import { useState, useEffect } from "react"
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import CapturaForm from "@/components/CapturaForm";

export default function Home() {
  const [user, setUser] = useState<{ id: number, rol: string } | null>(null)
  const [capturas, setCapturas] = useState([])

  const login = async () => {
    const res = await fetch('http://localhost:5000/usuarios/login', {
      
    })
  }
}
