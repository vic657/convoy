import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiAxios } from "../axios"; 

import "../assets/css/bootstrap.min.css";
import "../assets/css/all.min.css";
import "../assets/css/animate.compat.css";
import "../assets/css/styles.css";

// Import images
import img1 from "../assets/images/img1.jpg";
import ico1 from "../assets/images/ico1.png";
import ico2 from "../assets/images/ico2.png";
import ico3 from "../assets/images/ico3.png";
import ico4 from "../assets/images/ico4.png";
import card1 from "../assets/images/card1.jpg";
import card2 from "../assets/images/card2.jpg";
import card3 from "../assets/images/card3.jpg";
import gallery1 from "../assets/images/gallery1.jpg";
import gallery2 from "../assets/images/gallery2.jpg";
import gallery3 from "../assets/images/gallery3.jpg";
import gallery4 from "../assets/images/gallery4.jpg";
import gallery5 from "../assets/images/gallery5.jpg";

// Import Navbar
import Navbar from "../Components/Navbar";

const Homepage = () => {
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideInterval = useRef(null);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  // Fetch upcoming events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiAxios.get("/events");
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else if (res.data.upcoming) {
        setEvents(res.data.upcoming);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Hero auto-slide logic
  useEffect(() => {
    if (events.length > 0) startAutoSlide();
    return () => stopAutoSlide();
  }, [events]);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="sec-0">
        <article>
          <div className="container">
            <h1>We are Convoy of Hope</h1>
            <h2>
              Donation services <br />
              <span>International Africa</span>
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore fuga debitis distinctio doloribus quis adipisci asperiores soluta quidem nemo aperiam maiores tempora, accusamus minus odit magni corporis molestias dignissimos porro?
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione assumenda recusandae earum totam fuga!
            </p>
            <a href="#">Show More</a>
            <a href="#">Donate</a>
          </div>
        </article>
      </section>

      
     {/* === Events Hero Slider (with description) === */}
<section id="events-hero">
  <div className="events-container">
    <h2>Upcoming Events</h2>

    <div className="event-slider">
      {events.length > 0 ? (
        events.map((event, index) => (
          <div
            key={event.id}
            className={`event-slide ${index === activeIndex ? "active" : ""}`}
          >
            <img
              src={event.image_url}
              alt={event.title}
              className="event-slide-image"
            />

            <div className="overlay">
              <div className="event-info">
                <h3>{event.title}</h3>
                <p>{event.date} • {event.venue}</p>
                <p className="desc">
                  {event.description?.length > 150
                    ? event.description.slice(0, 150) + "..."
                    : event.description}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-events">No upcoming events yet.</div>
      )}

      {events.length > 1 && (
        <>
          <button className="nav-btn prev" onClick={prevSlide}>‹</button>
          <button className="nav-btn next" onClick={nextSlide}>›</button>
        </>
      )}
    </div>
  </div>
</section>



      {/* Section 1 - Welcome */}
      <section id="sec-1">
        <div className="container">
          <article>
            <h1>Welcome to our Organization</h1>
            <h2>Lorem ipsum dolor sit amet.</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate deserunt magni sint mollitia similique corporis quis voluptatibus, eos tempora alias illo nemo excepturi blanditiis vitae impedit minus tempore praesentium harum. <br /><br />
              Quis, temporibus dolorum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit maxime minima quod eius aspernatur. Accusantium sed sunt corrupti sapiente deleniti?
            </p>
            <a href="#">Show More</a>
          </article>
          <aside>
            <img src={img1} alt="man" />
          </aside>
        </div>
      </section>
      {/* Section 2 - Why Choose Us */}
      <section id="sec-2">
        <div className="container">
          <h1>Why choose us?</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto ducimus, voluptatibus perferendis voluptates quidem magni illo odit velit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, expedita tenetur? Pariatur itaque eveniet nam possimus omnis veniam cupiditate provident.
          </p>

          <article>
            {[{ img: ico1, title: "Transparency" }, { img: ico2, title: "Donations" }, { img: ico3, title: "Community Growth" }, { img: ico4, title: "Development" }].map((item, i) => (
              <figure key={i}>
                <div><img src={item.img} alt={item.title} /></div>
                <div className="cont">
                  <h2>{item.title}</h2>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A iste ad illum, ducimus asperiores necessitatibus reprehenderit?</p>
                </div>
              </figure>
            ))}
          </article>
        </div>
      </section>

      {/* Section 3 - Our Services */}
      <section id="sec-3">
        <div className="container">
          <h1>Our Services</h1>
          <div className="cont">
            {[{ img: card1, title: "Food Distributions" }, { img: card2, title: "Donations" }, { img: card3, title: "Community Development" }].map((card, i) => (
              <div className="card border-0" key={i}>
                <div>
                  <img src={card.img} className="card-img-top" alt={card.title} />
                  <h5 className="caption">{card.title}</h5>
                </div>
                <div className="card-body px-0 pt-4">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum expedita tempora quam omnis deleniti! Consequuntur, distinctio magnam beatae dignissimos assumenda quisquam accusamus similique aut esse pariatur consectetur ab adipisci cupiditate sint maxime dolorum doloremque autem quasi nostrum nobis dicta?
                  </p>
                  <a href="#">Show More</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - Milestone */}
      <section id="sec-4">
        <div className="container">
          <h1>Our Milestone</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reiciendis accusamus autem tenetur vero, facilis omnis, ullam quis mollitia deleniti ea similique laboriosam numquam ab dignissimos!
          </p>

          <div className="cont">
            <img className="wow animated fadeIn slow" src={gallery1} alt="gallery1" />
            <aside>
              <img src={gallery3} alt="gallery3" className="wow animated flipInX delay-1s" />
              <img src={gallery2} alt="gallery2" className="wow animated flipInX delay-1s slower" />
              <img src={gallery4} alt="gallery4" className="wow animated flipInX delay-2s" />
              <img src={gallery5} alt="gallery5" className="wow animated flipInX delay-2s slower" />
            </aside>
          </div>
        </div>
      </section>

      {/* Section 5 - Contact Form */}
      <section id="sec-5">
        <div className="contactUs">
          <div className="container">
            <aside>
              <h1>Do you have any questions?</h1>
              <h2>Feel free to contact us!</h2>
            </aside>
            <form id="form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="text" name="message" placeholder="Message" required />
              <input type="submit" value="Submit" id="submit" />
              <p id="msg"></p>
            </form>
          </div>
        </div>
      </section>

      {/* Section 6 - Footer Info */}
      <section id="sec-6">
        <div className="container">
          <div className="about">
            <h1>About</h1>
            <h2>
              CONVOY OF HOPE
              <p>Lorem ipsum dolor sit amit.</p>
            </h2>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus eius nisi repudiandae ipsam pariatur, quos perspiciatis eaque officia rerum odio modi sed fugiat mollitia? Rerum, architecto obcaecati!</p>
            <div className="social">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube-square"></i></a>
            </div>
          </div>

          <div className="links">
            <h1>Explore Links</h1>
            <a href="#">Our Services</a>
            <a href="#">Meet Our Team</a>
            <a href="#">Careers</a>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Our Terms</a>
          </div>

          <div className="contact">
            <h1>Contact Us</h1>
            <p>Nairobi, Kenya</p>
            <p>convoyofhope@gmail.com</p>
            <p>+254 00 00 1234<br />+254 00 00 1234</p>
          </div>
        </div>
      </section>

      {/* Section 7 - Copyright */}
      <section id="sec-7">
        <div className="container">
          <p>Copyright ©2025 | <span>Convoy of Hope</span></p>
        </div>
      </section>
    </>
  );
};

export default Homepage;
