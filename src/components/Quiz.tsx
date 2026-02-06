import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { supabase } from "~/lib/supabase"
import { cn } from "~/lib/utils"
// Preguntas extraídas de base.md
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

export function Quiz() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [userName, setUserName] = useState("")
    const [showResult, setShowResult] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAnswer = (value: string) => {
        setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: value }))
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            finishQuiz()
        }
    }

    const calculateProfile = () => {
        let countA = 0
        let countB = 0
        let countC = 0

        Object.values(answers).forEach(ans => {
            if (ans === 'A') countA++
            if (ans === 'B') countB++
            if (ans === 'C') countC++
        })

        let mainProfile = "Racional"
        if (countB > countA && countB > countC) mainProfile = "Emocional"
        if (countC > countA && countC > countB) mainProfile = "Motriz"

        const refinementQuestions = [1, 3, 5, 9]
        let activeScore = 0
        refinementQuestions.forEach(qId => {
            if (answers[qId] === 'C') activeScore++
        })

        const tempType = activeScore >= 2 ? "Activo" : "Pasivo"

        let specificType = ""
        if (mainProfile === "Racional") {
            specificType = tempType === "Pasivo" ? "Lunar" : "Saturnino"
        } else if (mainProfile === "Emocional") {
            specificType = tempType === "Pasivo" ? "Venusino" : "Jovial"
        } else {
            specificType = tempType === "Pasivo" ? "Mercurial" : "Marcial"
            if (tempType === "Activo") specificType = "Marcial"
        }

        const friendlyNames: any = {
            "Lunar": "El Especialista Preciso",
            "Saturnino": "El Estratega Lógico",
            "Venusino": "El Conector Empático",
            "Jovial": "El Motivador Entusiasta",
            "Mercurial": "El Negociador Ágil",
            "Marcial": "El Ejecutor Decidido"
        }

        return {
            mainProfile,
            specificType,
            friendlyName: friendlyNames[specificType] || specificType
        }
    }

    const finishQuiz = async () => {
        setIsSubmitting(true)
        const result = calculateProfile()

        try {
            if (userName) {
                await supabase.from('test_results').insert({
                    user_name: userName,
                    profile_category: result.mainProfile,
                    profile_type: result.specificType,
                    answers: answers
                })
            }
        } catch (e) {
            console.error("Error saving result", e)
        } finally {
            setIsSubmitting(false)
            setShowResult(true)
        }
    }

    if (showResult) {
        return (
            <Card className="w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">¡Muchas Gracias!</CardTitle>
                    <CardDescription className="text-lg">Tu participación es muy valiosa para nosotros.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground italic">
                        "Tus respuestas han sido registradas correctamente. Esta información ayudará a fortalecer la dinámica de nuestro equipo."
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => window.location.reload()}>Finalizar</Button>
                </CardFooter>
            </Card>
        )
    }

    if (!userName) {
        return (
            <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle className="text-2xl">Bienvenido al Test</CardTitle>
                    <CardDescription>Tu Estilo de Aporte</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-1.5 pt-4">
                        <Label htmlFor="name" className="text-lg mb-2">Por favor, introduce tu nombre completo:</Label>
                        <input
                            className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-slate-300"
                            id="name"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                </CardContent>
                <CardFooter className="pt-6">
                    <Button className="w-full h-12 text-lg shadow-md hover:shadow-lg transition-transform active:scale-[0.98]" disabled={!userName.trim()} onClick={() => setUserName(userName.trim())}>
                        Comenzar Test
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    const question = questions[currentQuestionIndex]

    return (
        <Card className="w-full animate-in fade-in zoom-in duration-500 shadow-xl border-none">
            <CardHeader className="bg-slate-500/50 rounded-t-lg border-b mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progreso: {Math.round(((currentQuestionIndex) / questions.length) * 100)}%</span>
                    <span className="text-xs font-bold text-primary">Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
                <CardTitle className="text-xl mt-6 leading-relaxed">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswer} className="gap-4">
                    {question.options.map((option) => (
                        <label
                            key={option.id}
                            className={cn(
                                "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer group hover:shadow-md",
                                answers[question.id] === option.id
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                            )}
                        >
                            <RadioGroupItem
                                value={option.id}
                                id={`q${question.id}-${option.id}`}
                                className="w-5 h-5 shadow-none border-2"
                            />
                            <span className="text-base font-medium leading-tight text-slate-700 group-hover:text-slate-900 transition-colors">{option.text}</span>
                        </label>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between bg-slate-500/30 border-t p-6">
                <Button
                    variant="outline"
                    className="border-slate-300"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                >
                    Anterior
                </Button>
                <Button
                    className="px-8 shadow-sm hover:translate-x-1 transition-transform"
                    disabled={!answers[question.id]}
                    onClick={handleNext}
                >
                    {currentQuestionIndex === questions.length - 1 ? (isSubmitting ? "Enviando..." : "Finalizar Test") : "Continuar"}
                </Button>
            </CardFooter>
        </Card>
    )
}
