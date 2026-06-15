import React, { useState } from 'react';
import ContentFactory from './ContentFactory'; 
import EditorialCalendar from './EditorialCalendar';
import { Sparkles, CalendarDays, Users, CheckSquare, Plus, Trash2, UserPlus, RefreshCw } from 'lucide-react';

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

  // État pour la gestion des tâches
  const [tasks, setTasks] = useState([
    { id: 1, text: "Valider le prochain post AIDA", completed: false },
    { id: 2, text: "Recharger les visuels pour la semaine", completed: true }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // État dynamique pour le CRM
  const [leads, setLeads] = useState([
    { id: 1, name: "Jean Dupont", company: "SME Tech", status: "Prospect", email: "jean@smetech.com" },
    { id: 2, name: "Marie Larson", company: "Coaching Pro", status: "Contacté", email: "contact@marielarson.com" }
  ]);

  // État pour le formulaire d'ajout de prospect
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    status: 'Prospect'
  });

  // --- FONCTIONS TÂCHES ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // --- FONCTIONS CRM ---
  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.name.trim() || !newLead.company.trim()) return;

    setLeads([...leads, {
      id: Date.now(),
      name: newLead.name.trim(),
      company: newLead.company.trim(),
      email: newLead.email.trim() || 'Non renseigné',
      status: newLead.status
    }]);

    // Réinitialisation du formulaire
    setNewLead({ name: '', company: '', email: '', status: 'Prospect' });
  };

  const handleDeleteLead = (leadId) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  const handleToggleStatus = (leadId) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        // Cycle de statut : Prospect -> Contacté -> Client Signé -> Prospect
        const nextStatus = lead.status === 'Prospect' 
          ? 'Contacté' 
          : lead.status === 'Contacté' 
            ? 'Client Signé' 
            : 'Prospect';
        return { ...lead, status: nextStatus };
      }
      return lead;
    }));
  };

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

        {/* ONGLET 3 : LA GESTION DES TÂCHES */}
        {currentTab === 'tasks' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="text-indigo-600" /> Gestion des Tâches
              </h2>
              <p className="text-slate-500 mt-1">Suivez vos actions quotidiennes de Community Management.</p>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Ex: Planifier le post de jeudi prochain..." 
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              />
              <button type="submit" className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors">
                <Plus size={14} /> Ajouter
              </button>
            </form>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              {tasks.length > 0 ? (
                tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors ml-2 shrink-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={t.completed} 
                        onChange={() => setTasks(tasks.map(task => task.id === t.id ? {...task, completed: !task.completed} : task))}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 shrink-0 cursor-pointer"
                      />
                      <span className={`text-xs truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{t.text}</span>
                    </div>
                    <button onClick={() => handleDeleteTask(t.id)} className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors ml-2 shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">Toutes les tâches ont été complétées ! 🎉</p>
              )}
            </div>
          </div>
        )}

        {/* ONGLET 4 : LE CRM LEADS (Mis à jour avec gestion complète) */}
        {currentTab === 'crm' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="text-indigo-600" /> Gestion des Prospects (CRM)
              </h2>
              <p className="text-slate-500 mt-1">Enregistrez vos nouveaux contacts et suivez l'évolution de vos opportunités commerciales.</p>
            </div>

            {/* Formulaire d'ajout rapide de prospect */}
            <form onSubmit={handleAddLead} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom du Prospect</label>
                <input 
                  type="text" 
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Ex: Alexandre Hormozi" 
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Entreprise / Activité</label>
                <input 
                  type="text" 
                  required
                  value={newLead.company}
                  onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  placeholder="Ex: Acquisition Inc" 
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Adresse Email</label>
                <input 
                  type="email" 
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="Ex: contact@entreprise.com" 
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 h-[38px]"
              >
                <UserPlus size={14} /> Ajouter la fiche
              </button>
            </form>

            {/* Tableau d'affichage des Fiches Prospects */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {leads.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Nom complet</th>
                      <th className="p-4">Entreprise</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Statut actuel</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800">{l.name}</td>
                        <td className="p-4 text-slate-600">{l.company}</td>
                        <td className="p-4 text-slate-500 font-mono">{l.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full font-bold text-[10px] shadow-sm ${
                            l.status === 'Client Signé' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : l.status === 'Contacté' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          {/* Bouton pour changer le statut à la volée */}
                          <button 
                            onClick={() => handleToggleStatus(l.id)}
                            className="inline-flex items-center justify-center p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border rounded-md transition-colors"
                            title="Changer de statut"
                          >
                            <RefreshCw size={12} />
                          </button>
                          {/* Bouton supprimer la fiche */}
                          <button 
                            onClick={() => handleDeleteLead(l.id)}
                            className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border rounded-md transition-colors"
                            title="Supprimer le prospect"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-400 italic">
                  Aucun prospect enregistré pour le moment. Remplissez le formulaire ci-dessus pour commencer votre prospection !
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
