# IARC Theme Customization Guide

## Overview
The IARC theme is a custom Reveal.js theme designed for professional presentations at the International Agency for Research on Cancer (IARC/WHO).

## Location
- **SCSS Source**: `css/theme/source/iarc.scss`
- **Compiled CSS**: `dist/theme/iarc.css`

## Customization Instructions

### 1. Brand Colors
Edit these variables at the top of `css/theme/source/iarc.scss`:

```scss
$iarc-primary: #1e7fb8;        // Main brand color (headings, links, accents)
$iarc-secondary: #2c3e50;      // Secondary color (dark slate)
$iarc-accent: #e74c3c;         // Accent color (emphasis, warnings)
$iarc-light: #ecf0f1;          // Light backgrounds
$iarc-dark: #2c3e50;           // Dark text color
```

### 2. Typography
Adjust fonts and sizes:

```scss
// Font Families
$mainFont: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
$headingFont: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;

// Font Sizes
$mainFontSize: 38px;           // Base font size
$heading1Size: 2.8em;          // H1 size
$heading2Size: 2.0em;          // H2 size
$heading3Size: 1.5em;          // H3 size
$heading4Size: 1.2em;          // H4 size

// Font Properties
$headingFontWeight: 700;       // Heading weight (300, 400, 600, 700, 800)
$headingLetterSpacing: -0.02em;
$headingTextTransform: none;   // Options: none, uppercase, lowercase
```

### 3. Layout & Background
```scss
$backgroundColor: #ffffff;     // Main slide background
```

### 4. Building After Changes
After modifying the SCSS file, rebuild the theme:

```bash
cd 19_PresentationsRevealJS
npm run build -- css-themes
```

Or watch for changes:
```bash
npm start
```

## Using the Theme

### Basic Usage
In your HTML file:
```html
<link rel="stylesheet" href="dist/theme/iarc.css">
```

### Custom CSS Classes

#### Text Colors
```html
<p class="primary">Primary color text</p>
<p class="secondary">Secondary color text</p>
<p class="accent">Accent color text</p>
```

#### Info Boxes
```html
<div class="info-box">
  Important information with primary color border
</div>

<div class="warning-box">
  Warning or alert with accent color border
</div>

<div class="success-box">
  Success message with green border
</div>
```

#### Title Slide
```html
<section class="title-slide">
  <h1>Main Title</h1>
  <h2>Subtitle</h2>
  <h3>Author or Details</h3>
</section>
```

#### Background Colors
```html
<!-- Primary background -->
<section data-background-color="#1e7fb8">
  <h2>Content on primary background</h2>
</section>

<!-- Or use the class on slide-background -->
<section data-state="iarc-primary-bg">
  <h2>Content</h2>
</section>
```

## Theme Features

### Typography
- **Headings**: Montserrat font (bold, modern)
- **Body**: Open Sans (clean, readable)
- **Code**: Monaco, Courier New

### Enhanced Elements
- **Lists**: Primary color markers
- **Links**: Primary color with hover effects
- **Blockquotes**: Left border accent with light background
- **Tables**: Styled headers with alternating rows
- **Code blocks**: Left border accent with shadows

### Interactive Elements
- **Progress bar**: Primary color
- **Controls**: Primary color navigation arrows

## Example Presentation Structure

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My IARC Presentation</title>
  
  <link rel="stylesheet" href="dist/reset.css">
  <link rel="stylesheet" href="dist/reveal.css">
  <link rel="stylesheet" href="dist/theme/iarc.css">
  <link rel="stylesheet" href="plugin/highlight/monokai.css">
</head>
<body>
  <div class="reveal">
    <div class="slides">
      
      <!-- Title Slide -->
      <section class="title-slide">
        <h1>Presentation Title</h1>
        <h2>Subtitle or Description</h2>
        <h3>Author Name | IARC/WHO</h3>
      </section>
      
      <!-- Regular Slide -->
      <section>
        <h2>Slide Title</h2>
        <p>Content here...</p>
      </section>
      
      <!-- Slide with Info Box -->
      <section>
        <h2>Important Information</h2>
        <div class="info-box">
          This is highlighted information
        </div>
      </section>
      
      <!-- Slide with Custom Background -->
      <section data-background-color="#1e7fb8">
        <h2 style="color: white;">White Text on Primary Background</h2>
      </section>
      
    </div>
  </div>
  
  <script src="dist/reveal.js"></script>
  <script src="plugin/markdown/markdown.js"></script>
  <script src="plugin/highlight/highlight.js"></script>
  <script>
    Reveal.initialize({
      plugins: [ RevealMarkdown, RevealHighlight ]
    });
  </script>
</body>
</html>
```

## Quick Customization Checklist

1. [ ] Update brand colors (`$iarc-primary`, etc.)
2. [ ] Change fonts if needed
3. [ ] Adjust font sizes
4. [ ] Rebuild theme: `npm run build -- css-themes`
5. [ ] Test in browser
6. [ ] Fine-tune as needed

## Tips

- **Color Contrast**: Ensure sufficient contrast between text and backgrounds
- **Font Loading**: Google Fonts are loaded from CDN; for offline use, download fonts locally
- **Responsive**: Theme is responsive and works on different screen sizes
- **Print**: Theme includes print-friendly styles

## Need Help?

- **Reveal.js Docs**: https://revealjs.com
- **Sass Guide**: https://sass-lang.com/guide
- **Color Tools**: https://coolors.co (for generating color palettes)
