// EditorialCalendar.jsx - Calendrier Éditorial
import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';

export default function EditorialCalendar() {
  const [scheduledPosts] = useState([
    { id: 1, date: '2026-06-18', title: 'Post AIDA : Stratégie', platform: 'LinkedIn' },
    { id: 2, date: '2026-06-22', title: 'Hook : Éviter l\'épuisement', platform: 'LinkedIn' }
  ]);

  const [currentDate] = useState(new Date(2026, 5, 15)); // Juin 2026
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayIndex === 0 ? 6 : firstDayIndex - 1 }, (_, i) => i);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="text-indigo-600" /> Calendrier Éditorial
        </h2>
        <p className="text-slate-500 mt-1">Organisez visuellement vos publications du mois.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">{monthsFr[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200"><ChevronLeft size={16} /></button>
              <button className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {emptySlots.map((_, i) => <div key={i} className="h-24 bg-slate-50/50 rounded-lg border border-slate-100"></div>)}
            {daysArray.map((day) => {
              const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
              const posts = scheduledPosts.filter(p => p.date === dateStr);
              return (
                <div key={day} onClick={() => setSelectedDay(dateStr)} className="h-24 p-2 border border-slate-200 bg-white rounded-lg flex flex-col justify-between cursor-pointer hover:border-indigo-300">
                  <span className="text-xs font-bold text-slate-700">{day}</span>
                  <div className="space-y-1 overflow-hidden">
                    {posts.map(p => <div key={p.id} className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded truncate">{p.title}</div>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Détails de la journée</h3>
          {selectedDay ? (
            <div className="space-y-3">
              {scheduledPosts.filter(p => p.date === selectedDay).map(p => (
                <div key={p.id} className="p-4 border border-slate-100 bg-slate-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-800">{p.title}</h4>
                  <button className="w-full mt-2 flex items-center justify-center gap-2 text-xs bg-white border py-2 rounded-lg"><Eye size={14} /> Voir</button>
                </div>
              ))}
              {scheduledPosts.filter(p => p.date === selectedDay).length === 0 && <p className="text-xs text-slate-400">Aucun post planifié.</p>}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Cliquez sur un jour de la grille pour l'inspecter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
