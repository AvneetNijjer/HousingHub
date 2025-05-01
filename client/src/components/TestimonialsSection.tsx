import { useState, useEffect } from 'react';
import { testimonials } from '@/lib/data';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import { motion, useInView } from 'framer-motion';

const TestimonialsSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const descriptionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1
      }
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Fixed background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-900 to-primary-900">
        <div className="absolute inset-0 opacity-30 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[80px]"></div>
          <div className="absolute top-1/3 -left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[80px]"></div>
          <div className="absolute -bottom-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full filter blur-[80px]"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        {/* Floating decorative elements */}
        <motion.div 
          className="absolute -top-10 right-10 w-32 h-32 rounded-full border border-white/10 opacity-30"
          animate={{ 
            y: [-10, 10, -10], 
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-10 w-24 h-24 rounded-full border border-white/10 opacity-20"
          animate={{ 
            y: [10, -10, 10], 
            rotate: [0, -5, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1 
          }}
        />
        
        <motion.div 
          className="text-center mb-20 relative"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <div className="inline-block mb-6">
            <motion.div className="relative inline-block" variants={titleVariants}>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-blue-200 font-medium">
                  <i className="fas fa-quote-left mr-2 opacity-70"></i>
                  Student Testimonials
                </span>
              </div>
            </motion.div>
          </div>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            variants={titleVariants}
          >
            What <span className="text-blue-300">Students</span> Say About Us
          </motion.h2>
          
          <motion.p 
            className="text-white/80 text-lg max-w-3xl mx-auto"
            variants={descriptionVariants}
          >
            Don't just take our word for it — hear from fellow students who found their perfect home using LetMeKnock's intuitive platform.
          </motion.p>
        </motion.div>
        
        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              delay={index * 0.1} 
            />
          ))}
        </div>
        
        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-white/80 mb-4">
            Join thousands of students who've found their perfect housing with LetMeKnock
          </p>
          
          <div className="inline-block">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <button className="relative px-8 py-4 bg-primary-800 text-white rounded-full font-medium border border-white/10 group-hover:border-white/20 transition-colors">
                Create Your Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
