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

const questions = [
    {
        id: 1,
        text: "Si recibes un correo con una tarea urgente a última hora, ¿qué es lo primero que haces?",
        options: [
            { id: "A", text: "Reviso el cronograma para ver cómo afecta mi planificación de mañana." },
            { id: "B", text: "Me pregunto si alguien más necesita ayuda para que no nos quedemos tarde todos." },
            { id: "C", text: "Me pongo manos a la obra de inmediato para terminarlo lo antes posible." }
        ]
    },
    {
        id: 2,
        text: "¿Cómo prefieres que sea tu espacio de trabajo ideal?",
        options: [
            { id: "A", text: "Silencioso, organizado y donde nadie interrumpa mi concentración." },
            { id: "B", text: "Un lugar donde pueda interactuar y sentir la energía de mis compañeros." },
            { id: "C", text: "Un espacio dinámico, con metas a la vista y herramientas para actuar rápido." }
        ]
    },
    {
        id: 3,
        text: "En una reunión de equipo, ¿qué rol sueles adoptar naturalmente?",
        options: [
            { id: "A", text: "El que observa, analiza los datos y encuentra los posibles errores del plan." },
            { id: "B", text: "El que busca que todos participen y que el ambiente sea agradable." },
            { id: "C", text: "El que impulsa a tomar decisiones y define quién hace qué." }
        ]
    },
    {
        id: 4,
        text: "¿Qué es lo que más te motiva de alcanzar una meta difícil?",
        options: [
            { id: "A", text: "La satisfacción de saber que el método que diseñé funcionó perfectamente." },
            { id: "B", text: "El reconocimiento de mi equipo y el fortalecimiento de nuestros lazos." },
            { id: "C", text: "La recompensa obtenida y la sensación de haber ganado un desafío." }
        ]
    },
    {
        id: 5,
        text: "Si un compañero comete un error que retrasa tu trabajo, ¿cuál es tu reacción interna?",
        options: [
            { id: "A", text: "Me frustra que no se sigan los procesos lógicos establecidos." },
            { id: "B", text: "Me preocupa cómo se siente él y trato de restarle importancia al error." },
            { id: "C", text: "Me molesta la pérdida de tiempo y busco cómo corregirlo yo mismo ya." }
        ]
    },
    {
        id: 6,
        text: "¿Cómo te gusta recibir nuevas instrucciones?",
        options: [
            { id: "A", text: "Por escrito, con todo el detalle técnico y los objetivos claros." },
            { id: "B", text: "En una charla personal donde pueda entender el 'por qué' y el contexto." },
            { id: "C", text: "De forma breve y directa al grano: qué hay que hacer y para cuándo." }
        ]
    },
    {
        id: 7,
        text: "Estás en un evento social de la empresa y no conoces a mucha gente, tú...",
        options: [
            { id: "A", text: "Busco a alguien que conozca para tener una conversación profunda o analizo el entorno." },
            { id: "B", text: "Me acerco con una sonrisa y trato de integrar a quienes veo solos." },
            { id: "C", text: "Aprovecho para hacer contactos útiles que puedan servir para futuros proyectos." }
        ]
    },
    {
        id: 8,
        text: "¿Qué palabra define mejor tu mayor fortaleza?",
        options: [
            { id: "A", text: "Precisión." },
            { id: "B", text: "Empatía." },
            { id: "C", text: "Empuje." }
        ]
    },
    {
        id: 9,
        text: "Ante un cambio inesperado en las reglas de la empresa, ¿cuál es tu actitud?",
        options: [
            { id: "A", text: "Necesito tiempo para procesarlo y entender la lógica detrás del cambio." },
            { id: "B", text: "Me preocupa cómo afectará esto al ánimo y la estabilidad del grupo." },
            { id: "C", text: "Me adapto rápido y busco cómo sacar ventaja de la nueva situación." }
        ]
    },
    {
        id: 10,
        text: "¿Cuál de estos 'superpoderes' elegirías para tu trabajo?",
        options: [
            { id: "A", text: "Tener la capacidad de predecir riesgos antes de que ocurran." },
            { id: "B", text: "Poder leer las emociones de los demás para evitar conflictos." },
            { id: "C", text: "Tener energía inagotable para cerrar todos los pendientes del día." }
        ]
    },
    {
        id: 11,
        text: "(Control de Veracidad) Si te ganas un premio por tu desempeño, prefieres:",
        options: [
            { id: "A", text: "Una certificación de alto nivel o un libro especializado." },
            { id: "B", text: "Una cena de celebración con las personas que más aprecias." },
            { id: "C", text: "Un premio en efectivo o un ascenso de categoría." }
        ]
    },
    {
        id: 12,
        text: "¿Cómo manejas las críticas a tu trabajo?",
        options: [
            { id: "A", text: "Las analizo fríamente; si tienen lógica las acepto, si no, las descarto." },
            { id: "B", text: "Me afectan personalmente al principio, pero valoro la intención del otro." },
            { id: "C", text: "Las tomo como un reto para demostrar que puedo hacerlo mejor que nadie." }
        ]
    },
    {
        id: 13,
        text: "Si tuvieras que elegir una actividad fuera del trabajo, sería:",
        options: [
            { id: "A", text: "Leer un libro, jugar ajedrez o investigar sobre un tema de interés." },
            { id: "B", text: "Reunirme con amigos, ir a un festival o hacer trabajo voluntario." },
            { id: "C", text: "Practicar un deporte competitivo o iniciar un negocio propio." }
        ]
    },
    {
        id: 14,
        text: "Tu mayor temor en la oficina es:",
        options: [
            { id: "A", text: "Cometer un error por falta de análisis o información." },
            { id: "B", text: "Sentirme excluido o que haya un ambiente de tensión constante." },
            { id: "C", text: "Estancarme en la rutina y sentir que no estoy ganando nada." }
        ]
    }
]

export function AdminDashboard() {
    const [results, setResults] = useState<TestResult[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)

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

    const getAnswerText = (questionId: number, optionId: string) => {
        const question = questions.find(q => q.id === questionId)
        const option = question?.options.find(o => o.id === optionId)
        return option?.text || optionId
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
                    <Button variant="outline" size="sm" onClick={fetchResults} disabled={loading} className="bg-white">
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
                                    <>
                                        <tr
                                            key={result.id}
                                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedId === result.id ? 'bg-slate-50' : ''}`}
                                            onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                                        >
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
                                                <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => deleteResult(result.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedId === result.id && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={6} className="px-10 py-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {questions.map((q) => (
                                                            <div key={q.id} className="bg-slate-500 p-3 rounded border shadow-sm">
                                                                <p className="font-semibold text-xs text-slate-500 mb-1">Pregunta {q.id}</p>
                                                                <p className="text-sm font-medium mb-2">{q.text}</p>
                                                                <div className="flex items-start gap-2 bg-slate-50 p-2 rounded">
                                                                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">
                                                                        {result.answers[q.id]}
                                                                    </span>
                                                                    <p className="text-sm text-slate-700">{getAnswerText(q.id, result.answers[q.id])}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
