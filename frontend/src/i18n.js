import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
const en = {
  translation: {
    nav: {
      home: 'Home',
      fleet: 'Elite Fleet',
      unlimited: 'Unlimited',
      bookings: 'My Bookings',
      admin: 'Admin',
      login: 'Login',
      register: 'Register'
    },
    hero: {
      title: 'Drive the Future of',
      luxury: 'Luxury.',
      subtitle: 'Experience the world\'s most elite vehicles on demand. No ownership, just pure adrenaline.',
      cta: 'Explore Fleet',
      alt_cta: 'Download App'
    },
    common: {
      search: 'Search for luxury...',
      book_now: 'Reserve Journey',
      per_day: 'per day',
      pickup: 'Pickup Date',
      return: 'Return Date'
    }
  }
};

const hi = {
  translation: {
    nav: {
      home: 'होम',
      fleet: 'फ्ललीट',
      unlimited: 'अनलिमिटेड',
      bookings: 'मेरी बुकिंग',
      admin: 'एडमिन',
      login: 'लॉगिन',
      register: 'रजिस्टर'
    },
    hero: {
      title: 'लक्ज़री के भविष्य की',
      luxury: 'सवारी करें।',
      subtitle: 'दुनिया के सबसे शानदार वाहनों का अनुभव करें। मालिकाना हक नहीं, सिर्फ रोमांच।',
      cta: 'फ्ललीट देखें',
      alt_cta: 'ऐप डाउनलोड करें'
    },
    common: {
      search: 'लक्ज़री खोजें...',
      book_now: 'सफर बुक करें',
      per_day: 'प्रति दिन',
      pickup: 'पिकअप तारीख',
      return: 'वापसी तारीख'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      hi
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
