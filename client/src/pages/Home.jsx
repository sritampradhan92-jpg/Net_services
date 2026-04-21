import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

const governmentServices = {
  central: [
    "Aadhaar",
    "PAN",
    "Certificate Services (Odisha)",
    "Driving & Vehicle Services",
    "Scholarship Apply",
    "Agriculture & Rural Services",
    "Health & Social Welfare",
    "Other Government & Digital Services",
  ],
  state: [],
  other: [],
};

const businessServices = [];

const aadhaarServices = [
  "New Aadhaar Enrollment",
  "Aadhaar Enrollment Status Check",
  "Aadhaar Appointment Booking",
  "Aadhaar Address Update (Online)",
  "Aadhaar PVC Card Order",
  "Aadhaar–PAN Linking",
  "Aadhaar–Bank Linking",
  "Aadhaar VID Generate",
  "Aadhaar DBT Seeding",
  "Aadhaar Bank Seeding",
];

const panServices = [
  "PAN Card Apply",
  "PAN Card Correction",
  "PAN Card Reprint",
  "e-PAN Download",
  "Income Tax Return (ITR) Filing",
  "GST Registration",
  "GST Return Filing",
  "TDS Filing",
  "Form 16 Download",
  "Tax Consultation",
];

const certificateServices = [
  "Income Certificate",
  "Caste Certificate (SC/ST/OBC)",
  "Residence Certificate",
  "Birth Certificate Apply",
  "Death Certificate Apply",
  "Marriage Certificate",
  "Character Certificate",
  "Disability Certificate",
  "EWS Certificate",
  "Legal Heir Certificate",
];

const drivingVehicleServices = [
  "Learning License Apply",
  "Driving License Apply",
  "DL Renewal",
  "DL Duplicate",
  "Vehicle Registration (RC)",
  "RC Transfer",
  "Vehicle Insurance",
  "Pollution Certificate (PUC)",
  "Driving Test Booking",
  "Vehicle Fine Payment",
];

const scholarshipServices = [
  "Scholarship Apply",
  "Exam Form Fill-up",
  "Admit Card Download",
  "Result Download",
  "College Admission Form",
  "Entrance Exam Apply",
  "DigiLocker Services",
  "Certificate Verification",
];

const agricultureRuralServices = [
  "PM-KISAN Registration",
  "KALIA Yojana Services (Odisha)",
  "Crop Insurance Apply",
  "Soil Health Card",
  "Farmer Registration",
  "Land Records (ROR Odisha)",
  "Agriculture Subsidy Apply",
  "Irrigation Scheme Apply",
];

const healthSocialWelfareServices = [
  "Ayushman Bharat Card",
  "Health Insurance Apply",
  "Old Age Pension Apply",
  "Widow Pension",
  "Disability Pension",
  "Janani Suraksha Yojana",
  "Health Card Download",
];

const otherGovDigitalServices = [
  "Passport Apply",
  "Voter ID Apply",
  "Voter ID Correction",
  "e-Shram Card Registration",
  "Labour Card Apply",
];

const serviceOptions = [
  ...governmentServices.central,
  ...governmentServices.state,
  ...governmentServices.other,
  ...businessServices,
  ...aadhaarServices,
  ...panServices,
  ...certificateServices,
  ...drivingVehicleServices,
  ...scholarshipServices,
  ...agricultureRuralServices,
  ...healthSocialWelfareServices,
  ...otherGovDigitalServices,
];

