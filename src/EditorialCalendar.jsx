// EditorialCalendar.jsx - Calendrier Éditorial Réceptionnant les Données de App.jsx
import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Eye, Image, X, Calendar, FileText } from 'lucide-react';

export default function EditorialCalendar({ scheduledPosts, setScheduledPosts }) {
  // Les états locaux gèrent uniquement la navigation du calendrier et la modale
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 15)); // Juin 2026
  const [selectedDay, setSelectedDay] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    platform: 'LinkedIn',
    visual: null,
    visualName: ''
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: startOffset }, (_, i) => i);

  const handlePrevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null); };
  const handleNextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null); };

  const handleVisualChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost(prev => ({
          ...prev,
          visual: reader.result,
          visualName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSchedulePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const postToCreate = {
      id: Date.now(),
      date: selectedDay,
      title: newPost.title,
      content: newPost.content,
      platform: newPost.platform,
      visual: newPost.visual
    };

    setScheduledPosts(prev => [...prev, postToCreate]);
    setIsModalOpen(false);
    setNewPost({ title: '', content: '', platform: 'LinkedIn', visual: null, visualName: '' });
  };

  return (
    <div className="space-y-8 text-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="text-indigo-600" /> Calendrier Éditorial
        </h2>
        <p className="text-slate-500 mt-1">Organisez visuellement vos publications et gérez vos médias.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRILLE DU CALENDRIER */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">{monthsFr[month]} {year}</h3>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"><ChevronLeft size={16} /></button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"><ChevronRight size={16} /></button>
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
                  className={`h-24 p-1.5 border rounded-lg flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/10' 
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</span>
                  <div className="space-y-1 overflow-hidden flex-1 mt-1">
                    {posts.map(p => (
                      <div key={p.id} className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded truncate shadow-sm flex items-center gap-0.5">
                        {p.visual && <Image size={8} className="shrink-0" />}
                        <span className="truncate">{p.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANNEAU LATÉRAL : INSPECTION & PLANIFICATION */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Détails de la journée</h3>
          {selectedDay ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-xs text-indigo-600 font-bold">
                  {selectedDay.split('-').reverse().join('/')}
                </span>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 text-xs bg-indigo-600 text-white font-semibold px-2.5 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={12} /> Planifier
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {scheduledPosts.filter(p => p.date === selectedDay).map(p => (
                  <div key={p.id} className="p-4 border border-slate-100 bg-slate-50/70 rounded-lg shadow-sm space-y-3">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">{p.platform}</span>
                      <h4 className="text-sm font-semibold text-slate-800 mt-1.5">{p.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">{p.content}</p>
                    </div>

                    {p.visual && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-black max-h-32 flex items-center justify-center">
                        <img src={p.visual} alt="Aperçu" className="object-contain w-full h-full opacity-90" />
                      </div>
                    )}
                  </div>
                ))}
                
                {scheduledPosts.filter(p => p.date === selectedDay).length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-6">Aucun post planifié pour ce jour.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Cliquez sur un jour de la grille pour l'inspecter ou ajouter un post.</p>
          )}
        </div>
      </div>

      {/* MODALE POPUP DE CRÉATION DE POST DE SECOURS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                <Calendar size={14} className="text-indigo-600" /> Planifier manuellement pour le {selectedDay.split('-').reverse().join('/')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSchedulePost} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">Titre de la publication</label>
                <input 
                  type="text" 
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Mon post manuel" 
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">Contenu (Texte)</label>
                <textarea 
                  required
                  rows="4"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Écrivez votre texte..." 
                  className="w-full px-3 py-2 rounded-lg border text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">Visuel</label>
                <div className="mt-1 flex items-center justify-center border-2 border-dashed rounded-lg p-4 bg-slate-50 relative">
                  <input type="file" accept="image/*" onChange={handleVisualChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="text-center space-y-1 text-slate-500">
                    <Image size={20} className="mx-auto text-slate-400" />
                    <p className="text-xs">{newPost.visualName ? newPost.visualName : "Importer une image"}</p>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-2">
                <FileText size={12} /> Valider la planification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
