import React, { useState } from 'react';
import ContentFactory from './components/ContentFactory'; // Ajustez le chemin selon votre projet
import EditorialCalendar from './components/EditorialCalendar';

export default function App() {
  const [currentTab, setCurrentTab] = useState('factory'); // 'factory' ou 'calendar'
  
  // La liste des posts partagée dans toute l'application
  const [scheduledPosts, setScheduledPosts] = useState([
    { 
      id: 1, 
      date: '2026-06-18', 
      title: 'Post AIDA : Stratégie', 
      content: 'Voici notre approche architecturale pour structurer vos réseaux...', 
      platform: 'LinkedIn',
      visual: null 
    }
  ]);

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Votre barre latérale (Sidebar) ici */}
      <aside className="w-64 bg-slate-950 p-4">
        <h1 className="text-xl font-bold text-indigo-400 mb-8">MAIN DIGITAL</h1>
        <nav className="space-y-2">
          <button 
            onClick={() => setCurrentTab('factory')} 
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${currentTab === 'factory' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            🚀 Usine à Contenu
          </button>
          <button 
            onClick={() => setCurrentTab('calendar')} 
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${currentTab === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            📅 Calendrier Éditorial
          </button>
        </nav>
      </aside>

      {/* Zone de contenu principal */}
      <main className="flex-1 bg-slate-50 text-slate-900 p-8 overflow-y-auto">
        {currentTab === 'factory' && (
          <ContentFactory 
            scheduledPosts={scheduledPosts} 
            setScheduledPosts={setScheduledPosts} 
            goToCalendar={() => setCurrentTab('calendar')}
          />
        )}
        {currentTab === 'calendar' && (
          <EditorialCalendar 
            scheduledPosts={scheduledPosts} 
            setScheduledPosts={setScheduledPosts} 
          />
        )}
      </main>
    </div>
  );
}
