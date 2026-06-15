import React, { useState } from 'react';
import ContentFactory from './ContentFactory'; 
import EditorialCalendar from './EditorialCalendar';
import { Sparkles, CalendarDays, Users, CheckSquare } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('factory');
  
  // État partagé pour le calendrier éditorial
  const [scheduledPosts, setScheduledPosts] = useState([
    { 
      id: 1, 
      date: '2026-06-18', 
      title: 'Post AIDA : Stratégie', 
      content: 'Voici notre approche pour structurer vos réseaux...', 
      platform: 'LinkedIn',
      visual: null 
    }
  ]);

  // État pour la gestion des tâches simplifiée
  const [tasks, setTasks] = useState([
    { id: 1, text: "Valider le prochain post AIDA", completed: false },
    { id: 2, text: "Recharger les visuels pour la semaine", completed: true }
  ]);

  // État pour le CRM simplifié
  const [leads, setLeads] = useState([
    { id: 1, name: "Jean Dupont", company: "SME Tech", status: "Prospect", email: "jean@smetech.com" },
    { id: 2, name: "Marie Larson", company: "Coaching Pro", status: "Contacté", email: "contact@marielarson.com" }
  ]);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans antialiased text-sm">
      
      {/* 1. BARRE LATÉRALE DE NAVIGATION (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shrink-0 shadow-lg">
        <div>
          <div className="px-4 py-3 mb-8">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              MAIN DIGITAL
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Workspace Assistant & CM</p>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentTab('factory')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'factory' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <Sparkles size={16} /> Usine à Contenu
            </button>

            <button 
              onClick={() => setCurrentTab('calendar')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'calendar' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <CalendarDays size={16} /> Calendrier Éditorial
            </button>

            <button 
              onClick={() => setCurrentTab('tasks')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'tasks' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <CheckSquare size={16} /> Gestion des Tâches
            </button>

            <button 
              onClick={() => setCurrentTab('crm')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'crm' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <Users size={16} /> Espace CRM Leads
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          MAIN DIGITAL &copy; 2026
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE D'AFFICHAGE */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
        
        {/* ONGLET 1 : L'USINE À CONTENU */}
        {currentTab === 'factory' && (
          <ContentFactory 
            scheduledPosts={scheduledPosts} 
            setScheduledPosts={setScheduledPosts} 
            goToCalendar={() => setCurrentTab('calendar')}
          />
        )}

        {/* ONGLET 2 : LE CALENDRIER ÉDITORIAL */}
        {currentTab === 'calendar' && (
          <EditorialCalendar 
            scheduledPosts={scheduledPosts} 
            setScheduledPosts={setScheduledPosts} 
          />
        )}

        {/* ONGLET 3 : LA GESTION DES TÂCHES (Nouveau) */}
        {currentTab === 'tasks' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><CheckSquare className="text-indigo-600" /> Gestion des Tâches</h2>
              <p className="text-slate-500 mt-1">Suivez vos actions quotidiennes de Community Management.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl space-y-3">
              {tasks.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50/50">
                  <input 
                    type="checkbox" 
                    checked={t.completed} 
                    onChange={() => setTasks(tasks.map(task => task.id === t.id ? {...task, completed: !task.completed} : task))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className={`text-xs ${t.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 4 : LE CRM LEADS (Nouveau) */}
        {currentTab === 'crm' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Users className="text-indigo-600" /> Gestion des Prospects (CRM)</h2>
              <p className="text-slate-500 mt-1">Suivez le statut de vos démarches commerciales et de vos clients.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Nom complet</th>
                    <th className="p-4">Entreprise</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/80">
                      <td className="p-4 font-semibold text-slate-800">{l.name}</td>
                      <td className="p-4 text-slate-600">{l.company}</td>
                      <td className="p-4 text-slate-500 font-mono">{l.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full font-bold text-[10px] ${l.status === 'Contacté' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
