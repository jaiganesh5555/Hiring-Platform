import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    
    
    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (isHomePage) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    
    const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <nav className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 w-full">
                    
                    <div className="flex-shrink-0 flex items-center">
                        <Logo />
                    </div>
                    
                    <div className="flex-1 flex justify-center">
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className="text-gray-700 text-2xl hover:text-black px-3 py-2 rounded-md  font-medium transition-colors duration-200 hover:bg-gray-100"
                            >
                                Home
                            </Link>
                            
                            {isHomePage && (
                                <a
                                    href="#about-section"
                                    className="text-gray-700 text-2xl hover:text-black px-3 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-gray-100"
                                    onClick={handleAboutClick}
                                >
                                    About
                                </a>
                            )}

                            <Link
                                to="/jobs"
                                className="text-gray-700 text-2xl hover:text-black px-3 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-gray-100"
                            >
                                Jobs
                            </Link>
                            <Link
                                to="/candidates"
                                className="text-gray-700 text-2xl hover:text-black px-3 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-gray-100"
                            >
                                Candidates
                            </Link>
                        </div>
                    </div>
                    
                    <div className="md:hidden ml-auto">
                        <button className="text-gray-700 hover:text-black focus:outline-none focus:text-black">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;