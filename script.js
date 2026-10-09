(() => {
const FAQ = window.FENNIX_FAQ || [];
const LOCALE = {en:"en-IN", ta:"ta-IN", hi:"hi-IN"};
const UI = {
 en:{tag:"Your Voice. Your Language. Your Access.",h1:"Ask in your voice. Get answers in your language.",lead:"Plain, spoken guidance for public services — no forms to decode, no jargon to learn.",speak:"Speak your question",type:"Type instead",quote:"Technology should understand people, not force people to understand technology.",askH:"What do you need help with?",label:"Your question",ph:"e.g. How do I change my address in Aadhaar?",ask:"Get answer",listen:"Read it aloud",note:"FENNIX gives general guidance. Always confirm details on the official government website or at your local office.",
  listening:"Listening… speak now.",none:"I couldn't find that yet. Try words like Aadhaar, ration card, pension, birth or voter.",nomic:"Voice input isn't supported in this browser. Please type your question.",nospeech:"Reading aloud isn't supported in this browser.",stop:"Stop"},
 ta:{tag:"உங்கள் குரல். உங்கள் மொழி. உங்கள் அணுகல்.",h1:"உங்கள் குரலில் கேளுங்கள். உங்கள் மொழியில் பதில் பெறுங்கள்.",lead:"அரசு சேவைகளுக்கான எளிய, பேசும் வழிகாட்டி — படிவங்களைப் புரிந்துகொள்ளும் சிரமம் இல்லை.",speak:"குரலில் கேளுங்கள்",type:"தட்டச்சு செய்யுங்கள்",quote:"தொழில்நுட்பம் மக்களைப் புரிந்துகொள்ள வேண்டும்; மக்கள் தொழில்நுட்பத்தைப் புரிந்துகொள்ள வற்புறுத்தப்படக் கூடாது.",askH:"உங்களுக்கு என்ன உதவி வேண்டும்?",label:"உங்கள் கேள்வி",ph:"எ.கா. ஆதாரில் முகவரியை எப்படி மாற்றுவது?",ask:"பதில் பெறுக",listen:"சத்தமாகப் படிக்கவும்",note:"FENNIX பொதுவான வழிகாட்டுதலை மட்டுமே வழங்குகிறது. விவரங்களை அதிகாரப்பூர்வ அரசு இணையதளம் அல்லது உள்ளூர் அலுவலகத்தில் உறுதிசெய்யவும்.",
  listening:"கேட்கிறேன்… இப்போது பேசுங்கள்.",none:"இன்னும் அது கிடைக்கவில்லை. ஆதார், ரேஷன், ஓய்வூதியம், பிறப்பு, வாக்காளர் போன்ற சொற்களை முயலுங்கள்.",nomic:"இந்த உலாவியில் குரல் உள்ளீடு இல்லை. தட்டச்சு செய்யுங்கள்.",nospeech:"இந்த உலாவியில் சத்தமாகப் படிக்க இயலாது.",stop:"நிறுத்து"},
 hi:{tag:"आपकी आवाज़। आपकी भाषा। आपकी पहुँच।",h1:"अपनी आवाज़ में पूछिए। अपनी भाषा में जवाब पाइए।",lead:"सरकारी सेवाओं के लिए सरल, बोलकर मिलने वाला मार्गदर्शन — न फ़ॉर्म समझने की उलझन, न कठिन शब्द।",speak:"बोलकर पूछें",type:"टाइप करें",quote:"तकनीक को लोगों को समझना चाहिए, लोगों को तकनीक समझने के लिए मजबूर नहीं करना चाहिए।",askH:"आपको किस चीज़ में मदद चाहिए?",label:"आपका सवाल",ph:"जैसे: आधार में पता कैसे बदलें?",ask:"जवाब पाएं",listen:"बोलकर सुनाएं",note:"FENNIX सामान्य मार्गदर्शन देता है। विवरण की पुष्टि सरकारी वेबसाइट या स्थानीय कार्यालय से ज़रूर करें।",
  listening:"सुन रहा हूँ… अब बोलिए।",none:"यह अभी नहीं मिला। आधार, राशन, पेंशन, जन्म या वोटर जैसे शब्द आज़माएं।",nomic:"इस ब्राउज़र में आवाज़ से इनपुट उपलब्ध नहीं है। कृपया टाइप करें।",nospeech:"इस ब्राउज़र में बोलकर सुनाना उपलब्ध नहीं है।",stop:"रुकें"}
};
let lang = localStorage.getItem("fennix-lang") || "en";
let current = null;
const $ = id => document.getElementById(id);
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

function applyLang(l){
  lang = l; try{localStorage.setItem("fennix-lang", l)}catch(e){}
  document.documentElement.lang = l;
  document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = UI[l][e.dataset.i18n]);
  document.querySelectorAll("[data-i18n-ph]").forEach(e => e.placeholder = UI[l][e.dataset.i18nPh]);
  document.querySelectorAll(".langs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === l));
  $("chips").innerHTML = "";
  FAQ.forEach(f => {
    const li = document.createElement("li"), b = document.createElement("button");
    b.textContent = f.title[l]; b.onclick = () => show(f);
    li.append(b); $("chips").append(li);
  });
  if (current) show(current);
}
function find(text){
  const t = text.toLowerCase(); let best = null, score = 0;
  FAQ.forEach(f => { const s = f.keywords.filter(k => t.includes(k.toLowerCase())).length; if (s > score){score = s; best = f;} });
  return best;
}
function show(f){
  current = f; $("status").textContent = "";
  $("aTitle").textContent = f.title[lang]; $("aText").textContent = f.a[lang];
  $("answer").hidden = false;
}
function ask(text){
  const f = find(text);
  if (f) show(f); else { current = null; $("answer").hidden = true; $("status").textContent = UI[lang].none; }
}
function speak(text){
  if (!synth) { $("status").textContent = UI[lang].nospeech; return; }
  synth.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = LOCALE[lang]; u.rate = .92; synth.speak(u);
}
let rec = null;
function toggleMic(){
  const btn = $("micBtn");
  if (!SR) { $("status").textContent = UI[lang].nomic; $("q").focus(); return; }
  if (rec) { rec.stop(); return; }
  rec = new SR(); rec.lang = LOCALE[lang]; rec.interimResults = false;
  rec.onstart = () => { btn.setAttribute("aria-pressed","true"); $("signal").classList.add("live"); $("status").textContent = UI[lang].listening; };
  rec.onresult = e => { const t = e.results[0][0].transcript; $("q").value = t; ask(t); if (current) speak(current.a[lang]); };
  rec.onerror = () => { $("status").textContent = UI[lang].nomic; };
  rec.onend = () => { rec = null; btn.setAttribute("aria-pressed","false"); $("signal").classList.remove("live"); };
  rec.start();
}
$("micBtn").onclick = toggleMic;
$("askForm").onsubmit = e => { e.preventDefault(); ask($("q").value); };
$("listenBtn").onclick = () => current && speak(current.a[lang]);
document.querySelectorAll(".langs button").forEach(b => b.onclick = () => applyLang(b.dataset.lang));
applyLang(lang);
})();
