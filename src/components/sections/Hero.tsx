import React, { useEffect, useState } from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';
import { usePersonalInfo } from '../../hooks/usePersonalInfo';
import { useContentSections } from '../../hooks/useContentSections';

const Hero: React.FC = () => {
  const { data: personalInfo, loading: personalLoading } = usePersonalInfo();
  const { data: contentSections, loading: contentLoading } = useContentSections();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const loading = personalLoading || contentLoading;
  const heroSection = contentSections['hero_section'];
  const roles = personalInfo?.roles || [];
  
  useEffect(() => {
    if (currentIndex >= roles.length) {
      setTimeout(() => {
        setCurrentIndex(0);
        setTypedText('');
      }, 3000);
      return;
    }
    
    const targetText = roles[currentIndex];
    
    if (typedText === targetText) {
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setTypedText('');
      }, 2000);
      return;
    }
    
    const timeout = setTimeout(() => {
      setTypedText(targetText?.substring(0, typedText.length + 1) || '');
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [typedText, currentIndex, roles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!personalInfo) return null;

  return (
    <section id="home" className="min-h-screen pt-20 flex items-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-blue-200 dark:bg-blue-900/20 filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-purple-200 dark:bg-purple-900/20 filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <p className="text-blue-500 dark:text-blue-400 font-medium mb-2">
              {heroSection?.subtitle || 'Hello, I\'m'}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              {personalInfo.name}
            </h1>
            
            <div className="h-8 mb-6">
              <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                I'm a <span className="text-blue-500 dark:text-blue-400 font-medium">{typedText}</span>
                <span className="animate-blink ml-1">|</span>
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              {personalInfo.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="#projects" 
                className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform hover:scale-105 inline-flex items-center justify-center"
              >
                View My Work
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
              <a 
                href="#contact" 
                className="btn border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Contact Me
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
              <img 
                src={personalInfo.avatar_url || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <a 
        href="#about" 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors animate-bounce"
      >
        <ArrowDown className="w-6 h-6" />
      </a>
    </section>
  );
};

export default Hero;