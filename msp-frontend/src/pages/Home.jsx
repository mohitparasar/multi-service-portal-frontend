import { Link } from "react-router-dom";
import ProviderSlider from "../components/ProviderSlider";

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
];

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-content">
          <p className="home-label">MULTI-SERVICE PROVIDER</p>

          <h1>
            Safe and reliable
            <span> home services</span>
          </h1>

          <h2>Going the extra mile for you</h2>

          <p className="home-description">
            Find verified electricians, plumbers, cleaners, carpenters and
            repair professionals near you. MSP connects customers with trusted
            professionals for fast and reliable services.
          </p>

          <div className="home-buttons">
            <Link to="/register" className="primary-link">
              Get started
            </Link>

            <a href="#services" className="secondary-link">
              Explore services
            </a>
          </div>

          <div className="home-statistics">
            <div>
              <strong>500+</strong>
              <span>Professionals</span>
            </div>

            <div>
              <strong>1,200+</strong>
              <span>Completed services</span>
            </div>

            <div>
              <strong>4.8</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <span>WHAT WE OFFER</span>

          <h2>Everything your home needs</h2>

          <p>
            Book reliable professionals for everyday home maintenance and
            emergency requirements.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <div className="service-icon">{service.icon}</div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <a href="#providers">Find a professional →</a>
            </article>
          ))}
        </div>
      </section>

      <ProviderSlider />

      <section className="about-section" id="about">
        <div>
          <span>WHY CHOOSE MSP?</span>

          <h2>A simple and trusted service experience</h2>

          <p>
            We make it easier to discover, compare and contact verified
            professionals according to your requirements.
          </p>
        </div>

        <Link to="/register" className="primary-link">
          Create an account
        </Link>
      </section>
    </main>
  );
}

export default Home;