/* translations.js
   Client-side multilingual support (no external API)
   Default language = browser/device language
   User can manually change language via <select id="lang-select"> in the navbar
*/

/* -------------------------------------------------- */
/*              TRANSLATIONS TABLE                    */
/* -------------------------------------------------- */
const AVAILABLE_LANGS = ['en', 'hi'];
const DEFAULT_LANG = 'en';

const translations = {
  hi: {
    'EasyFarms - AI-Powered Smart Farming': 'EasyFarms - एआई-संचालित स्मार्ट खेती',
    'The Future of Farming is Here': 'खेती का भविष्य यहाँ है',
    'AI-Powered Smart Farming for Every Farmer': 'प्रत्येक किसान के लिए एआई-संचालित स्मार्ट खेती',
    'Revolutionizing agriculture with AI to increase yield, reduce costs, and promote sustainability.':
      'ऊपज बढ़ाने, लागत कम करने और सतत खेती को बढ़ावा देने के लिए एआई के साथ कृषि में क्रांतिकारी बदलाव।',

    'About': 'हमारे बारे में',
    'Meet Hal': 'Milie Hal se',
    'Services': 'सेवाएँ',
    'How It Works': 'कैसे काम करता है',
    'Testimonials': 'प्रशंसापत्र',
    'Partners': 'साझेदार',

    'Sign In': 'साइन इन',
    'Get Started': 'शुरू करें',
    'Try AI Assistant Hal': 'AI सहायक Hal आज़माएँ',
    'Try Hal Now': 'Hal को अभी आज़माएँ',
    'Get Started Now': 'अभी शुरू करें',
    'View All Services': 'सभी सेवाएँ देखें',
    'Learn more': 'और पढ़ें',
    'Join Now': 'अब जुड़ें',
    'Subscribe': 'सदस्यता लें',
    'Scan to download': 'डाउनलोड करने के लिए स्कैन करें',
    'Take EasyFarms With You': 'EasyFarms अपने साथ रखें',
    'GET IT ON': 'प्राप्त करें',

    'About EasyFarms': 'EasyFarms के बारे में',
    'Our Mission': 'हमारा मिशन',
    'Our Vision': 'हमारी दृष्टि',
    'Meet "Hal" – Your AI Assistant': '"Hal" से मिलिए – आपका AI सहायक',
    'Crop Guidance': 'फसल मार्गदर्शन',
    'Soil Analysis': 'मृदा विश्लेषण',
    'Disease Detection': 'रोग पहचान',
    'Weather Tips': 'मौसम सुझाव',
    'The EasyFarms App': 'EasyFarms ऐप',
    'Trusted by leading agricultural institutions and technology providers worldwide.':
      'दुनिया भर के अग्रणी कृषि संस्थानों और प्रौद्योगिकी प्रदाताओं द्वारा विश्वासित।',

    'Ask Hal a question...': 'Hal से सवाल पूछें...',
    'Hello! I\\\'m Hal, your farming assistant. How can I help you today?':
      'नमस्ते! मैं Hal हूँ, आपका खेती सहायक। मैं आपकी कैसे मदद कर सकता हूँ?',
    'Based on your description, your tomato plants might have early blight. Could you upload a photo for a more accurate diagnosis?':
      'आपके विवरण के आधार पर, आपकी टमाटर की पत्तियों में प्रारंभिक ब्लाइट हो सकता है। अधिक सटीक निदान के लिए क्या आप फोटो अपलोड कर सकते हैं?',

    'Contact Us': 'संपर्क करें',
    'Stay Updated': 'अपडेट रहें',
    'Subscribe to our newsletter for the latest farming tips and updates.':
      'नवीनतम खेती सुझाव और अपडेट के लिए हमारे न्यूज़लेटर की सदस्यता लें।',
    'All rights reserved.': 'सर्वाधिकार सुरक्षित।',
    'Privacy Policy': 'गोपनीयता नीति',
    'Terms of Service': 'सेवा की शर्तें',
    'Cookie Policy': 'कूकी नीति',

    'Weather': 'मौसम',
    'Crop Health': 'फसल स्वास्थ्य',
    'Farm Dashboard': 'फार्म डैशबोर्ड',
    'Sunny, 24°C': 'धूप वाला, 24°C'
  }
};

