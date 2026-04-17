import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12 border-t border-slate-200 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-2xl tracking-tight dark:text-white">
                UNITED <span className="text-blue-600">CAR</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Redefining luxury automotive experiences since 2024. Providing premium mobility for the world's most discerning travelers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 dark:text-white">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="/#fleet" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Browse Fleet</a></li>
              <li><a href="/#services" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Professional Services</a></li>
              <li><Link to="/profile" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">My Account</Link></li>
              <li><a href="/#contact" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">24/7 Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 dark:text-white">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Cookie Settings</a></li>
              <li><Link to="/requirements" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Rental Requirements</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-lg font-bold mb-6 dark:text-white">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=JAIPUR+RAJASTHAN+302020" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
                >
                  JAIPUR, <br />RAJASTHAN 302020
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <a href="mailto:arebhai09@gmail.com" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
                  arebhai09@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <a href="tel:9216497682" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
                  9216497682
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © 2024 UNITED CAR International. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Design Excellence <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
