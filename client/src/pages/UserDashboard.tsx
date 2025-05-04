import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Listings', value: '3', icon: 'fa-home', color: 'bg-blue-500' },
    { label: 'Saved Properties', value: '12', icon: 'fa-heart', color: 'bg-red-500' },
    { label: 'Messages', value: '5', icon: 'fa-envelope', color: 'bg-green-500' },
    { label: 'Viewings Scheduled', value: '2', icon: 'fa-calendar', color: 'bg-purple-500' }
  ];

  const recentActivity = [
    { type: 'listing', action: 'created', title: 'Modern Studio Apartment', time: '2 hours ago' },
    { type: 'message', action: 'received', title: 'New message from John', time: '5 hours ago' },
    { type: 'viewing', action: 'scheduled', title: 'Campus View Apartments', time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.email}</h1>
              <p className="text-gray-600 mt-2 text-lg">Here's what's happening with your account</p>
            </div>
            <div className="hidden md:block">
              <Link href="/listings/new">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center">
                  <i className="fas fa-plus mr-2"></i> New Listing
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-4 rounded-xl ${stat.color} text-white shadow-md`}>
                  <i className={`fas ${stat.icon} text-2xl`}></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link href="/listings/new">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md">
                    <i className="fas fa-plus mr-2"></i> Create New Listing
                  </button>
                </Link>
                <Link href="/listings">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200 shadow-sm">
                    <i className="fas fa-search mr-2"></i> Browse Properties
                  </button>
                </Link>
                <Link href="/settings">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200 shadow-sm">
                    <i className="fas fa-cog mr-2"></i> Account Settings
                  </button>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-3 rounded-xl ${
                      activity.type === 'listing' ? 'bg-green-100 text-green-600' :
                      activity.type === 'message' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <i className={`fas ${
                        activity.type === 'listing' ? 'fa-home' :
                        activity.type === 'message' ? 'fa-envelope' :
                        'fa-calendar'
                      } text-xl`}></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {['overview', 'listings', 'messages', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-base capitalize transition-colors`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Account Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500 mb-2">Email Address</p>
                          <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500 mb-2">Member Since</p>
                          <p className="text-lg font-semibold text-gray-900">March 2024</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500 mb-2">Account Type</p>
                          <p className="text-lg font-semibold text-gray-900">Premium</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500 mb-2">Last Login</p>
                          <p className="text-lg font-semibold text-gray-900">Today at 10:30 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 