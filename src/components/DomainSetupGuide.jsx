import React, { useState } from 'react';
import { X, Globe, DollarSign, Check, Copy, ExternalLink, ShieldCheck, Rocket, Server } from 'lucide-react';

export default function DomainSetupGuide({ isOpen, onClose }) {
  const [copiedDomain, setCopiedDomain] = useState(null);

  if (!isOpen) return null;

  const domainSuggestions = [
    { name: "aitrendradar.com", type: "Kurumsal & Otoriter", price: "~$9.77/yıl" },
    { name: "vibehype.dev", type: "Vibe Coding & Trend", price: "~$10.18/yıl" },
    { name: "aihypepulse.com", type: "Piyasa & Hype Sinyali", price: "~$9.77/yıl" },
    { name: "danismanai.com", type: "Danışman & Beyaz Yaka", price: "~$9.77/yıl" },
    { name: "aitrendleri.org", type: "Topluluk & İndeks", price: "~$9.99/yıl" }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedDomain(text);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Domain Alma ve Cloudflare Yayını Rehberi</h3>
              <p className="text-xs text-slate-400">En ucuz fiyata ($9.77/yıl) sıfır komisyonla domain alma ve 1 tıkla bağlama</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
              <span className="w-6 h-6 rounded-full bg-amber-950 flex items-center justify-center text-xs border border-amber-500/40">1</span>
              <span>Domaini Cloudflare'den Alın (En Ucuz & Sıfır Komisyon)</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-3">
              GoDaddy veya Namecheap yerine doğrudan <strong>Cloudflare Registrar</strong> üzerinden domain alın. Cloudflare toptan fiyata satar (komisyon koymaz) ve WHOIS gizliliği ile SSL ömür boyu tamamen ücretsizdir.
            </p>
            
            <div className="space-y-2 mb-3">
              <div className="text-xs font-mono text-slate-400">💡 Örnek Boşta Olabilecek Domain Fikirleri:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {domainSuggestions.map((d) => (
                  <div key={d.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div>
                      <span className="font-mono font-bold text-white">{d.name}</span>
                      <span className="text-[10px] text-slate-400 block">{d.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-emerald-400">{d.price}</span>
                      <button
                        onClick={() => handleCopy(d.name)}
                        className="p-1 rounded text-slate-400 hover:text-white bg-slate-800"
                        title="Kopyala"
                      >
                        {copiedDomain === d.name ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://dash.cloudflare.com/?to=/:account/domains/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
            >
              <span>Cloudflare Registrar'a Git</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 flex items-center justify-center text-xs border border-indigo-500/40">2</span>
              <span>Projeyi GitHub'a Yükleyin</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-2">
              Bu klasördeki hazır projeyi GitHub hesabınızda açacağınız bir repoya (Örn: <code>ai-hype-radar</code>) push edin.
            </p>
            <div className="bg-slate-900 p-3 rounded-lg font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
              <div>git add .</div>
              <div>git commit -m "AI Hype Radar v1.0"</div>
              <div>git remote add origin https://github.com/kullaniciadiniz/ai-hype-radar.git</div>
              <div>git push -u origin main</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center text-xs border border-emerald-500/40">3</span>
              <span>Cloudflare Pages'e Bağlayın ve Domaini Tanımlayın</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Cloudflare Dashboard &gt; <strong>Workers &amp; Pages</strong> sekmesine girin.</li>
              <li><strong>Create application &gt; Pages &gt; Connect to Git</strong> seçin.</li>
              <li>GitHub reponuzu seçin, Build settings: <code>npm run build</code>, Build output: <code>dist</code> yapın ve Deploy'a basın.</li>
              <li>Siteniz anında <code>.pages.dev</code> uzantısıyla canlıya geçer!</li>
              <li>Ardından <strong>Custom domains</strong> sekmesinden aldığınız domaini (örn: <code>aitrendradar.com</code>) yazın. Cloudflare DNS ayarlarını tek tıkla otomatik bağlar!</li>
            </ol>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
              <span className="w-6 h-6 rounded-full bg-purple-950 flex items-center justify-center text-xs border border-purple-500/40">4</span>
              <span>GitHub Actions ile Günlük Otomasyonu Açın</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-2">
              GitHub reponuzun <strong>Settings &gt; Secrets and variables &gt; Actions</strong> bölümüne <code>GEMINI_API_KEY</code> anahtarınızı ekleyin.
              Projedeki <code>.github/workflows/daily-scan.yml</code> dosyası her sabah otomatik uyanıp sitenizin verilerini günceller!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Toplam Maliyet: Yalnızca Domain Ücreti (~$9.77/yıl)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Anladım, Harika!
          </button>
        </div>

      </div>
    </div>
  );
}
