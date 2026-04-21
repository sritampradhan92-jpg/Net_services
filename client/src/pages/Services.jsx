import { Link } from "react-router-dom";

const servicesList = [
  {
    title: "Broadband Connection",
    description: "High-speed internet for your home or office with unlimited data plans. Choose from multiple speed tiers.",
    icon: "🌐",
    features: ["Up to 300 Mbps", "Unlimited Data", "Free Router"],
  },
  {
    title: "DTH Services",
    description: "Crystal clear digital TV with hundreds of channels and HD quality entertainment for your family.",
    icon: "📡",
    features: ["300+ Channels", "HD Quality", "Free Installation"],
  },
  {
    title: "Fiber Optic",
    description: "Ultra-fast fiber optic connections with speeds up to 1 Gbps for seamless streaming and gaming.",
    icon: "⚡",
    features: ["Up to 1 Gbps", "Low Latency", "Symmetric Speed"],
  },
  {
    title: "Landline Services",
    description: "Reliable landline connections with affordable calling plans for residential and business use.",
    icon: "📞",
    features: ["Free Local Calls", "STD Packs", "Caller ID"],
  },
  {
    title: "Mobile Recharge",
    description: "Quick and easy mobile recharges with exclusive offers and cashback on every transaction.",
    icon: "📱",
    features: ["Instant Recharge", "Exclusive Offers", "All Networks"],
  },
  {
    title: "Smart Home Solutions",
    description: "IoT-based smart home packages including smart cameras, sensors, and automation systems.",
    icon: "🏠",
    features: ["Smart Cameras", "Home Automation", "24/7 Monitoring"],
  },
  {
    title: "Enterprise Solutions",
    description: "Customized connectivity solutions for businesses with dedicated support and SLA guarantees.",
    icon: "🏢",
    features: ["Dedicated Line", "SLA Guarantee", "Priority Support"],
  },
  {
    title: "Cloud Storage",
    description: "Secure cloud storage plans for your data backup and sharing needs with end-to-end encryption.",
    icon: "☁️",
    features: ["Up to 2 TB", "Encrypted", "Auto Backup"],
  },
  {
    title: "VPN Services",
    description: "Premium VPN service for secure and private internet browsing on all your devices.",
    icon: "🔒",
    features: ["Unlimited Devices", "No Logs", "Global Servers"],
  },
];

const Services = () => {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of digital services designed to meet all your connectivity needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                {service.description}
              </p>
              <div className="mb-4">
                {service.features.map((feature, i) => (
                  <span
                    key={i}
                    className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <Link
                to="/register"
                className="block text-center bg-primary-600 text-white font-medium py-2.5 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
