// EditorialCalendar.jsx - Calendrier Éditorial Complet avec Planification et Visuels
import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Eye, Image, X, Calendar, FileText } from 'lucide-react';

export default function EditorialCalendar() {
  // Liste des posts dynamique avec état (State)
  const [scheduledPosts, setScheduledPosts] = useState([
    { 
      id: 1, 
      date: '2026-06-18', 
      title: 'Post AIDA : Stratégie', 
      content: 'Voici notre approche architecturale pour structurer vos réseaux...', 
      platform: 'LinkedIn',
      visual: null 
    },
    { 
      id: 2, 
      date: '2026-06-22', 
      title: 'Hook : Éviter l\'épuisement', 
      content: 'Déléguez vos tâches chronophages pour scaler sereinement.', 
      platform: 'LinkedIn',
      visual: null 
    }
  ]);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 15)); // Juin 2026
  const [selectedDay, setSelectedDay] = useState(null);
  
  // États pour la gestion de la planification (Modale)
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

  // Gestion de l'importation du visuel (Image)
  const handleVisualChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost(prev => ({
          ...prev,
          visual: reader.result, // Contient l'image au format base64 lisible par le navigateur
          visualName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Soumission du formulaire de planification
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="text-indigo-600" /> Calendrier Éditorial
          </h2>
          <p className="text-slate-500 mt-1">Organisez visuellement vos publications et gérez vos médias.</p>
        </div>
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
                      <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap line-clamp-3 leading-relaxed">{p.content}</p>
                    </div>

                    {p.visual && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-black max-h-32 flex items-center justify-center">
                        <img src={p.visual} alt="Aperçu" className="object-cover w-full h-full opacity-90" />
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

      {/* MODALE POPUP DE CRÉATION DE POST */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-indigo-600" /> Planifier pour le {selectedDay.split('-').reverse().join('/')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSchedulePost} className="p-5 space-y-4 overflow-y-auto flex-1 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Titre de la publication</label>
                <input 
                  type="text" 
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Post Promotionnel - Offre Scaling" 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Contenu (Texte du Post)</label>
                <textarea 
                  required
                  rows="4"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Écrivez ou collez le texte généré par l'Usine à Contenu ici..." 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Ajouter un Visuel / Image</label>
                <div className="mt-1 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleVisualChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <div className="text-center space-y-1 text-slate-500 pointer-events-none">
                    <Image size={24} className="mx-auto text-slate-400" />
                    <p className="text-xs font-medium">
                      {newPost.visualName ? <span className="text-indigo-600 font-semibold">{newPost.visualName}</span> : "Cliquez pour importer une image"}
                    </p>
                    <p className="text-[10px] text-slate-400">PNG, JPG jusqu'à 5Mo</p>
                  </div>
                </div>
              </div>

              {newPost.visual && (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 h-24 bg-slate-100 flex items-center justify-center">
                  <img src={newPost.visual} alt="Preview" className="object-contain h-full w-full" />
                  <button 
                    type="button" 
                    onClick={() => setNewPost(prev => ({ ...prev, visual: null, visualName: '' }))}
                    className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full shadow-md hover:bg-rose-600"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-xs shadow"
              >
                <FileText size={14} /> Valider la planification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
