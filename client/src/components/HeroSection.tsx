import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 300], [0, 100]);

  useEffect(() => {
    // Set loaded to true after a short delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax image variant
  const heroImage = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier curve for smooth easing
      }
    }
  };

  // Text container variants
  const textContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  // Heading variants
  const heading = {
    hidden: { y: -40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  // Description variants
  const description = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  // Button container variants
  const buttonContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  // Button variants
  const buttonItem = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  // Card that floats in animation
  const floatingCard = {
    hidden: { y: 80, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 0.9,
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background image with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0" 
        style={{ scale, opacity }}
        variants={heroImage}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Student apartment building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-800/70 to-primary-900/80 backdrop-blur-[2px]"></div>

        {/* Animated floating shapes */}
        <motion.div 
          className="absolute top-[20%] right-[15%] w-32 h-32 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30"
          animate={{ 
            y: [0, -30, 0], 
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        <motion.div 
          className="absolute top-[60%] left-[10%] w-24 h-24 rounded-full bg-purple-500/10 backdrop-blur-md border border-purple-500/30"
          animate={{ 
            y: [0, 20, 0], 
            x: [0, -10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1 
          }}
        />
      </motion.div>
      
      {/* Content area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div 
            className="text-left lg:text-left"
            variants={textContainer}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            style={{ y: textY }}
          >
            <motion.span 
              className="inline-block bg-blue-500/20 text-blue-100 backdrop-blur-sm py-1 px-3 rounded-full text-sm font-medium mb-4"
              variants={heading}
            >
              Student Housing Made Simple
            </motion.span>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight"
              variants={heading}
            >
              Find Your Perfect <span className="text-blue-300">Student Home</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 mb-10 max-w-2xl"
              variants={description}
            >
              LetMeKnock connects students with the best housing options near campus. Browse listings, view on map, and find your new home with ease.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-6"
              variants={buttonContainer}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              <motion.div variants={buttonItem}>
                <Link href="/listings">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-300"></div>
                    <button className="relative px-8 py-4 bg-white text-primary-800 rounded-full font-medium group-hover:text-primary-900 transition-colors shadow-xl flex items-center">
                      <i className="fas fa-home mr-2"></i> Browse Listings
                    </button>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div variants={buttonItem}>
                <Link href="/map">
                  <div className="px-8 py-4 border-2 border-white/30 backdrop-blur-sm bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors shadow-xl flex items-center">
                    <i className="fas fa-map-marked-alt mr-2"></i> View Map
                  </div>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 text-white/80 text-sm"
              variants={description}
            >
              <div className="flex items-center">
                <i className="fas fa-check-circle text-blue-400 mr-2"></i>
                <span>Verified Listings</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-university text-blue-400 mr-2"></i>
                <span>Campus Proximity</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-shield-alt text-blue-400 mr-2"></i>
                <span>Secure Platform</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Floating card preview */}
          <motion.div
            className="hidden lg:block"
            variants={floatingCard}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-2xl"></div>
              
              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/30 rounded-full blur-xl"></div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <i className="fas fa-home"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Featured Listing</h3>
                        <p className="text-xs text-white/70">Premium verified property</p>
                      </div>
                    </div>
                    <div className="bg-blue-500/20 backdrop-blur-sm text-white text-xs font-medium rounded-full px-3 py-1">
                      <i className="fas fa-star mr-1 text-yellow-300"></i> Top Rated
                    </div>
                  </div>
                  
                  {/* Image */}
                  <div className="relative mb-4 rounded-xl overflow-hidden h-40">
                    <img 
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Luxury apartment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-primary-800/90 text-white text-xs font-medium rounded-full px-3 py-1">
                      Apartment
                    </div>
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                      <i className="far fa-heart text-primary-800"></i>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white">Modern Downtown Studio</h3>
                    <p className="text-sm text-white/80"><i className="fas fa-map-marker-alt mr-1 text-blue-300"></i> 10 min from campus</p>
                  </div>
                  
                  {/* Features */}
                  <div className="flex items-center justify-between text-sm text-white/70 mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-bed text-blue-300 mr-1"></i> 1 Bed
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-bath text-blue-300 mr-1"></i> 1 Bath
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-ruler-combined text-blue-300 mr-1"></i> 450 ft²
                    </div>
                  </div>
                  
                  {/* Price and CTA */}
                  <div className="flex justify-between items-center">
                    <div className="text-white font-bold text-xl">
                      $750<span className="font-normal text-sm text-white/70">/mo</span>
                    </div>
                    <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-colors shadow-lg flex items-center">
                      <i className="fas fa-search-location mr-1.5"></i> View Details
                    </button>
                  </div>
                  
                  {/* Animated pulse dot */}
                  <motion.div 
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-500"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 0.4, 0.8]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    <motion.div 
                      className="absolute inset-0 w-full h-full rounded-full bg-blue-500"
                      animate={{ 
                        scale: [1, 2.5],
                        opacity: [0.8, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeOut" 
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <motion.div 
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
