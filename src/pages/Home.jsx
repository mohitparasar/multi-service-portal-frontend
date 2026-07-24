import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-content">
          <p className="home-label">
            MULTI-SERVICE PROVIDER
          </p>

          <h1>
            Safe and reliable
            <span> home services</span>
          </h1>

          <h2>Going the extra mile for you</h2>

          <p className="home-description">
            Find verified electricians, plumbers, cleaners,
            carpenters and repair professionals near you. MSP
            connects customers with trusted professionals for fast
            and reliable services.
          </p>

          <div className="home-buttons">
            <Link
              to="/register"
              className="primary-link"
            >
              Get started
            </Link>

            <Link
              to="/services"
              className="secondary-link"
            >
              Explore services
            </Link>
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

      <section className="about-section" id="about">
        <div>
          <span>WHY CHOOSE MSP?</span>

          <h2>
            A simple and trusted service experience
          </h2>

          <p>
            We make it easier to discover, compare and contact
            verified professionals according to your requirements.
          </p>
        </div>

        <Link
          to="/register"
          className="primary-link"
        >
          Create an account
        </Link>
      </section>
    </main>
  );
}

export default Home;