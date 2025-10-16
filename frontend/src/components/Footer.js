import React from 'react';

function Footer({ isRetroTheme }) {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aritra-chakraborty-555715228',
      icon: isRetroTheme ? '◉' : '💼',
      label: isRetroTheme ? '[LINKEDIN]' : 'LinkedIn'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/aritrachakraborty101',
      icon: isRetroTheme ? '◈' : '💻',
      label: isRetroTheme ? '[GITHUB]' : 'GitHub'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/aritrac.nayan',
      icon: isRetroTheme ? '◎' : '📘',
      label: isRetroTheme ? '[FACEBOOK]' : 'Facebook'
    }
  ];

  const currentYear = new Date().getFullYear();

  if (isRetroTheme) {
    return (
      <footer className="terminal-header mt-10 py-6 px-5">
        <div className="max-w-[1800px] mx-auto">
          {/* Top Border */}
          <div className="text-center mb-4">
            <div className="terminal-text text-glow text-sm">
              ═══════════════════════════════════════════════════
            </div>
          </div>

          {/* Contact Developer Section */}
          <div className="text-center mb-4">
            <div className="terminal-text text-glow text-lg font-bold mb-3 tracking-widest">
              [[ CONTACT DEVELOPER ]]
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {socialLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-button text-xs px-4 py-2 inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <span className="text-base">{link.icon}</span>
                    <span>{link.label}</span>
                  </a>
                  {index < socialLinks.length - 1 && (
                    <span className="terminal-text text-glow">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-4">
            <div className="terminal-text text-xs opacity-70">
              &gt; © {currentYear} SQL QUERY VISUALIZER - ALL RIGHTS RESERVED
            </div>
            <div className="terminal-text text-xs opacity-60 mt-1">
              &gt; POWERED BY REACT + FLASK
            </div>
          </div>

          {/* Bottom Border */}
          <div className="text-center mt-4">
            <div className="terminal-text text-glow text-sm">
              ═══════════════════════════════════════════════════
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Modern/Normal Mode Footer
  return (
    <footer className="bg-secondary text-white mt-10 py-8 px-5 shadow-lg">
      <div className="max-w-[1800px] mx-auto">
        {/* Contact Developer Section */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-4">Contact Developer</h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-cyan-400 text-secondary px-5 py-2 rounded-lg font-semibold transition-all hover:scale-105 inline-flex items-center gap-2 shadow-md"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-400 opacity-30 my-6"></div>

        {/* Copyright */}
        <div className="text-center text-sm opacity-80">
          <p>© {currentYear} SQL Query Visualizer. All rights reserved.</p>
          <p className="mt-1 text-xs">Powered by React + Flask</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
