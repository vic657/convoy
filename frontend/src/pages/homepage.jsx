import React from 'react'

function Homepage() {
  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <h1>Convoy of Hope</h1>
          <p>Connecting donors, staff, and beneficiaries to deliver hope efficiently.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#donate">
              <i className="fi fi-rr-donate"></i>
              Donate Now
            </a>
            <a className="btn btn-secondary" href="#volunteer">
              <i className="fi fi-rr-users"></i>
              Volunteer
            </a>
          </div>
        </div>
      </header>

      <section className="quick-stats" aria-label="Impact stats">
        <div className="stat">
          <i className="fi fi-sr-box"></i>
          <div>
            <h3>12,450+</h3>
            <p>Food Boxes Delivered</p>
          </div>
        </div>
        <div className="stat">
          <i className="fi fi-sr-donate"></i>
          <div>
            <h3>$820k</h3>
            <p>Funds Raised</p>
          </div>
        </div>
        <div className="stat">
          <i className="fi fi-sr-users"></i>
          <div>
            <h3>2,300+</h3>
            <p>Active Volunteers</p>
          </div>
        </div>
        <div className="stat">
          <i className="fi fi-sr-people-carry-box"></i>
          <div>
            <h3>35</h3>
            <p>Communities Served</p>
          </div>
        </div>
      </section>

      <section className="features" aria-label="Platform features">
        <article className="card">
          <i className="fi fi-rr-hand-holding-heart icon"></i>
          <h3>Track Donations</h3>
          <p>Monitor food, funds, and non-food items with real-time transparency.</p>
        </article>
        <article className="card">
          <i className="fi fi-rr-id-badge icon"></i>
          <h3>Manage Volunteers</h3>
          <p>Onboard, schedule, and coordinate staff and volunteers seamlessly.</p>
        </article>
        <article className="card">
          <i className="fi fi-rr-truck-loading icon"></i>
          <h3>Distribution Oversight</h3>
          <p>Track deliveries to families and individuals to ensure fairness.</p>
        </article>
        <article className="card">
          <i className="fi fi-rr-chart-histogram icon"></i>
          <h3>Accountable Reports</h3>
          <p>Generate exportable reports for audits, partners, and donors.</p>
        </article>
      </section>

      <section className="cta-band" id="donate">
        <div className="cta-content">
          <h2>Your generosity fuels the mission</h2>
          <a className="btn btn-primary" href="#">
            <i className="fi fi-rr-hand-holding-usd"></i>
            Make a Donation
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Convoy of Hope • All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Homepage


