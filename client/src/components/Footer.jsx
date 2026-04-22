import { Link } from "react-router-dom";
import "../css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© Beyond Dimension</p>
      <div className="footerLinks">
        <Link to="/guide">User Guide</Link>
      </div>
    </footer>
  );
}

export default Footer;