# Footer Customization Guide

## How to Update Your Social Media Links

The footer has been added to your SQL Query Visualizer application with placeholder social media links. Follow these steps to update them with your actual profiles:

### Location
Edit the file: `frontend/src/components/Footer.js`

### Steps to Update

1. Open `frontend/src/components/Footer.js` in your code editor

2. Find the `socialLinks` array (around line 4):

```javascript
const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/yourprofile',  // ← Update this
    icon: isRetroTheme ? '◉' : '💼',
    label: isRetroTheme ? '[LINKEDIN]' : 'LinkedIn'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',  // ← Update this
    icon: isRetroTheme ? '◈' : '💻',
    label: isRetroTheme ? '[GITHUB]' : 'GitHub'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/yourprofile',  // ← Update this
    icon: isRetroTheme ? '◎' : '📘',
    label: isRetroTheme ? '[FACEBOOK]' : 'Facebook'
  }
];
```

3. Replace the placeholder URLs:
   - **LinkedIn**: Replace `https://www.linkedin.com/in/yourprofile` with your LinkedIn profile URL
   - **GitHub**: Replace `https://github.com/yourusername` with your GitHub profile URL
   - **Facebook**: Replace `https://www.facebook.com/yourprofile` with your Facebook profile URL

### Adding More Social Links

To add more social media platforms (Twitter, Instagram, Email, etc.):

```javascript
const socialLinks = [
  // ... existing links ...
  {
    name: 'Twitter',
    url: 'https://twitter.com/yourhandle',
    icon: isRetroTheme ? '◐' : '🐦',
    label: isRetroTheme ? '[TWITTER]' : 'Twitter'
  },
  {
    name: 'Email',
    url: 'mailto:your.email@example.com',
    icon: isRetroTheme ? '◈' : '✉️',
    label: isRetroTheme ? '[EMAIL]' : 'Email'
  }
];
```

### Removing Social Links

To remove a platform, simply delete its entire object from the array.

### Footer Features

The footer automatically adapts to your selected theme:
- **Retro Themes** (Green Phosphor, Amber Terminal, etc.): Shows a terminal-style footer with ASCII borders and monospace text
- **Normal/Modern Mode**: Shows a clean, modern footer with rounded buttons

The footer appears on:
- Main application page
- Data Detective mode

### Preview Your Changes

After making changes:
1. Save the file
2. If the development server is running, it will auto-reload
3. If not, run: `npm start` in the `frontend` directory
4. Check the footer at the bottom of the page in both retro and normal themes

## Design Consistency

The footer is designed to match the application's existing design system:
- Uses the same color schemes as your theme switcher
- Follows the CRT/terminal aesthetic in retro modes
- Maintains the modern, clean look in normal mode
- Responsive layout that works on all screen sizes
