import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 to-indigo-900 text-white py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            School Management <span className="text-blue-300">Simplified</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
                            A comprehensive platform to manage academics, attendance, exams, and finance with ease. Streamline your school's operations today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/login">
                                <Button size="lg" color="primary" className="font-semibold text-lg px-8 bg-white text-blue-900 hover:bg-blue-50">
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/register-school">
                                <Button size="lg" variant="bordered" className="font-semibold text-lg px-8 text-white border-white hover:bg-white/10">
                                    Register School
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Power packed features to run your educational institution efficiently</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="mdi:google-classroom"
                            title="Academic Management"
                            description="Manage classes, subjects, and timetables efficiently. Keep track of curriculum progress."
                        />
                        <FeatureCard
                            icon="mdi:calendar-check"
                            title="Smart Attendance"
                            description="Digital attendance marking with comprehensive reports and tracking."
                        />
                        <FeatureCard
                            icon="mdi:chart-box"
                            title="Exam & Results"
                            description="Schedule exams, record marks, and generate automated report cards for students."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
        >
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Icon icon={icon} className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
