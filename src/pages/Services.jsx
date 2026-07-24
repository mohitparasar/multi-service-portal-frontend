import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    icon: "⚡",
    title: "Electrical Services",
    description:
      "Wiring, switch repair, installation and electrical maintenance.",
  },
  {
    id: 2,
    icon: "🔧",
    title: "Plumbing Services",
    description:
      "Leakage repair, pipe fitting and complete plumbing solutions.",
  },
  {
    id: 3,
    icon: "✦",
    title: "Home Cleaning",
    description:
      "Professional deep cleaning services for homes and offices.",
  },
  {
    id: 4,
    icon: "❄",
    title: "AC Repair",
    description:
      "AC installation, regular servicing and emergency repair.",
  },
  {
    id: 5,
    icon: "🪚",
    title: "Carpentry",
    description:
      "Furniture repair, fitting and custom woodwork by skilled carpenters.",
  },
  {
    id: 6,
    icon: "🎨",
    title: "Painting",
    description:
      "Interior and exterior painting for homes, offices and shops.",
  },
];

function Services() {
  return (
    <main className="services-page">
      <section className="services-section services-page-section">
        <div className="section-heading">
          <span>WHAT WE OFFER</span>

          <h1>Everything your home needs</h1>

          <p>
            Choose a service and connect with a reliable
            professional near you.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article
              className="service-card"
              key={service.id}
            >
              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <Link to="/providers">
                Find a professional →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;