import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Quiz } from "~/components/Quiz"
import { AdminDashboard } from "~/components/AdminDashboard"
import { Lock } from "lucide-react"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 relative">
        <main className="w-full max-w-4xl">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Enlace discreto para Admin en el footer */}
        <footer className="mt-12 text-slate-400">
          <Link to="/admin" className="flex items-center gap-2 text-xs hover:text-slate-600 transition-colors opacity-30 hover:opacity-100">
            <Lock className="h-3 w-3" />
            Panel Administrativo
          </Link>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
