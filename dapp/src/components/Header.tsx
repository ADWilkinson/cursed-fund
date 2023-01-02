import logo from "assets/skull-white.png";
import { Link } from "react-router-dom";
import ConnectButton from "./header/ConnectButton";

const Header = () => {
  return (
    <header className="bg-theme-pan-navy ">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  " aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between border-b  lg:border-none">
          <div className="flex items-center">
            <Link to="/">
              <span className="sr-only">Galleon</span>
              <img
                className="hidden md:block md:h-8 md:w-auto"
                src={logo}
                alt="logo"
              />
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">    
            </div>
          </div>
          <div className="md:ml-10 space-x-4">
            <ConnectButton />
          </div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
        </div>
      </nav>
    </header>
  );
};

export default Header;
