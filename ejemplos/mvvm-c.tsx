
// Datos puros
{
    export interface Product {
        id: string;
        name: string;
        price: number;
    }

    // Servicio para simular llamada a API
    export async function getMockProducts(): Promise<Product[]> {
        return [
            { id: "1", name: "Laptop Pro", price: 1200 },
            { id: "2", name: "Mouse Inalámbrico", price: 40 },
            { id: "3", name: "Teclado Mecánico", price: 90 },
        ];
    }
}

import { useState, useEffect } from "react";
import { Usuario, fetchUsuariosFromAPI } from "./usuariosModel";

export function useUsuariosViewModel() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const datos = await fetchUsuariosFromAPI();
            setUsuarios(datos);
        } catch (err: any) {
            setError(err.message || "Ocurrió un error");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Exponer solo lo necesario para la View
    return {
        usuarios,
        cargando,
        error,
        recargar: cargarDatos,
    };
}

//page.tsx
import { useUsuariosViewModel } from "./useUsuariosViewModel";

export default function UsuariosPage() {
    // Enlace de datos (Data Binding) a través de la desestructuración del Hook
    const { usuarios, cargando, error, recargar } = useUsuariosViewModel();

    if (cargando) return <p>Cargando lista de usuarios...</p>;
    if (error) return <p>Error detectado: {error}</p>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
            <button
                onClick={recargar}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Actualizar Lista
            </button>
            <ul>
                {usuarios.map((usuario) => (
                    <li key={usuario.id} className="border-b py-2">
                        {usuario.nombre} —{" "}
                        <span className="text-gray-500">{usuario.email}</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}
