// EditorialCalendar.jsx - Calendrier Éditorial
import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';

export default function EditorialCalendar() {
  const [scheduledPosts] = useState([
    { id: 1, date: '2026-06-18', title: 'Post AIDA : Stratégie', platform: 'LinkedIn' },
    { id: 2, date: '2026-06-22', title: 'Hook : Éviter l\'épuisement', platform: 'LinkedIn' }
  ]);

  // Rendre la date dynamique pour naviguer entre les mois
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 15)); // Par défaut Juin 2026
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Correction propre du premier jour de la semaine (Lundi comme jour 1)
  let firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: startOffset }, (_, i) => i);

  // Fonctions de navigation pour changer de mois
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

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
            <h3 className="text-lg font-bold text-slate-800">{monthsFr[month]} {year}</h3>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {emptySlots.map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-slate-50/50 rounded-lg border border-slate-100/50"></div>
            ))}
            
            {daysArray.map((day) => {
              const currentMonthStr = String(month + 1).padStart(2, '0');
              const dateStr = `${year}-${currentMonthStr}-${String(day).padStart(2, '0')}`;
              const posts = scheduledPosts.filter(p => p.date === dateStr);
              const isSelected = selectedDay === dateStr;

              return (
                <div 
                  key={`day-${day}`} 
                  onClick={() => setSelectedDay(dateStr)} 
                  className={`h-24 p-2 border rounded-lg flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/10' 
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</span>
                  <div className="space-y-1 overflow-hidden">
                    {posts.map(p => (
                      <div key={p.id} className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded truncate shadow-sm">
                        {p.title}
                      </div>
                    ))}
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
              <div className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded w-fit">
                {selectedDay.split('-').reverse().join('/')}
              </div>
              {scheduledPosts.filter(p => p.date === selectedDay).map(p => (
                <div key={p.id} className="p-4 border border-slate-100 bg-slate-50 rounded-lg shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{p.platform}</span>
                  <h4 className="text-sm font-semibold text-slate-800">{p.title}</h4>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 text-xs bg-white border border-slate-200 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Eye size={14} /> Voir le contenu
                  </button>
                </div>
              ))}
              {scheduledPosts.filter(p => p.date === selectedDay).length === 0 && (
                <p className="text-xs text-slate-400 italic">Aucun post planifié pour cette journée.</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Cliquez sur un jour de la grille pour inspecter ou planifier.</p>
          )}
        </div>
      </div>
    </div>
  );
}
