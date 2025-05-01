import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle registration
    console.log('Sign up with:', { name, email, password, university, agreeTerms });
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 pt-8 pb-6 border-b border-gray-100">
            <div className="flex justify-center mb-6">
              <img src="/src/assets/logo.svg" alt="LetMeKnock Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">Create your account</h1>
            <p className="text-gray-600 text-center mt-1">Join LetMeKnock to find your perfect student housing</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3 border"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400"></i>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3 border"
                    placeholder="you@university.edu"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                  University/College
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-university text-gray-400"></i>
                  </div>
                  <input
                    id="university"
                    name="university"
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3 border"
                    placeholder="State University"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3 border"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3 border"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!agreeTerms}
                >
                  Create Account
                </motion.button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <i className="fab fa-google text-lg"></i>
                </a>

                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <i className="fab fa-apple text-lg"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/signin">
                <a className="font-medium text-primary-600 hover:text-primary-500">Sign in</a>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;