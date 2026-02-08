import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="relative isolate overflow-hidden bg-background pb-16 pt-14 sm:pb-20">
            {/* Background Image with Light Overlay */}
            <div className="absolute inset-0 -z-20">
                <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Background"
                    className="h-full w-full object-cover opacity-[0.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            </div>

            {/* Gradient Blobs */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary/30 to-primary/30 opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-20">
                <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56 text-center">
                    <div className="mb-8 flex justify-center animate-fade-in-up">
                        <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 transition-all cursor-default bg-white/50 backdrop-blur-md flex items-center gap-2 shadow-sm animate-float">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-primary font-bold">New</span>
                            <span className="font-medium">Interactive courses available</span>
                        </div>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl leading-tight mb-8 drop-shadow-sm">
                        Unlock Your Potential with <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-secondary animate-gradient-x">Expert-Led</span> Online Courses
                    </h1>

                    <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto font-light">
                        Learn new skills, advance your career, and achieve your goals with immersive, interactive courses designed by industry professionals.
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-x-6">
                        <Link
                            to="/browse"
                            className="group rounded-full bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-md hover:shadow-xl hover:bg-gray-50 transition-all duration-300 ease-out transform hover:-translate-y-1 flex items-center gap-2 border border-gray-100"
                        >
                            <Play fill="currentColor" size={16} className="text-gray-900" /> Browse Courses
                        </Link>
                        <Link
                            to="/register"
                            className="group rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-indigo-600 border border-transparent transition-all duration-300 ease-out transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500 border-t border-gray-200 pt-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="text-primary w-5 h-5" />
                            <span>500+ Premium Courses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="text-primary w-5 h-5" />
                            <span>10,000+ Active Learners</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="text-primary w-5 h-5" />
                            <span>Lifetime Access</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
        </div>
    );
};

export default HeroSection;
