import Tilt from 'react-parallax-tilt';
import { Link } from 'react-router-dom';

const Home = () => {

    return (
            <div className="bg-white">
                
                <div className="space-y-24">
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center lg:text-left max-w-2xl">
                            <div className="space-y-6">
                                <h1 className="text-6xl lg:text-7xl font-bold tracking-tight">
                                    <span className="block bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent">
                                        LOT OF JOB
                                    </span>
                                    <span className="block bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent mt-2">
                                        OPPORTUNITIES
                                    </span>
                                </h1>
                                <p className="text-5xl font-medium bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent">
                                    AT YOUR FINGERTIPS
                                </p>
                                <p className="text-xl text-gray-600 mt-6">
                                    Find your dream job, apply, and get hired with TalentFlow!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                                    <Link to="/jobs" className="px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg hover:from-black hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-center">
                                        Find Jobs
                                    </Link>
                                    
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 max-w-xl">
                            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.1} transitionSpeed={2000}>
                                <div className="bg-gradient-to-r from-gray-200 to-gray-100 p-6 rounded-2xl shadow-xl">
                                    <img 
                                        src="/assets/cor.png" 
                                        alt="Career Opportunities" 
                                        className="w-full h-auto object-contain rounded-lg"
                                    />
                                </div>
                            </Tilt>
                        </div>
                    </div>
                </div>
            </div>

            

           

            
            
            <div id="about-section" className="bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 py-20">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                        <span className="bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent">About TalentFlow</span>
                    </h2>
                    <p className="text-center text-gray-600 mb-12 text-lg max-w-3xl mx-auto">
                        We're on a mission to revolutionize the job market by connecting talented professionals with their dream opportunities.
                    </p>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                            <p>
                                Founded in 2020, TalentFlow was born from a simple observation: the job market was inefficient, frustrating, and didn't serve either job seekers or employers well.
                            </p>
                            <p>
                                Our team of experienced HR professionals and tech entrepreneurs came together to build a platform that would change that. We wanted to create a space where talent could flourish and opportunities could be discovered effortlessly.
                            </p>
                            <p>
                                Today, we're proud to be one of the fastest-growing job platforms in the region, having helped over 50,000 professionals land their dream jobs while connecting thousands of companies with top talent.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center">
                <div className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center">
                        <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent mb-12">
                            <span className="bg-gradient-to-r from-gray-400 via-gray-900 to-black bg-clip-text text-transparent">Our Core Values</span>
                        </h3>
                        <div className="max-w-xl w-full flex justify-center">
                            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.1} transitionSpeed={2000}>
                                <div className="bg-gradient-to-r from-gray-200 to-gray-100 p-6 rounded-2xl shadow-xl">
                                    <img 
                                        src="/assets/pipeline.png" 
                                        alt="Pipeline" 
                                        className="w-full h-auto object-contain rounded-lg"
                                    />
                                </div>
                            </Tilt>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen bg-white flex items-center">
                <div className="container mx-auto px-4 py-20">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-white via-gray-900 to-black bg-clip-text text-transparent">
                        <span className="bg-gradient-to-r from-gray-400 via-gray-700 to-black bg-clip-text text-transparent">Platform Features</span>
                    </h2>
                    <p className="text-center text-gray-600 mb-12 text-lg max-w-3xl mx-auto">
                        Everything you need to streamline your hiring process and find top talent.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                            <div className="text-4xl mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Jobs Management</h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Pagination & filtering</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Drag-and-drop reordering</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Archive/unarchive jobs</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Deep linking support</span>
                                </li>
                            </ul>
                        </div>

                        
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                            <div className="text-4xl mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Candidates</h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Virtualized list (1000+)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Kanban pipeline view</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Status timeline</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Notes with @mentions</span>
                                </li>
                            </ul>
                        </div>

                        
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                            <div className="text-4xl mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Assessments</h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Custom question builder</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Live preview</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Form validation</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-800 mr-2">•</span>
                                    <span>Conditional questions</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            </div>
        </div>
    );
};

export default Home;