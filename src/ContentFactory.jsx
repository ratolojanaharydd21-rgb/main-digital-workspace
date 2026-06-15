// ContentFactory.jsx - L'Usine à Contenu connecté au Calendrier
import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, Calendar, Image } from 'lucide-react';
import { generatePrompt } from './prompts';

export default function ContentFactory({ scheduledPosts, setScheduledPosts, goToCalendar }) {
  const [formData, setFormData] = useState({
    activity: '',
    audience: '',
    offer: '',
    framework: 'aida'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [copied, setCopied] = useState(false);

  // États pour l'option de planification directe
  const [planningDate, setPlanningDate] = useState('2026-06-16');
  const [planningTitle, setPlanningTitle] = useState('');
  const [postVisual, setPostVisual] = useState(null);
  const [postVisualName, setPostVisualName] = useState('');
  const [isPlanned, setIsPlanned] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisualChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostVisual(reader.result);
        setPostVisualName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePostWithGroq = async (e) => {
    e.preventDefault();
    if (!formData.activity || !formData.audience || !formData.offer) return;

    setIsGenerating(true);
    setGeneratedPost('');
    setIsPlanned(false);
    setPlanningTitle(`Post ${formData.framework.toUpperCase()} - ${formData.audience}`);
    
    const systemPrompt = generatePrompt(
      formData.activity,
      formData.audience,
      formData.offer,
      formData.framework
    );

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setGeneratedPost("❌ Erreur : La clé VITE_GROQ_API_KEY n'est pas détectée.");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Tu es un copywriter d'élite expert sur LinkedIn. Tu écris un français impeccable, percutant et aéré." },
            { role: "user", content: systemPrompt }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `Erreur ${response.status}`);
      
      if (data.choices && data.choices[0]) {
        setGeneratedPost(data.choices[0].message.content.trim());
      } else {
        setGeneratedPost("⚠️ Réponse inattendue de l'IA.");
      }
    } catch (error) {
      setGeneratedPost(`❌ Impossible de générer le post. Détails : ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Envoyer directement le contenu au calendrier global
  const handleSendToCalendar = (e) => {
    e.preventDefault();
    if (!generatedPost || !planningTitle) return;

    const newPlannedPost = {
      id: Date.now(),
      date: planningDate,
      title: planningTitle,
      content: generatedPost,
      platform: 'LinkedIn',
      visual: postVisual
    };

    setScheduledPosts(prev => [...prev, newPlannedPost]);
    setIsPlanned(true);
    setPostVisual(null);
    setPostVisualName('');
  };

  return (
    <div className="space-y-8 text-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-indigo-600" /> Usine à Contenu LinkedIn IA
        </h2>
        <p className="text-slate-500 mt-1">Générez vos publications et planifiez-les en un clic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Formulaire Générateur */}
        <form onSubmit={generatePostWithGroq} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Votre Activité</label>
            <input type="text" name="activity" required value={formData.activity} onChange={handleInputChange} placeholder="Ex: Assistant Virtuel" className="w-full px-4 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Audience Cible</label>
            <input type="text" name="audience" required value={formData.audience} onChange={handleInputChange} placeholder="Ex: PME, Coachs" className="w-full px-4 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Votre Offre Unique</label>
            <textarea name="offer" required rows="3" value={formData.offer} onChange={handleInputChange} placeholder="Ex: Gestion de vos réseaux..." className="w-full px-4 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Framework</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border rounded-lg p-3 flex flex-col cursor-pointer ${formData.framework === 'aida' ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
                <input type="radio" name="framework" value="aida" checked={formData.framework === 'aida'} onChange={handleInputChange} className="sr-only" />
                <span className="font-bold text-slate-900">AIDA</span>
              </label>
              <label className={`border rounded-lg p-3 flex flex-col cursor-pointer ${formData.framework === 'storytelling' ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
                <input type="radio" name="framework" value="storytelling" checked={formData.framework === 'storytelling'} onChange={handleInputChange} className="sr-only" />
                <span className="font-bold text-slate-900">Hook Viral</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={isGenerating} className="w-full bg-slate-900 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50">
            {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send size={14} /> Générer le Post</>}
          </button>
        </form>

        {/* Aperçu & Liaison Calendrier */}
        <div className="space-y-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aperçu & Planification</div>
          
          {generatedPost ? (
            <div className="space-y-4">
              {/* Le rendu du Post */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs">MD</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">MAIN DIGITAL <span className="text-[10px] text-slate-400 font-normal">• IA</span></div>
                    <div className="text-[10px] text-slate-500">{formData.activity}</div>
                  </div>
                </div>
                <div className="p-4 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-white">{generatedPost}</div>
                <div className="px-4 py-2 bg-slate-50 border-t flex justify-end">
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-white px-2.5 py-1.5 border rounded-lg shadow-sm">
                    {copied ? 'Copié !' : <><Copy size={12} /> Copier</>}
                  </button>
                </div>
              </div>

              {/* Module d'envoi direct au Calendrier */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Calendar size={14} className="text-indigo-600" /> Planifier directement ce contenu
                </h4>
                
                {isPlanned ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex justify-between items-center">
                    <span>✨ Post ajouté avec succès au calendrier !</span>
                    <button onClick={goToCalendar} className="font-bold underline hover:text-emerald-900">Voir le Calendrier</button>
                  </div>
                ) : (
                  <form onSubmit={handleSendToCalendar} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date de publication</label>
                        <input type="date" value={planningDate} onChange={(e) => setPlanningDate(e.target.value)} className="w-full p-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Titre interne</label>
                        <input type="text" required value={planningTitle} onChange={(e) => setPlanningTitle(e.target.value)} className="w-full p-2 border rounded-lg" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Associer un visuel à cette date</label>
                      <div className="border border-dashed p-3 rounded-lg bg-slate-50 text-center relative hover:bg-slate-100 transition-colors">
                        <input type="file" accept="image/*" onChange={handleVisualChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <span className="text-slate-500 flex items-center justify-center gap-1 text-[11px]">
                          <Image size={12} /> {postVisualName ? <span className="text-indigo-600 font-semibold">{postVisualName}</span> : "Ajouter une image"}
                        </span>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                      🗓️ Programmer et Lier au Calendrier
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 border-2 border-dashed rounded-xl p-12 text-center text-slate-400 flex flex-col items-center justify-center h-64">
              <Sparkles size={24} className="text-slate-300 mb-2" />
              <p className="text-xs">Générez un contenu pour débloquer l'outil de planification.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
