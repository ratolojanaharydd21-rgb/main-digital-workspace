// App.jsx - Point d'entrée et routeur principal
import React, { useState } from 'react';
import { PenTool, CheckSquare, Calendar, LayoutDashboard } from 'lucide-react';
import ContentFactory from './ContentFactory';
import EditorialCalendar from './EditorialCalendar';
import TaskManagerCRM from './TaskManagerCRM';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* BARRE LATÉRALE (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-wider text-indigo-400">MAIN DIGITAL</h1>
          <p className="text-xs text-slate-400 mt-1">Workspace Tout-en-Un</p>
          
          <nav className="mt-8 space-y-2">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard size={18} /> Tableau de bord
            </button>
            
            <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module IA</div>
            <button 
              onClick={() => setCurrentTab('content-factory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentTab === 'content-factory' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <PenTool size={18} /> Usine à Contenu
            </button>
            <button 
              onClick={() => setCurrentTab('calendar')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentTab === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Calendar size={18} /> Calendrier Éditorial
            </button>

            <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module Gestion</div>
            <button 
              onClick={() => setCurrentTab('tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentTab === 'tasks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <CheckSquare size={18} /> Hub Assistant & CRM
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
          Version 1.0.0 • Propulsé par GitHub
        </div>
      </aside>

      {/* ZONE PRINCIPALE DE RENDU */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
          <div className="text-sm font-medium text-slate-500">Espace de Travail Collaboratif</div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">Système Actif</span>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Espace d'administration</h2>
              <p className="text-slate-500 mb-6 font-medium">Vue globale sur les moteurs de l'agence.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase">Statut API Groq</h3>
                  <p className="text-2xl font-bold mt-2 text-emerald-600">Connecté & Synchro (Llama 3)</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase">Processus Opérationnels</h3>
                  <p className="text-2xl font-bold mt-2 text-indigo-600">Prêts à la relance</p>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'content-factory' && <ContentFactory />}
          {currentTab === 'calendar' && <EditorialCalendar />}
          {currentTab === 'tasks' && <TaskManagerCRM />}
        </div>
      </main>
    </div>
  );
}
