import { BsStars } from 'react-icons/bs';
import ParticleAnimation from './ParticleAnimation';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <ParticleAnimation />
      <div className={`relative z-10 text-center px-4 ${isVisible ? 'fade-in' : ''}`}>
        <h1 className={`text-4xl md:text-6xl font-bold dark:bg-gray-900 dark:text-white mb-6 ${isVisible ? 'slide-up' : ''}`}>
          Start your successful product customization with Frist's Ox Studio!
        </h1>
        <p className={`text-xl md:text-2xl dark:text-gray-300 text-gray-600 mb-8 max-w-3xl mx-auto ${isVisible ? 'slide-up' : ''}`}>
          Design your fashion wear product to showcase your creativity to the world
        </p>
        <div>
          <Link 
            to="/design"
            className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 inline-flex items-center"
          >
            <BsStars className="mr-2" />
            Start Creating
          </Link>
        </div>
      </div>
    </div>
  );
}
