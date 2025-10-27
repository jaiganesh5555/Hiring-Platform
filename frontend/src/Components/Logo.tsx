import logo from '../assets/logo.png';

function Logo() {
    return (
        <div className="flex items-center gap-3 cursor-pointer group">
            <img 
                src={logo} 
                alt="TalentFlow Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-400 to-black bg-clip-text text-transparent">
                    TalentFlow
                </span>
                <span className="text-sm sm:text-base font-medium text-gray-600 hidden sm:block">
                    Mini hiring platform
                </span>
            </div>
        </div>
    );
}

export default Logo;