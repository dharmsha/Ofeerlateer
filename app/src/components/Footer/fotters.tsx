// app/src/components/footer/footer.tsx
"use client";

import { 
  FileText, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart, 
  Sparkles,
  Zap,
  Shield,
  Globe,
  Coffee
} from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur"></div>
                <FileText className="relative h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  OfferGen Pro
                </h2>
                <p className="text-sm text-gray-400">AI-Powered Offer Letters</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 max-w-md">
              Create professional, legally-compliant offer letters in minutes. 
              Trusted by 10,000+ companies worldwide to streamline their hiring process.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="group relative p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['Templates', 'Pricing', 'Case Studies', 'Integrations', 'API Docs'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white flex items-center group transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="w-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-4 mr-2 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-400" />
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get the latest updates on new features and templates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 group-hover:border-gray-600"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-gray-800/50">
          {[
            {
              icon: Shield,
              title: "Secure & Compliant",
              description: "GDPR & SOC2 compliant"
            },
            {
              icon: Globe,
              title: "Global Templates",
              description: "100+ country templates"
            },
            {
              icon: Zap,
              title: "Instant Generation",
              description: "Generate in <60 seconds"
            },
            {
              icon: Coffee,
              title: "24/7 Support",
              description: "Always here to help"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="inline-flex p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-sm">by</span>
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Dharm kumar
              </span>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} OfferGen Pro. All rights reserved. 
              <span className="mx-2">•</span>
              <span className="text-gray-400">v2.1.4</span>
              <span className="mx-2">•</span>
              <span className="text-green-400 flex items-center justify-center md:inline-flex mt-2 md:mt-0">
                <span className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                All systems operational
              </span>
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mt-8 text-center">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-gray-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-sm text-gray-400">Letters Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl"></div>
      </div>

      {/* Glow Effect Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
    </footer>
  );
};

export default Footer;