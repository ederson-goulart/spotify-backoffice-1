'use client'

import { useParams } from "next/navigation"

export default function Page() {
    const params = useParams<{ id: string }>()
    return <h1>Banda ID ... {params.id}</h1>
}