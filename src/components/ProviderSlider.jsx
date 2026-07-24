import {
  BriefcaseBusiness,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

const providers = [
  {
    id: 1,
    name: "Rahul Sharma",
    service: "Electrician",
    description:
      "Experienced electrician providing wiring, installation, switch repair and appliance maintenance.",
    initials: "RS",
    rating: "4.9",
    experience: "6 years",
    location: "Pune",
    price: "₹499",
    jobs: 248,
  },
  {
    id: 2,
    name: "Amit Kumar",
    service: "Plumber",
    description:
      "Professional plumber for pipeline installation, leakage repair, drainage and bathroom fittings.",
    initials: "AK",
    rating: "4.8",
    experience: "5 years",
    location: "Mumbai",
    price: "₹399",
    jobs: 193,
  },
  {
    id: 3,
    name: "Priya Singh",
    service: "Home Cleaner",
    description:
      "Professional home, kitchen, bathroom and office deep-cleaning services.",
    initials: "PS",
    rating: "4.9",
    experience: "4 years",
    location: "Noida",
    price: "₹599",
    jobs: 172,
  },
  {
    id: 4,
    name: "Vikas Verma",
    service: "AC Technician",
    description:
      "AC installation, gas filling, general servicing and emergency repair specialist.",
    initials: "VV",
    rating: "4.7",
    experience: "7 years",
    location: "Delhi",
    price: "₹699",
    jobs: 215,
  },
  {
    id: 5,
    name: "Anjali Rao",
    service: "Beauty Expert",
    description:
      "Professional beauty, makeup, hair care and grooming services at your home.",
    initials: "AR",
    rating: "4.8",
    experience: "5 years",
    location: "Pune",
    price: "₹799",
    jobs: 189,
  },
  {
    id: 6,
    name: "Sanjay Patel",
    service: "Carpenter",
    description:
      "Furniture installation, wooden fitting, repair and custom woodwork services.",
    initials: "SP",
    rating: "4.8",
    experience: "8 years",
    location: "Ahmedabad",
    price: "₹549",
    jobs: 221,
  },
  {
    id: 7,
    name: "Neha Gupta",
    service: "Interior Designer",
    description:
      "Modern, attractive and affordable interior design solutions for homes and offices.",
    initials: "NG",
    rating: "4.9",
    experience: "6 years",
    location: "Gurugram",
    price: "₹999",
    jobs: 146,
  },
  {
    id: 8,
    name: "Rohit Yadav",
    service: "Appliance Repair",
    description:
      "Fast maintenance and repair services for common household appliances.",
    initials: "RY",
    rating: "4.7",
    experience: "5 years",
    location: "Lucknow",
    price: "₹449",
    jobs: 204,
  },
];

function ProviderCard({ provider }) {
  const handleViewProfile = () => {
    alert(`You selected ${provider.name}`);
  };

  return (
    <article className="provider-list-card">
      <div className="provider-list-profile">
        <div className="provider-list-avatar">
          {provider.initials}
        </div>

        <div className="provider-list-basic">
          <span className="provider-list-service">
            {provider.service}
          </span>

          <h2>{provider.name}</h2>

          <div className="provider-list-rating">
            <Star size={16} fill="currentColor" />

            <strong>{provider.rating}</strong>

            <span>{provider.jobs} completed jobs</span>
          </div>
        </div>
      </div>

      <div className="provider-list-description">
        <p>{provider.description}</p>

        <div className="provider-list-details">
          <span>
            <ShieldCheck size={17} />
            Verified provider
          </span>

          <span>
            <BriefcaseBusiness size={17} />
            {provider.experience} experience
          </span>

          <span>
            <MapPin size={17} />
            {provider.location}
          </span>
        </div>
      </div>

      <div className="provider-list-action">
        <div className="provider-list-price">
          <span>Service starts from</span>
          <strong>{provider.price}</strong>
        </div>

        <button
          type="button"
          onClick={handleViewProfile}
        >
          View profile
        </button>
      </div>
    </article>
  );
}

function ProviderSlider() {
  return (
    <section className="provider-directory">
      <div className="provider-directory-container">
        <div className="provider-directory-heading">
          <span>TRUSTED PROFESSIONALS</span>

          <h1>Meet our verified service providers</h1>

          <p>
            Compare experienced professionals and select the
            provider who best matches your service requirements.
          </p>
        </div>

        <div className="provider-vertical-list">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProviderSlider;