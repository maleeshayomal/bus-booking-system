import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Booking Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "Booking Inquiry",
      message: "",
    });
  };

  return (
    <div className="container contact-page">
      <div className="contact-header">
        <div className="badge badge-info contact-badge">
          <Phone size={14} /> 24/7 Customer Support
        </div>
        <h1 className="page-title">Get in Touch with Tripimate</h1>
        <p className="page-subtitle">
          Have questions about your bus ticket, routes, or corporate bookings? We are here to help!
        </p>
      </div>

      <div className="contact-layout">
        {/* Contact Info Cards */}
        <div className="contact-info-column">
          <div className="card info-box">
            <div className="info-icon-wrap">
              <Phone size={22} className="info-icon" />
            </div>
            <div className="info-content">
              <h3>Direct Hotline</h3>
              <p>24/7 phone support for instant bookings & inquiries.</p>
              <a href="tel:0779915391" className="info-highlight-link">
                077-9915391
              </a>
            </div>
          </div>

          <div className="card info-box">
            <div className="info-icon-wrap">
              <Mail size={22} className="info-icon" />
            </div>
            <div className="info-content">
              <h3>Email Support</h3>
              <p>Send your queries or partnership requests anytime.</p>
              <a href="mailto:support@tripimate.lk" className="info-highlight-link">
                support@tripimate.lk
              </a>
            </div>
          </div>

          <div className="card info-box">
            <div className="info-icon-wrap">
              <MapPin size={22} className="info-icon" />
            </div>
            <div className="info-content">
              <h3>Headquarters</h3>
              <p>Central Bus Station Complex, Bastian Mawatha, Colombo 11, Sri Lanka</p>
            </div>
          </div>

          <div className="card info-box">
            <div className="info-icon-wrap">
              <Clock size={22} className="info-icon" />
            </div>
            <div className="info-content">
              <h3>Working Hours</h3>
              <p>Online Hotline: 24/7 Active</p>
              <p>Ticketing Counters: 05:30 AM - 10:30 PM Daily</p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="card contact-form-card">
          <h2>
            <MessageSquare size={20} /> Send Us a Message
          </h2>
          <p className="form-sub">Fill in the details below and our team will get back to you shortly.</p>

          {submitted && (
            <div className="contact-success-alert">
              <CheckCircle2 size={18} />
              <span>Thank you! Your message has been sent. We'll reply within 1 hour.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 0771234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="Booking Inquiry">Booking Inquiry</option>
                <option value="Bus Timing Query">Bus Timing Query</option>
                <option value="Refund Support">Refund Support</option>
                <option value="Operator / Bus Partner">Partner as Bus Operator</option>
                <option value="Feedback / Suggestion">Feedback / Suggestion</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary send-msg-btn">
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
