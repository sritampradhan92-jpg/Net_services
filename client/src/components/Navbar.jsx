import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [serviceQuery, setServiceQuery] = useState("");
  const [searchHint, setSearchHint] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const servicesCloseTimerRef = useRef(null);
  const [isLogoLoaded, setIsLogoLoaded] = useState(true);

  const servicesMenuItems = [
    { name: "Aadhaar", href: "#services" },
    { name: "Ayushman", href: "#services" },
    { name: "Jeevan Pramaan", href: "#services" },
    { name: "LPG Services", href: "#services" },
    { name: "NPS", href: "#services" },
    { name: "PAN", href: "#services" },
    { name: "Passport", href: "#services" },
    { name: "e-Shram", href: "#services" },
    { name: "PM-KISAN", href: "#services" },
    { name: "PM-SVANidhi", href: "#services" },
    { name: "Udyam Services", href: "#services" },
    { name: "Broadband Connection", href: "#services" },
    { name: "DTH Services", href: "#services" },
    { name: "Fiber Optic", href: "#services" },
    { name: "Enterprise Solutions", href: "#services" },
  ];

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Register", href: "#register" },
    { name: "Contact", href: "#contact" },
  ];

  const normalizeText = (value) => value.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

  // Track which section is in view
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = ["home", "services", "register", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (servicesCloseTimerRef.current) {
        clearTimeout(servicesCloseTimerRef.current);
      }
    };
  }, []);

  const openServicesMenu = () => {
    if (servicesCloseTimerRef.current) {
      clearTimeout(servicesCloseTimerRef.current);
      servicesCloseTimerRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const closeServicesMenu = () => {
    if (servicesCloseTimerRef.current) {
      clearTimeout(servicesCloseTimerRef.current);
    }
    servicesCloseTimerRef.current = setTimeout(() => {
      setIsServicesOpen(false);
      servicesCloseTimerRef.current = null;
    }, 180);
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);

    // If on admin page, navigate home first
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleServiceSearch = (e) => {
    e.preventDefault();

    const query = normalizeText(serviceQuery);
    if (!query) return;

    const exactMatch = servicesMenuItems.find((item) => normalizeText(item.name) === query);
    const partialMatch = servicesMenuItems.find((item) => normalizeText(item.name).includes(query));
    const selectedTarget = exactMatch?.href || partialMatch?.href || "#services";

    setSearchHint(exactMatch || partialMatch ? "" : "No exact match. Showing all services.");
    setIsOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(selectedTarget);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return;
    }

    const el = document.querySelector(selectedTarget);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isLandingPage = location.pathname === "/";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="flex items-center space-x-3"
            >
              {isLogoLoaded ? (
                <img
                  src="/netcom-logo.png"
                  alt="Net.com Logo"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  onError={() => setIsLogoLoaded(false)}
                />
              ) : (
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
              )}
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Net<span className="text-primary-600">.com</span>
              </span>
            </a>

            <form onSubmit={handleServiceSearch} className="hidden md:block w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  list="service-search-options"
                  value={serviceQuery}
                  onChange={(e) => {
                    setServiceQuery(e.target.value);
                    if (searchHint) setSearchHint("");
                  }}
                  placeholder="Search services..."
                  className="w-full h-11 rounded-full border border-gray-300 bg-white px-4 pr-12 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors flex items-center justify-center"
                  aria-label="Search services"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              {searchHint && <p className="mt-1 text-xs text-primary-700">{searchHint}</p>}
              <datalist id="service-search-options">
                {servicesMenuItems.map((service) => (
                  <option key={service.href} value={service.name} />
                ))}
              </datalist>
            </form>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center h-14">
            {navLinks.map((link) =>
              link.name === "Services" ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={closeServicesMenu}
                >
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, link.href)}
                    onFocus={openServicesMenu}
                    className={`px-5 py-3 text-base font-medium transition-colors inline-flex items-center gap-1 ${
                      isLandingPage && activeSection === link.href.slice(1)
                        ? "text-white bg-primary-700"
                        : "text-primary-50 hover:text-white hover:bg-primary-800"
                    }`}
                  >
                    {link.name}
                    <svg
                      className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isServicesOpen && (
                    <div
                      className="absolute left-1/2 top-full -translate-x-1/2 pt-2 w-[42rem] max-w-[90vw]"
                      onMouseEnter={openServicesMenu}
                      onMouseLeave={closeServicesMenu}
                    >
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-5">
                        <div className="grid grid-cols-2 gap-2">
                          {servicesMenuItems.map((service) => (
                            <a
                              key={service.href}
                              href={service.href}
                              onClick={(e) => handleNavClick(e, service.href)}
                              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            >
                              {service.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-5 py-3 text-base font-medium transition-colors ${
                    isLandingPage && activeSection === link.href.slice(1)
                      ? "text-white bg-primary-700"
                      : "text-primary-50 hover:text-white hover:bg-primary-800"
                  }`}
                >
                  {link.name}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3">
            <form onSubmit={handleServiceSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  list="service-search-options"
                  value={serviceQuery}
                  onChange={(e) => {
                    setServiceQuery(e.target.value);
                    if (searchHint) setSearchHint("");
                  }}
                  placeholder="Search services..."
                  className="w-full h-10 rounded-full border border-gray-300 bg-white px-4 pr-11 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-7 w-7 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors flex items-center justify-center"
                  aria-label="Search services"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              {searchHint && <p className="mt-1 text-xs text-primary-700">{searchHint}</p>}
              <datalist id="service-search-options">
                {servicesMenuItems.map((service) => (
                  <option key={service.href} value={service.name} />
                ))}
              </datalist>
            </form>

            {navLinks.map((link) =>
              link.name === "Services" ? (
                <div key={link.href} className="rounded-lg">
                  <button
                    type="button"
                    onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isLandingPage && activeSection === link.href.slice(1)
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                    }`}
                  >
                    <span>Services</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isMobileServicesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMobileServicesOpen && (
                    <div className="mt-2 ml-4 space-y-1 border-l-2 border-primary-100 pl-3">
                      {servicesMenuItems.map((service) => (
                        <a
                          key={service.href}
                          href={service.href}
                          onClick={(e) => handleNavClick(e, service.href)}
                          className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          {service.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLandingPage && activeSection === link.href.slice(1)
                      ? "bg-primary-600 text-white"
                      : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                  }`}
                >
                  {link.name}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
