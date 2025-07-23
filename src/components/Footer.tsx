const Footer = () => (
  <footer className="text-center text-blue-500 py-8 border-t border-blue-100 text-sm">
    <div className="space-y-2">
      <div>
        <a href="mailto:aaron.aa@me.com" className="hover:underline">aaron.aa@me.com</a>
        &nbsp;|&nbsp;
        <a href="tel:+4550571216" className="hover:underline">+4550571216</a>
      </div>
      <div>
        <a href="https://www.instagram.com/aaronalayo/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
      </div>
      <div>©Aaron Alayo {new Date().getFullYear()}</div>
    </div>
  </footer>
);

export default Footer; 