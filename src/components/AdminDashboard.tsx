import { useEffect, useState } from "react"
import { supabase } from "~/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Trash2, RefreshCcw } from "lucide-react"

interface TestResult {
    id: string
    created_at: string
    user_name: string
    profile_category: string
    profile_type: string
    answers: any
}

export function AdminDashboard() {
    const [results, setResults] = useState<TestResult[]>([])
    const [loading, setLoading] = useState(true)

    const fetchResults = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('test_results')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching results", error)
        } else {
            setResults(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchResults()
    }, [])

    const getFriendlyName = (type: string) => {
        const names: any = {
            "Lunar": "El Especialista Preciso",
            "Saturnino": "El Estratega Lógico",
            "Venusino": "El Conector Empático",
            "Jovial": "El Motivador Entusiasta",
            "Mercurial": "El Negociador Ágil",
            "Marcial": "El Ejecutor Decidido"
        }
        return names[type] || type
    }

    const deleteResult = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este resultado?")) return

        const { error } = await supabase
            .from('test_results')
            .delete()
            .eq('id', id)

        if (error) {
            alert("Error al eliminar")
        } else {
            setResults(results.filter(r => r.id !== id))
        }
    }

    return (
        <Card className="w-full shadow-2xl border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-slate-500/50">
                <div>
                    <CardTitle className="text-2xl font-bold">Panel de Administración</CardTitle>
                    <CardDescription>Resultados de "Tu Estilo de Aporte"</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchResults} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-slate-500/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Empleado</th>
                                <th className="px-6 py-4 font-semibold text-center">Categoría</th>
                                <th className="px-6 py-4 font-semibold text-center">Tipo Técnico</th>
                                <th className="px-6 py-4 font-semibold text-center">Perfil</th>
                                <th className="px-6 py-4 font-semibold text-center">Fecha</th>
                                <th className="px-6 py-4 font-semibold text-right text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                                        {loading ? "Cargando resultados..." : "No hay resultados registrados aún."}
                                    </td>
                                </tr>
                            ) : (
                                results.map((result) => (
                                    <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-400 uppercase italic">
                                            {result.user_name}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${result.profile_category === 'Racional' ? 'bg-blue-100 text-blue-700' :
                                                result.profile_category === 'Emocional' ? 'bg-pink-100 text-pink-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {result.profile_category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-slate-400">
                                            {result.profile_type}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-primary font-semibold">{getFriendlyName(result.profile_type)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-muted-foreground text-xs">
                                            {new Date(result.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => deleteResult(result.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
