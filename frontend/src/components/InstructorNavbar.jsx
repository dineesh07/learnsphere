import { Fragment, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, X, User, Sparkles, BookOpen, Settings, LogOut, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';
import courseService from '../services/courseService';
import clsx from 'clsx';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function InstructorNavbar() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [publishedCourses, setPublishedCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Fetch instructor's published courses for navbar dropdown
    useEffect(() => {
        const fetchPublishedCourses = async () => {
            if (user?.role === 'instructor' || user?.role === 'admin') {
                setCoursesLoading(true);
                try {
                    const response = await courseService.getInstructorPublishedCourses();
                    console.log('Published courses fetched:', response.data);
                    setPublishedCourses(response.data || []);
                } catch (error) {
                    console.error('Failed to fetch published courses:', error);
                    console.error('Error details:', error.response?.data || error.message);
                    setPublishedCourses([]);
                } finally {
                    setCoursesLoading(false);
                }
            }
        };

        fetchPublishedCourses();
    }, [user]);

    const navigation = [
        { name: 'Dashboard', href: '/instructor/courses', current: location.pathname === '/instructor/courses' },
        { name: 'Create Course', href: '/instructor/courses/new', current: location.pathname === '/instructor/courses/new' },
        { name: 'Reports', href: '/instructor/reporting', current: location.pathname === '/instructor/reporting' },
    ];

    return (
        <>
            <div className="min-h-full bg-background text-text font-sans">
                <Disclosure as="nav" className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Link to="/" className="text-primary font-bold text-2xl tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
                                                <Sparkles className="w-6 h-6 text-secondary" />
                                                LearnSphere
                                            </Link>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'text-gray-600 hover:bg-gray-100 hover:text-primary',
                                                            'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200'
                                                        )}
                                                        aria-current={item.current ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}

                                                {/* Courses Dropdown */}
                                                <Menu as="div" className="relative">
                                                    <Menu.Button
                                                        className={classNames(
                                                            'text-gray-600 hover:bg-gray-100 hover:text-primary',
                                                            'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1'
                                                        )}
                                                    >
                                                        Courses
                                                        <ChevronDown className="w-4 h-4" />
                                                    </Menu.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            {coursesLoading ? (
                                                                <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
                                                            ) : publishedCourses.length > 0 ? (
                                                                <>
                                                                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                                        Published Courses
                                                                    </div>
                                                                    {publishedCourses.map((course) => (
                                                                        <Menu.Item key={course._id}>
                                                                            {({ active }) => (
                                                                                <Link
                                                                                    to={`/instructor/courses/${course._id}/edit`}
                                                                                    className={classNames(
                                                                                        active ? 'bg-gray-50' : '',
                                                                                        'block px-4 py-2 text-sm text-gray-700 hover:text-primary'
                                                                                    )}
                                                                                >
                                                                                    <div className="flex items-center gap-2">
                                                                                        <BookOpen className="w-4 h-4" />
                                                                                        <span className="truncate">{course.title}</span>
                                                                                    </div>
                                                                                </Link>
                                                                            )}
                                                                        </Menu.Item>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <div className="px-4 py-3 text-sm text-gray-500">
                                                                    No published courses yet
                                                                </div>
                                                            )}
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {isAuthenticated && (
                                                <Menu as="div" className="relative ml-3">
                                                    <div>
                                                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-105 shadow-sm border border-gray-200">
                                                            <span className="absolute -inset-1.5" />
                                                            <span className="sr-only">Open user menu</span>
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                                                            </div>
                                                        </Menu.Button>
                                                    </div>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            {/* User Info Header */}
                                                            <div className="px-4 py-3 border-b border-gray-200">
                                                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                                                                <p className="text-xs text-primary font-semibold mt-2">
                                                                    {publishedCourses.length} Published Course{publishedCourses.length !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>

                                                            {/* Menu Items */}
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <a
                                                                        href="#"
                                                                        className={classNames(
                                                                            active ? 'bg-gray-50' : '',
                                                                            'flex items-center gap-2 px-4 py-2 text-sm text-gray-700'
                                                                        )}
                                                                    >
                                                                        <Settings className="w-4 h-4" />
                                                                        Edit Profile
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={handleLogout}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-50' : '',
                                                                            'flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700'
                                                                        )}
                                                                    >
                                                                        <LogOut className="w-4 h-4" />
                                                                        Logout
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile menu button */}
                                    <div className="-mr-2 flex md:hidden">
                                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <X className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden bg-white border-t border-gray-200">
                                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as={Link}
                                            to={item.href}
                                            className={classNames(
                                                item.current ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary',
                                                'block rounded-md px-3 py-2 text-base font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}

                                    {/* Mobile Courses */}
                                    {publishedCourses.length > 0 && (
                                        <>
                                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Published Courses
                                            </div>
                                            {publishedCourses.map((course) => (
                                                <Disclosure.Button
                                                    key={course._id}
                                                    as={Link}
                                                    to={`/instructor/courses/${course._id}/edit`}
                                                    className="text-gray-600 hover:bg-gray-50 hover:text-primary block rounded-md px-3 py-2 text-sm font-medium"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4" />
                                                        {course.title}
                                                    </div>
                                                </Disclosure.Button>
                                            ))}
                                        </>
                                    )}
                                </div>

                                {/* Mobile User Menu */}
                                {isAuthenticated && (
                                    <div className="border-t border-gray-200 pb-3 pt-4">
                                        <div className="flex items-center px-5">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                                <div className="text-xs text-primary font-semibold mt-1">
                                                    {publishedCourses.length} Published Course{publishedCourses.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 space-y-1 px-2">
                                            <Disclosure.Button
                                                as="a"
                                                href="#"
                                                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Edit Profile
                                            </Disclosure.Button>
                                            <Disclosure.Button
                                                as="button"
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                )}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                <main>
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
}
