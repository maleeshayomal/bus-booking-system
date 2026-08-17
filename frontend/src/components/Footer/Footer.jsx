import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">LankaTransit</div>
          <div className="footer-copy">© 2024 LankaTransit. All rights reserved.</div>
        </div>
        <div className="footer-links">
          <a href="#!">About Us</a>
          <a href="#!">Terms of Service</a>
          <a href="#!">Privacy Policy</a>
          <a href="#!">Contact Us</a>
        </div>
        <div className="footer-payments">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Genie</span>
          <span>EzCash</span>
        </div>
      </div>
    </footer>
  );
}
