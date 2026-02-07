import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import {
    Users, Clock, Star, ArrowRight, Target, Trophy,
    Monitor, Award, BookOpen, BarChart, PenTool,
    Briefcase, Globe, MessageCircle, ChevronDown, CheckCircle,
    Zap, PlayCircle
} from 'lucide-react';

const courses = [
    {
        id: 1,
        category: 'Business',
        title: 'Basics of Odoo CRM',
        description: 'Master CRM fundamentals, pipeline management, and automation to boost your sales performance.',
        rating: 4.8,
        reviews: '2.3k',
        students: '5.4k',
        duration: '6h 30m',
        instructor: 'Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        category: 'Technology',
        title: 'Advanced Sales Automation',
        description: 'Take your CRM skills to the next level with advanced workflows, integrations, and automation techniques.',
        rating: 4.9,
        reviews: '1.8k',
        students: '3.2k',
        duration: '8h 15m',
        instructor: 'Michael Chen',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        category: 'Design',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn design thinking, wireframing, prototyping, and user research to create amazing digital experiences.',
        rating: 4.7,
        reviews: '3.1k',
        students: '8.9k',
        duration: '10h 45m',
        instructor: 'Emma Rodriguez',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    }
];

const features = [
    {
        icon: <Target className="w-8 h-8 text-primary" />,
        title: 'Expert-Led Courses',
        description: 'Learn from industry professionals with real-world experience and proven track records.'
    },
    {
        icon: <Trophy className="w-8 h-8 text-primary" />,
        title: 'Gamified Learning',
        description: 'Earn points, unlock badges, and track your progress as you advance from Beginner to Master.'
    },
    {
        icon: <Monitor className="w-8 h-8 text-primary" />,
        title: 'Learn Anywhere',
        description: 'Access courses on any device. Learn at your own pace, on your own schedule.'
    },
    {
        icon: <Award className="w-8 h-8 text-primary" />,
        title: 'Get Certified',
        description: 'Earn certificates upon completion to showcase your skills and boost your credibility.'
    }
];

const categories = [
    { name: 'Business', count: '250+', icon: <BarChart /> },
    { name: 'Technology', count: '380+', icon: <Monitor /> },
    { name: 'Design', count: '190+', icon: <PenTool /> },
    { name: 'Marketing', count: '210+', icon: <Target /> },
    { name: 'Career', count: '165+', icon: <Briefcase /> },
    { name: 'Data Science', count: '145+', icon: <BarChart /> },
    { name: 'Writing', count: '120+', icon: <BookOpen /> },
    { name: 'Languages', count: '200+', icon: <Globe /> },
];

const stats = [
    { label: 'Active Learners', value: '50k+', icon: <Users className="w-6 h-6" /> },
    { label: 'Courses Completed', value: '15k+', icon: <CheckCircle className="w-6 h-6" /> },
    { label: 'Countries', value: '120+', icon: <Globe className="w-6 h-6" /> },
    { label: 'Satisfaction', value: '98%', icon: <Star className="w-6 h-6" /> },
];

const faqs = [
    {
        question: "How do I get started?",
        answer: "Simply create a free account, browse our course catalog, and enroll in any course that interests you. Most courses are free to start!"
    },
    {
        question: "What is the badge system?",
        answer: "Our gamified learning system rewards you with points for completing lessons and quizzes. As you earn points, you unlock badges from Beginner to Master level."
    },
    {
        question: "Are there any prerequisites?",
        answer: "Most courses are designed for beginners and don't require any prerequisites. Advanced courses will clearly state any required knowledge or skills in their description."
    },
    {
        question: "Can I learn at my own pace?",
        answer: "Absolutely! All courses are self-paced. Learn when it suits your schedule - day or night, weekday or weekend."
    }
];

