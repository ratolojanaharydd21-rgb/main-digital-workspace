// ContentFactory.jsx - L'Usine à Contenu LinkedIn IA avec Groq
import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send } from 'lucide-react';
import { generatePrompt } from './prompts';

export default function ContentFactory() {
  const [formData, setFormData] = useState({
    activity: '',
    audience: '',
    offer: '',
    framework: 'aida'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePostWithGroq = async (e) => {
    e.preventDefault();
    if (!formData.activity || !formData.audience || !formData.offer) return;

    setIsGenerating(true);
    setGeneratedPost('');
    
    const systemPrompt = generatePrompt(
      formData.activity,
      formData.audience,
      formData.offer,
      formData.framework
    );

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { 
              role: "system", 
              content: "Tu es un copywriter d'élite expert sur LinkedIn. Tu écris un français impeccable, percutant et aéré." 
            },
            { role: "user", content: systemPrompt }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        setGeneratedPost(data.choices[0].message.content.trim());
      } else {
        setGeneratedPost("⚠️ Une erreur est survenue. Vérifiez votre clé API Groq dans l'environnement.");
      }
    } catch (error) {
      console.error("Erreur API Groq:", error);
      setGeneratedPost("❌ Impossible de contacter l'IA. Vérifiez votre connexion.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-indigo-600" /> Usine à Contenu LinkedIn IA
        </h2>
        <p className="text-slate-500 mt-1">
          Générez des publications basées sur la psychologie de conversion francophone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <form onSubmit={generatePostWithGroq} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Votre Activité / Thématique</label>
            <input
              type="text"
              name="activity"
              required
              value={formData.activity}
              onChange={handleInputChange}
              placeholder="Ex: Assistant Virtuel, Community Manager"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Votre Audience Cible</label>
            <input
              type="text"
              name="audience"
              required
              value={formData.audience}
              onChange={handleInputChange}
              placeholder="Ex: PME, Coachs business, Entrepreneurs"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Votre Offre / Valeur Unique</label>
            <textarea
              name="offer"
              required
              rows="3"
              value={formData.offer}
              onChange={handleInputChange}
              placeholder="Ex: Délégation de 10h de tâches chronophages pour vous libérer du temps."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Framework de Copywriting</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border rounded-lg p-3 flex flex-col justify-between cursor-pointer transition-all ${formData.framework === 'aida' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="framework" value="aida" checked={formData.framework === 'aida'} onChange={handleInputChange} className="sr-only" />
                <span className="block text-sm font-bold text-slate-900">Structure AIDA</span>
                <span className="block text-xs text-slate-500 mt-1">Attention, Intérêt, Désir, Action.</span>
              </label>

              <label className={`border rounded-lg p-3 flex flex-col justify-between cursor-pointer transition-all ${formData.framework === 'storytelling' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="framework" value="storytelling" checked={formData.framework === 'storytelling'} onChange={handleInputChange} className="sr-only" />
                <span className="block text-sm font-bold text-slate-900">Hook Viral</span>
                <span className="block text-xs text-slate-500 mt-1">Accroche percutante et partage d'expérience.</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !formData.activity || !formData.audience || !formData.offer}
            className="w-full bg-slate-900 text-white font-medium py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Rédaction en cours...</>
            ) : (
              <><Send size={16} /> Générer le Post avec Groq</>
            )}
          </button>
        </form>

        {/* RENDU STYLE LINKEDIN */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aperçu LinkedIn</div>
          {generatedPost ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-3 border-b border-slate-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">MD</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Votre Profil <span className="text-xs text-slate-400 font-normal">• Vous</span></div>
                  <div className="text-xs text-slate-500">{formData.activity || "Créateur de contenu"}</div>
                </div>
              </div>
              <div className="p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{generatedPost}</div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">
                  {copied ? <><Check size={14} className="text-emerald-500" /> Copié !</> : <><Copy size={14} /> Copier le texte</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 flex flex-col items-center justify-center h-64">
              <Sparkles size={32} className="text-slate-300 mb-2" />
              <p className="text-sm">Remplissez le formulaire à gauche pour lancer le moteur IA Groq.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
