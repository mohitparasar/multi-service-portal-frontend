import { useEffect, useRef, useState } from "react";

const firstRowProviders = [
  {
    id: 1,
    name: "Rahul Sharma",
    service: "Electrician",
    description: "Electrical installation and repair specialist.",
    initials: "RS",
    rating: "4.9",
  },
  {
    id: 2,
    name: "Amit Kumar",
    service: "Plumber",
    description: "Pipeline, leakage and complete plumbing solutions.",
    initials: "AK",
    rating: "4.8",
  },
  {
    id: 3,
    name: "Priya Singh",
    service: "Home Cleaner",
    description: "Professional home and office deep cleaning.",
    initials: "PS",
    rating: "4.9",
  },
  {
    id: 4,
    name: "Vikas Verma",
    service: "AC Technician",
    description: "AC installation, maintenance and repair.",
    initials: "VV",
    rating: "4.7",
  },
];

const secondRowProviders = [
  {
    id: 5,
    name: "Anjali Rao",
    service: "Beauty Expert",
    description: "Professional beauty services at your home.",
    initials: "AR",
    rating: "4.8",
  },
  {
    id: 6,
    name: "Sanjay Patel",
    service: "Carpenter",
    description: "Furniture repair and custom woodwork.",
    initials: "SP",
    rating: "4.8",
  },
  {
    id: 7,
    name: "Neha Gupta",
    service: "Interior Designer",
    description: "Modern and affordable interior solutions.",
    initials: "NG",
    rating: "4.9",
  },
  {
    id: 8,
    name: "Rohit Yadav",
    service: "Appliance Repair",
    description: "Fast repair for common household appliances.",
    initials: "RY",
    rating: "4.7",
  },
];

function ProviderCard({ provider }) {
  return (
    <article className="msp-profile-card">
      <div className="msp-profile-information">
        <span className="msp-profile-service">
          {provider.service}
        </span>

        <h3>{provider.name}</h3>

        <p>{provider.description}</p>

        <div className="msp-profile-meta">
          <span>★ {provider.rating}</span>
          <span>✓ Verified</span>
        </div>
      </div>

      <div className="msp-profile-avatar">
        {provider.initials}
      </div>
    </article>
  );
}

function SliderRow({ providers, secondRow = false }) {
  const repeatedProviders = [...providers, ...providers];

  return (
    <div
      className={`msp-profile-track ${
        secondRow ? "msp-second-track" : ""
      }`}
    >
      {repeatedProviders.map((provider, index) => (
        <ProviderCard
          key={`${provider.id}-${index}`}
          provider={provider}
        />
      ))}
    </div>
  );
}

function ProviderSlider() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="providers"
      className={`msp-providers ${
        visible ? "msp-providers-visible" : ""
      }`}
    >
      <div className="msp-providers-heading">
        <span>TRUSTED PROFESSIONALS</span>

        <h2>Find the right expert for every service</h2>

        <p>
          Explore experienced and verified professionals available near you.
        </p>
      </div>

      <div className="msp-profile-slider">
        <SliderRow providers={firstRowProviders} />

        <SliderRow
          providers={secondRowProviders}
          secondRow={true}
        />
      </div>
    </section>
  );
}

export default ProviderSlider;