const Home = () => {
    return (
        <div className="bg-background min-h-screen text-text font-sans scroll-smooth">
            <HeroSection />

            {/* Featured Courses Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl mb-4">
                                <span className="text-primary">Featured</span> Courses
                            </h2>
                            <p className="text-lg text-gray-500">Explore our most popular courses handpicked by industry experts for you.</p>
                        </div>
                        <Link to="/browse" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group">
                            View All Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <div key={course.id} className="group bg-white rounded-3xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full">
                                <div className="h-56 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                                        {course.category}
                                    </span>
                                    <button className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                        <PlayCircle size={20} fill="currentColor" className="text-primary" />
                                    </button>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-text mb-3 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">{course.description}</p>

                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1 text-text font-bold">
                                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                                {course.rating}
                                            </div>
                                            <span>{course.reviews}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-l border-gray-200">
                                            <div className="flex items-center gap-1 text-text font-bold">
                                                <Users className="w-3.5 h-3.5 text-secondary" />
                                                {course.students}
                                            </div>
                                            <span>Students</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-l border-gray-200">
                                            <div className="flex items-center gap-1 text-text font-bold">
                                                <Clock className="w-3.5 h-3.5 text-secondary" />
                                                {course.duration}
                                            </div>
                                            <span>Duration</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {course.instructor.charAt(0)}
                                            </div>
                                            <div className="text-sm">
                                                <p className="text-xs text-gray-500">Instructor</p>
                                                <p className="text-text font-medium hover:text-primary cursor-pointer transition-colors">{course.instructor}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/browse" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group">
                            View All Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section with Glassmorphism */}
            <section className="py-20 relative overflow-hidden bg-primary text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-12 lg:p-16">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/20">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="text-center pt-8 lg:pt-0 group">
                                    <div className="flex justify-center mb-4 text-secondary group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                                        {stat.icon}
                                    </div>
                                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                                    <div className="text-blue-100 font-medium uppercase tracking-wider text-xs">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why LearnSphere Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Why Choose <span className="text-primary underline decoration-secondary/30 underline-offset-8">LearnSphere</span>?</h2>
                        <p className="mt-4 text-lg text-gray-500">Everything you need to succeed in your learning journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Categories Section */}
            <section className="py-24 bg-white relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Explore by Category</h2>
                        <p className="mt-4 text-lg text-gray-500">Find the perfect course in your area of interest</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="group bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 p-8 rounded-2xl transition-all cursor-pointer flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                                    {cat.icon}
                                </div>
                                <h3 className="font-bold text-text mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-gray-500 text-xs font-medium bg-white px-2 py-1 rounded-full border border-gray-100">{cat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gray-50 relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Start Learning in 3 Steps</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-[3.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent border-t border-dashed border-primary/20"></div>

                        {[
                            { step: '1', title: 'Sign Up', desc: 'Create your free account in under 60 seconds.', icon: <Zap /> },
                            { step: '2', title: 'Choose Course', desc: 'Browse our extensive catalog and enroll.', icon: <BookOpen /> },
                            { step: '3', title: 'Start Learning', desc: 'Watch videos, earn points, and get certified.', icon: <Trophy /> }
                        ].map((item, idx) => (
                            <div key={idx} className="relative text-center group">
                                <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center relative z-10 shadow-xl group-hover:border-primary transition-colors duration-300">
                                    <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                                        {item.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-white font-bold flex items-center justify-center shadow-lg border-2 border-white">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-text mb-3">{item.title}</h3>
                                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Badge Showcase */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Earn <span className="text-primary">Badges</span></h2>
                        <p className="mt-4 text-lg text-gray-500">Track your progress and unlock achievements</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {['Beginner', 'Newbie', 'Explorer', 'Achiever', 'Specialist', 'Expert', 'Master'].map((badge, idx) => (
                            <div key={idx} className="group relative">
                                <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:border-secondary/50 transition-all duration-300 shadow-sm hover:shadow-lg transform group-hover:rotate-6">
                                    <Award className={`w-10 h-10 ${idx > 4 ? 'text-yellow-400 drop-shadow-md' : 'text-gray-400'} group-hover:text-primary transition-colors`} />
                                </div>
                                <span className="block text-text font-medium text-sm">{badge}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{idx * 20}+ PTS</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instructor CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="lg:flex lg:items-center lg:justify-between bg-white rounded-[2.5rem] p-12 shadow-xl border border-gray-100 relative overflow-hidden text-gray-900">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>

                        <div className="lg:w-1/2 relative z-10">
                            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">Join Our Team</span>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">Become an Instructor</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Transform your knowledge into income. Join our community of expert instructors and make a global impact today.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {[
                                    'Create engaging courses with easy tools',
                                    'Track student progress with analytics',
                                    'Earn revenue from every enrollment'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-600">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <CheckCircle size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-900 px-8 py-4 text-base font-bold shadow-lg hover:bg-gray-200 transition-all transform hover:-translate-y-1 border border-gray-200">
                                Start Teaching Today <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-background">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="group bg-white rounded-2xl border border-gray-200 [&_summary::-webkit-details-marker]:hidden open:border-primary/20 transition-all shadow-sm">
                                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-text font-medium">
                                    <span className="text-lg">{faq.question}</span>
                                    <span className="shrink-0 rounded-full bg-gray-50 p-2 text-gray-500 group-hover:text-primary group-open:bg-primary group-open:text-white transition-all">
                                        <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                                    </span>
                                </summary>

                                <div className="px-6 pb-6 text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                                    <p>{faq.answer}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden bg-gray-900 text-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join 50,000+ learners already advancing their careers.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/browse" className="rounded-full bg-transparent border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                            Browse All Courses
                        </Link>
                        <Link to="/register" className="rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all transform hover:-translate-y-1 hover:shadow-primary/50">
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 text-slate-600">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div>
                            <h3 className="text-primary font-bold text-2xl mb-6 flex items-center gap-2 tracking-tighter">
                                <Zap className="text-primary fill-primary" /> LearnSphere
                            </h3>
                            <p className="text-sm leading-relaxed mb-6">Empowering learners worldwide. Learn new skills, advance your career, and achieve your goals.</p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer border border-slate-200 shadow-sm"><Globe size={18} /></div>
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer border border-slate-200 shadow-sm"><MessageCircle size={18} /></div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-slate-900 font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2">How It Works</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2">Become an Instructor</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2">Success Stories</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-slate-900 font-bold mb-6">Categories</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors">Business & Management</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Technology</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Design & Creativity</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Marketing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-slate-900 font-bold mb-6">Support</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm">© 2025 LearnSphere. All rights reserved.</p>
                        <div className="flex gap-6 text-sm">
                            <span className="hover:text-primary cursor-pointer">English ▼</span>
                            <span className="hover:text-primary cursor-pointer">USD $</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
