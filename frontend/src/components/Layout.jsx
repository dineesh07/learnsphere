import { Fragment } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, X, User, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';
import clsx from 'clsx';

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Layout() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navigation = [
        { name: 'Home', href: '/', current: location.pathname === '/' },
        { name: 'Browse', href: '/browse', current: location.pathname === '/browse' },
        ...(isAuthenticated ? [{ name: 'My Learning', href: user?.role === 'instructor' ? '/instructor/courses' : '/my-courses', current: false }] : []),
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {isAuthenticated ? (
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
                                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            {userNavigation.map((item) => (
                                                                <Menu.Item key={item.name}>
                                                                    {({ active }) => (
                                                                        <a
                                                                            href={item.href}
                                                                            className={classNames(
                                                                                active ? 'bg-gray-50' : '',
                                                                                'block px-4 py-2 text-sm text-gray-700'
                                                                            )}
                                                                        >
                                                                            {item.name}
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>
                                                            ))}
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={handleLogout}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-50' : '',
                                                                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                                                        )}
                                                                    >
                                                                        Sign out
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            ) : (
                                                <Link
                                                    to="/login"
                                                    className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5"
                                                >
                                                    Log in
                                                </Link>
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
                                    {!isAuthenticated && (
                                        <Disclosure.Button
                                            as={Link}
                                            to="/login"
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
                                        >
                                            Log in
                                        </Disclosure.Button>
                                    )}
                                </div>
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
