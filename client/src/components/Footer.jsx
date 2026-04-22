const Footer = () => {
  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold text-white">
                Net<span className="text-primary-400">com</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Netcom Digital Service Center provides reliable digital services to help you stay connected and productive.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" onClick={(e) => scrollTo(e, "home")} className="text-sm hover:text-primary-400 transition-colors cursor-pointer">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => scrollTo(e, "services")} className="text-sm hover:text-primary-400 transition-colors cursor-pointer">
                  Services
                </a>
              </li>
              <li>
                <a href="#register" onClick={(e) => scrollTo(e, "register")} className="text-sm hover:text-primary-400 transition-colors cursor-pointer">
                  Register
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => scrollTo(e, "contact")} className="text-sm hover:text-primary-400 transition-colors cursor-pointer">
                  Contact
                </a>
              </li>
              <li>
                <a href="/admin" className="text-sm hover:text-primary-400 transition-colors cursor-pointer">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>net.com9882@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 8260262691</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Disclaimer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Netcom Digital Service Center. All rights reserved.
          </p>
          <p className="text-center text-xs text-red-400 mt-2 font-medium">
            We are a private service provider and not an official government website.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