const uniqueServiceOptions = [...new Set(serviceOptions)];
const serviceIdFromTitle = (title) =>
  `service-${title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

const getServiceAcronym = (title) =>
  title
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

const aadhaarLogoUrl = "/aadhaar-logo.jpeg";
const panLogoUrl = "/pan%20logo.jpg";
const certificateServicesLogoUrl = "/service-plus-service-plus-logo-main-img.jpg";
const drivingVehicleServicesLogoUrl = "/driving%20license%20serfvices.png";
const scholarshipServicesLogoUrl = "/state%20scholarship.jpeg";
const agricultureRuralServicesLogoUrl = "/agriculture-farm-logo-vector.jpg";
const healthSocialWelfareLogoUrl = "/health.png";
const otherGovDigitalServicesLogoUrl = "/voter.png";
const whatsappNumber = "+91 8260262691";
const whatsappJoinUrl = "https://chat.whatsapp.com/B7CrPSb6YEe0nuprdoU86n?mode=gi_t";
const whatsappQrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https%3A%2F%2Fwa.me%2F918260262691";

const Home = () => {
  const heroImageCandidates = [
    "/hero-digital-services.png",
    "/hero-services.png",
    "/digital-services.png",
    "/netcom-logo.png",
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(true);
  const [regForm, setRegForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [regAlert, setRegAlert] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [contactAlert, setContactAlert] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [logoErrors, setLogoErrors] = useState({});
  const [callRequestForm, setCallRequestForm] = useState({ name: "", phone: "" });
  const [callRequestError, setCallRequestError] = useState("");
  const [callRequestSuccess, setCallRequestSuccess] = useState("");

  const [openPopup, setOpenPopup] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPopup(null);
      }
    };

    if (openPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openPopup]);

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegAlert(null);
    if (!regForm.name || !regForm.phone) {
      setRegAlert({ type: "error", message: "Please fill in all required fields." });
      return;
    }
    setRegLoading(true);
    try {
      const res = await API.post("/api/register", regForm);
      setRegAlert({ type: "success", message: res.data.message });
      setRegForm({ name: "", phone: "", email: "", service: "", message: "" });
    } catch (error) {
      setRegAlert({ type: "error", message: error.response?.data?.message || "Something went wrong." });
    } finally {
      setRegLoading(false);
    }
  };

  const visibleServices = uniqueServiceOptions.filter(
    (service) =>
      !aadhaarServices.includes(service) &&
      !panServices.includes(service) &&
      !certificateServices.includes(service) &&
      !drivingVehicleServices.includes(service) &&
      !(scholarshipServices.includes(service) && service !== "Scholarship Apply") &&
      !agricultureRuralServices.includes(service) &&
      !healthSocialWelfareServices.includes(service) &&
      !otherGovDigitalServices.includes(service)
  );

  const handleServiceCardClick = (serviceName) => {
    setRegForm((prev) => ({ ...prev, service: serviceName }));
    const registerSection = document.getElementById("register");
    if (registerSection) {
      registerSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactAlert(null);
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      setContactAlert({ type: "error", message: "Please fill in all required fields." });
      return;
    }
    setContactLoading(true);
    try {
      const res = await API.post("/api/contact", contactForm);
      setContactAlert({ type: "success", message: res.data.message });
      setContactForm({ name: "", phone: "", message: "" });
    } catch (error) {
      setContactAlert({ type: "error", message: error.response?.data?.message || "Something went wrong." });
    } finally {
      setContactLoading(false);
    }
  };

  const handleCallRequestPhoneChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setCallRequestForm((prev) => ({ ...prev, phone: onlyDigits }));
    setCallRequestError("");
    setCallRequestSuccess("");
  };

  const handleCallRequestSubmit = async (e) => {
    e.preventDefault();
    setCallRequestError("");
    setCallRequestSuccess("");

    const trimmedName = callRequestForm.name.trim();
    const trimmedPhone = callRequestForm.phone.trim();

    if (!trimmedName || !trimmedPhone) {
      setCallRequestError("Please fill in both fields.");
      return;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      setCallRequestError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      console.log("Request Call Form:", { name: trimmedName, phone: trimmedPhone });
      const res = await API.post("/api/request-call", {
        name: trimmedName,
        phone: trimmedPhone,
      });
      setCallRequestSuccess(res.data?.message || "We will call you soon!");
      setCallRequestForm({ name: "", phone: "" });
    } catch (error) {
      setCallRequestError(error.response?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  return (
    <div>
      {/* ===== HOME SECTION ===== */}
      <section id="home" className="bg-gradient-to-br from-[#f7fbff] via-[#eef5ff] to-[#e4eefc] min-h-[calc(100vh-64px)] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-[#e6ffe9] to-[#f3fff5] border border-[#9ddfb0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-8">
            <img
              src={whatsappQrUrl}
              alt="WhatsApp group QR code"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg border border-[#73c98a] bg-white p-1"
            />

            <div className="text-center sm:text-left sm:flex-1">
              <p className="text-lg sm:text-xl font-bold text-gray-900">Join our WhatsApp Support Group</p>
              <p className="text-base sm:text-lg font-semibold text-[#117a35] mt-1">{whatsappNumber}</p>
              
              <div className="mt-3 flex items-center justify-center sm:justify-start">
                <a
                  href={whatsappJoinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-[#25D366] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#20b85a] transition-colors"
                >
                  Join Now
                </a>
              </div>
            </div>

            <div className="w-full sm:w-auto sm:ml-auto text-center sm:text-right">
              <p className="text-base font-bold text-gray-900">Need Help with Any Digital Service?</p>
              <p className="text-sm text-gray-700 mt-1">Talk to our expert - We'll call you within 10 minutes.</p>
              <p className="text-sm text-gray-600 mt-1">No charges | No waiting | 100% assistance</p>
              <a
                href="#request-call"
                className="inline-block mt-3 bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors animate-bounce ring-2 ring-primary-300"
              >
                Request Call
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-900">
                Welcome to <span className="text-primary-600">Net.com</span> Digital Service Center
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
                Your one-stop destination for all digital services. Fast, reliable, and affordable connectivity solutions for everyone
                at your doorstep no need to go any where.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#services" className="inline-block bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors shadow-lg text-center">
                Explore Services
              </a>
                <a href="#register" className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg border-2 border-primary-200 hover:bg-primary-50 transition-colors text-center">
                Register
              </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-primary-100 bg-white/70 shadow-xl backdrop-blur-sm aspect-[4/3]">
                {isHeroImageLoaded ? (
                  <img
                    src={heroImageCandidates[heroImageIndex]}
                    alt="Digital services"
                    className="w-full h-full object-cover object-center"
                    onError={() => {
                      if (heroImageIndex < heroImageCandidates.length - 1) {
                        setHeroImageIndex((prev) => prev + 1);
                        return;
                      }
                      setIsHeroImageLoaded(false);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-6 text-center">
                    <p className="text-primary-700 font-semibold">Hero image could not be loaded.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Our <span className="text-[#ff7f59]">Services</span>
            </h2>
          </div>

          <div className="bg-[#f2dfbf] border border-[#ff8b69] rounded-xl p-5 md:p-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
              {visibleServices.map((serviceName) => (
                <div 
                  key={serviceName} 
                  className="relative"
                  onMouseEnter={() => {
                    if (
                      serviceName === "Aadhaar" ||
                      serviceName === "PAN" ||
                      serviceName === "Certificate Services (Odisha)" ||
                      serviceName === "Driving & Vehicle Services" ||
                      serviceName === "Scholarship Apply" ||
                      serviceName === "Agriculture & Rural Services" ||
                      serviceName === "Health & Social Welfare" ||
                      serviceName === "Other Government & Digital Services"
                    ) {
                      setOpenPopup(serviceName);
                    }
                  }}
                  onMouseLeave={() => {
                    if (
                      serviceName === "Aadhaar" ||
                      serviceName === "PAN" ||
                      serviceName === "Certificate Services (Odisha)" ||
                      serviceName === "Driving & Vehicle Services" ||
                      serviceName === "Scholarship Apply" ||
                      serviceName === "Agriculture & Rural Services" ||
                      serviceName === "Health & Social Welfare" ||
                      serviceName === "Other Government & Digital Services"
                    ) {
                      setOpenPopup(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    id={serviceIdFromTitle(serviceName)}
                    onClick={() => {
                      if (
                        serviceName === "Aadhaar" ||
                        serviceName === "PAN" ||
                        serviceName === "Certificate Services (Odisha)" ||
                        serviceName === "Driving & Vehicle Services" ||
                        serviceName === "Scholarship Apply" ||
                        serviceName === "Agriculture & Rural Services" ||
                        serviceName === "Health & Social Welfare" ||
                        serviceName === "Other Government & Digital Services"
                      ) {
                        setOpenPopup(openPopup === serviceName ? null : serviceName);
                      } else {
                        handleServiceCardClick(serviceName);
                      }
                    }}
                    className="scroll-mt-24 bg-[#f9fbff] border border-[#b6c4d5] rounded-xl shadow-[0_3px_8px_rgba(0,0,0,0.14)] p-4 min-h-[170px] flex flex-col items-center justify-center text-center hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.16)] transition-all w-full"
                  >
                    <div className="w-16 h-16 rounded-xl border border-[#8ea4be] bg-white flex items-center justify-center text-primary-700 font-bold text-lg mb-4">
                      {(serviceName === "Aadhaar" || serviceName === "PAN" || serviceName === "Certificate Services (Odisha)" || serviceName === "Driving & Vehicle Services" || serviceName === "Scholarship Apply" || serviceName === "Agriculture & Rural Services" || serviceName === "Health & Social Welfare" || serviceName === "Other Government & Digital Services") && !logoErrors[serviceName] ? (
                        <img
                          src={
                            serviceName === "Aadhaar"
                              ? aadhaarLogoUrl
                              : serviceName === "PAN"
                              ? panLogoUrl
                              : serviceName === "Certificate Services (Odisha)"
                              ? certificateServicesLogoUrl
                              : serviceName === "Scholarship Apply"
                              ? scholarshipServicesLogoUrl
                              : serviceName === "Agriculture & Rural Services"
                              ? agricultureRuralServicesLogoUrl
                              : serviceName === "Health & Social Welfare"
                              ? healthSocialWelfareLogoUrl
                                : serviceName === "Other Government & Digital Services"
                                ? otherGovDigitalServicesLogoUrl
                              : drivingVehicleServicesLogoUrl
                          }
                          alt={`${serviceName} logo`}
                          className="w-12 h-12 object-contain"
                          onError={() => setLogoErrors((prev) => ({ ...prev, [serviceName]: true }))}
                        />
                      ) : (
                        getServiceAcronym(serviceName)
                      )}
                    </div>
                    <h3 className="text-2xl leading-snug font-semibold text-gray-900">{serviceName}</h3>
                  </button>

                  {/* Aadhaar Popup */}
                  {serviceName === "Aadhaar" && openPopup === "Aadhaar" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Aadhaar Services</h4>
                        <ul className="space-y-2">
                          {aadhaarServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* PAN Popup */}
                  {serviceName === "PAN" && openPopup === "PAN" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">PAN Services</h4>
                        <ul className="space-y-2">
                          {panServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Certificate Services (Odisha) Popup */}
                  {serviceName === "Certificate Services (Odisha)" && openPopup === "Certificate Services (Odisha)" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Certificate Services (Odisha)</h4>
                        <ul className="space-y-2">
                          {certificateServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Driving & Vehicle Services Popup */}
                  {serviceName === "Driving & Vehicle Services" && openPopup === "Driving & Vehicle Services" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Driving & Vehicle Services</h4>
                        <ul className="space-y-2">
                          {drivingVehicleServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Scholarship Apply Popup */}
                  {serviceName === "Scholarship Apply" && openPopup === "Scholarship Apply" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Scholarship Apply Services</h4>
                        <ul className="space-y-2">
                          {scholarshipServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Agriculture & Rural Services Popup */}
                  {serviceName === "Agriculture & Rural Services" && openPopup === "Agriculture & Rural Services" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Agriculture & Rural Services</h4>
                        <ul className="space-y-2">
                          {agricultureRuralServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Health & Social Welfare Popup */}
                  {serviceName === "Health & Social Welfare" && openPopup === "Health & Social Welfare" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Health & Social Welfare</h4>
                        <ul className="space-y-2">
                          {healthSocialWelfareServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Other Government & Digital Services Popup */}
                  {serviceName === "Other Government & Digital Services" && openPopup === "Other Government & Digital Services" && (
                    <div
                      ref={popupRef}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-72 md:w-80"
                    >
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Other Government & Digital Services</h4>
                        <ul className="space-y-2">
                          {otherGovDigitalServices.map((service) => (
                            <li key={service}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleServiceCardClick(service);
                                  setOpenPopup(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                              >
                                → {service}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-700">
              Click any service card to auto-select it in the registration form. Click on Aadhaar, PAN, Certificate Services (Odisha), Driving & Vehicle Services, Scholarship Apply, Agriculture & Rural Services, Health & Social Welfare, or Other Government & Digital Services to see available services.
            </div>
          </div>
        </div>
      </section>

      {/* ===== REQUEST CALL SECTION ===== */}
      <section id="request-call" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Request Call</h2>
            <p className="text-gray-600">Share your details and our team will call you soon.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleCallRequestSubmit} className="space-y-5">
              <div>
                <label htmlFor="call-name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="call-name"
                  name="name"
                  value={callRequestForm.name}
                  onChange={(e) => {
                    setCallRequestForm((prev) => ({ ...prev, name: e.target.value }));
                    setCallRequestError("");
                    setCallRequestSuccess("");
                  }}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="call-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  id="call-phone"
                  name="phone"
                  value={callRequestForm.phone}
                  onChange={handleCallRequestPhoneChange}
                  placeholder="Enter 10-digit phone number"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  required
                />
              </div>

              {callRequestError && <p className="text-sm text-red-600">{callRequestError}</p>}
              {callRequestSuccess && <p className="text-sm text-green-600">{callRequestSuccess}</p>}

              <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== REGISTER SECTION ===== */}
      <section id="register" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Service Registration</h2>
            <p className="text-gray-600">Fill in the form below to register for our services. We will get back to you shortly.</p>
          </div>
          <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            {regAlert && <Alert type={regAlert.type} message={regAlert.message} onClose={() => setRegAlert(null)} />}
            <form onSubmit={handleRegSubmit} className="space-y-5">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" id="reg-name" name="name" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} placeholder="Enter your full name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" required />
              </div>
              <div>
                <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" id="reg-phone" name="phone" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} placeholder="Enter your phone number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" required />
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400">(optional)</span></label>
                <input type="email" id="reg-email" name="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} placeholder="Enter your email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" />
              </div>
              <button type="submit" disabled={regLoading} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {regLoading ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">Have a question or need help? Send us a message and we will get back to you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div><h3 className="font-semibold text-gray-900">Address</h3><p className="text-sm text-gray-500 mt-1">123 Digital Street, Tech City, India</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div><h3 className="font-semibold text-gray-900">Phone</h3><p className="text-sm text-gray-500 mt-1">+91 98765 43210</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div><h3 className="font-semibold text-gray-900">Email</h3><p className="text-sm text-gray-500 mt-1">support@netcom.com</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div><h3 className="font-semibold text-gray-900">Working Hours</h3><p className="text-sm text-gray-500 mt-1">Mon–Sat: 9 AM – 7 PM</p></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              {contactAlert && <Alert type={contactAlert.type} message={contactAlert.message} onClose={() => setContactAlert(null)} />}
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" id="contact-name" name="name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Enter your name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" required />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" id="contact-phone" name="phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="Enter your phone number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" required />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                  <textarea id="contact-message" name="message" rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Write your message..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none" required />
                </div>
                <button type="submit" disabled={contactLoading} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {contactLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