/* -------------------------------------------------- */
/*           UTILITIES + CORE LOGIC                   */
/* -------------------------------------------------- */
(function(){
  'use strict';

  // Detect current lang (URL > localStorage > browser)
  function getCurrentLang() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = (params.get('lang') || '').toLowerCase();
      if (q && AVAILABLE_LANGS.includes(q)) {
        localStorage.setItem('easyfarms_lang', q);
        return q;
      }
      const stored = localStorage.getItem('easyfarms_lang');
      if (stored && AVAILABLE_LANGS.includes(stored)) return stored;
      const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (nav.startsWith('hi')) return 'hi';
    } catch (e) {}
    return DEFAULT_LANG;
  }

  // DOM walker to translate visible text nodes
  const SKIP_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','IFRAME','CODE','PRE','TEMPLATE']);
  function walkAndTranslate(langMap) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const tag = node.parentElement && node.parentElement.tagName;
        if (tag && SKIP_TAGS.has(tag)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }, false);

    const pending = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue.trim();
      if (langMap[text]) {
        pending.push({ node, original: text, replacement: langMap[text] });
      } else {
        for (const key in langMap) {
          if (text.includes(key)) {
            pending.push({ node, substring: key, replacement: langMap[key] });
            break;
          }
        }
      }
    }

    pending.forEach(item => {
      try {
        if (item.original !== undefined) {
          item.node.nodeValue = item.node.nodeValue.replace(item.original, item.replacement);
        } else {
          item.node.nodeValue = item.node.nodeValue.split(item.substring).join(item.replacement);
        }
      } catch (e) {}
    });
  }

  // Translate placeholders, aria-label etc.
  function translateAttributes(langMap) {
    const ATTRS = ['placeholder','alt','title','aria-label','value'];
    document.querySelectorAll('*').forEach(el => {
      if (el.tagName && SKIP_TAGS.has(el.tagName)) return;
      ATTRS.forEach(attr => {
        const val = el.getAttribute(attr);
        if (val) {
          if (langMap[val]) {
            el.setAttribute(attr, langMap[val]);
          } else {
            for (const key in langMap) {
              if (val.includes(key)) {
                el.setAttribute(attr, val.split(key).join(langMap[key]));
                break;
              }
            }
          }
        }
      });
    });
  }

  function setDocumentLang(code) {
    try { document.documentElement.lang = code; } catch(e){}
  }

  function runTranslation(lang) {
    if (lang === DEFAULT_LANG) {
      setDocumentLang(DEFAULT_LANG);
      return;
    }
    const map = translations[lang];
    if (map) {
      walkAndTranslate(map);
      translateAttributes(map);
      setDocumentLang(lang);
    }
  }

  // Init
  function init() {
    const lang = getCurrentLang();
    document.addEventListener('DOMContentLoaded', function(){
      setTimeout(() => runTranslation(lang), 30);
    });
  }

  /* -------------------------------------------------- */
  /*         Public I18n API (exposed on window)        */
  /* -------------------------------------------------- */
  window.EasyFarmsI18n = {
    setLang(code) {
      if (AVAILABLE_LANGS.includes(code)) {
        localStorage.setItem('easyfarms_lang', code);
        location.reload();
      }
    },
    getLang() {
      return getCurrentLang();
    },
    runNow() {
      runTranslation(getCurrentLang());
    }
  };

  init();

})();


/* -------------------------------------------------- */
/*             DROPDOWN HANDLER                       */
/* -------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  var selector = document.getElementById('lang-select');
  if(!selector) return;

  // set initial value
  try {
    selector.value = EasyFarmsI18n.getLang();
  } catch(e){}

  // on change
  selector.addEventListener('change', function(e){
    var code = e.target.value;
    EasyFarmsI18n.setLang(code);
  });
});
