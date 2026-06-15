// TaskManagerCRM.jsx - Gestion des tâches et Mini-CRM Relances
import React, { useState } from 'react';
import { CheckSquare, Users, Plus, Trash2, Clock, Send, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TaskManagerCRM() {
  const [activeSubTab, setActiveSubTab] = useState('tasks');
  const [tasks, setTasks] = useState([
    { id: 1, text: "Rédiger la newsletter client", client: "Abo-Solution", status: "En cours" },
    { id: 2, text: "Créer le carrousel LinkedIn IA", client: "MAIN DIGITAL", status: "À faire" }
  ]);
  const [newTask, setNewTask] = useState('');
  const [taskClient, setTaskClient] = useState('');

  const [prospects] = useState([
    { id: 1, name: "Jean Durand", company: "Avenir Immo", type: "Devis envoyé", phone: "+33612345678" },
    { id: 2, name: "Sophie Martin", company: "E-com Scale", type: "Facture en attente", phone: "+33698765432" }
  ]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, client: taskClient || "Général", status: "À faire" }]);
    setNewTask('');
    setTaskClient('');
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === "À faire" ? "En cours" : t.status === "En cours" ? "Terminé" : "À faire" } : t));
  };

  const triggerReminder = (p, method) => {
    const text = `Bonjour ${p.name}, je me permets de vous relancer concernant notre dossier pour ${p.company}. Restant à votre entière disposition !`;
    if (method === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?phone=${p.phone}&text=${encodeURIComponent(text)}`, '_blank');
    } else {
      alert(`📩 [Simulation Email Sent] à ${p.name} :\n\n"${text}"`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hub Opérationnel</h2>
          <p className="text-slate-500 mt-1">Gérez vos tâches et envoyez des relances en un clic.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setActiveSubTab('tasks')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${activeSubTab === 'tasks' ? 'bg-white shadow-sm' : 'text-slate-600'}`}><CheckSquare size={16} /> Tâches</button>
          <button onClick={() => setActiveSubTab('crm')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${activeSubTab === 'crm' ? 'bg-white shadow-sm' : 'text-slate-600'}`}><Users size={16} /> CRM & Relances</button>
        </div>
      </div>

      {activeSubTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={addTask} className="bg-white p-6 rounded-xl border h-fit space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900">Nouvelle Mission</h3>
            <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Tâche..." className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" value={taskClient} onChange={e => setTaskClient(e.target.value)} placeholder="Client..." className="w-full px-3 py-2 border rounded-lg text-sm" />
            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium">Ajouter</button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm divide-y">
            {tasks.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(t.id)}>
                    {t.status === "Terminé" ? <CheckCircle2 className="text-emerald-500" size={18} /> : t.status === "En cours" ? <Clock className="text-amber-500" size={18} /> : <div className="w-4 h-4 border-2 rounded-full" />}
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${t.status === "Terminé" ? "line-through text-slate-400" : ""}`}>{t.text}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{t.client}</span>
                  </div>
                </div>
                <span onClick={() => toggleStatus(t.id)} className={`text-xs px-2.5 py-1 rounded-full font-bold cursor-pointer ${t.status === 'Terminé' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'crm' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Contact</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Relance Éclair</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {prospects.map(p => (
                <tr key={p.id}>
                  <td className="p-4">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.company}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"><AlertCircle size={12} /> {p.type}</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => triggerReminder(p, 'email')} className="text-xs border px-3 py-1.5 rounded-lg">Email</button>
                    <button onClick={() => triggerReminder(p, 'whatsapp')} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg">WhatsApp</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
