import { motion } from 'framer-motion';
import FAQ from '@/components/FAQ';

const Guidelines = () => {
  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-primary-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Housing Guidelines & Resources
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Essential information for finding and securing your student housing
          </motion.p>
        </div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm p-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-2xl font-semibold text-primary-800 mb-6"
            variants={itemVariants}
          >
            Before You Begin Your Housing Search
          </motion.h2>

          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Determine Your Budget</h3>
              <p className="text-gray-600">
                Consider all expenses including rent, utilities, internet, groceries, transportation, and entertainment. 
                Most financial advisors recommend that housing costs shouldn't exceed 30% of your income or financial aid.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Decide on Location Priorities</h3>
              <p className="text-gray-600">
                Think about what's most important to you: proximity to campus, access to public transportation, 
                nearby amenities, safety of the neighborhood, etc. Our map feature can help you visualize distances.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consider Roommates</h3>
              <p className="text-gray-600">
                Having roommates can significantly reduce your housing costs. However, make sure to discuss 
                living habits, cleanliness expectations, and bill sharing before committing to a shared living arrangement.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Understand the Academic Calendar</h3>
              <p className="text-gray-600">
                Most student leases align with the academic year. Start your search 2-3 months before the 
                semester begins to get the best options. Be aware of lease terms and whether you need summer housing as well.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm p-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-2xl font-semibold text-primary-800 mb-6"
            variants={itemVariants}
          >
            What to Look for in a Student Rental
          </motion.h2>

          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Safety Features</h3>
              <p className="text-gray-600">
                Check for working smoke detectors, carbon monoxide detectors, fire extinguishers, 
                secure locks on doors and windows, and proper lighting in common areas and entrances.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Utilities and Internet</h3>
              <p className="text-gray-600">
                Clarify which utilities are included in rent and which you'll need to pay separately. 
                For student housing, reliable high-speed internet is essential for coursework.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Maintenance and Management</h3>
              <p className="text-gray-600">
                Research the landlord or property management company. How responsive are they to maintenance requests? 
                Are there on-site staff? Check reviews from current or previous tenants if possible.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Study Space</h3>
              <p className="text-gray-600">
                As a student, you need a suitable place to study. Check if the unit has desk space 
                or if the property has common study areas or quiet spaces.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <FAQ />
      </div>
    </div>
  );
};

export default Guidelines;
