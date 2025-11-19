# IARC 60th Anniversary Reveal.js Theme

## Overview
The IARC_60 theme is a professional Reveal.js theme designed for the International Agency for Research on Cancer's 60th anniversary (1965-2025). All colors, fonts, and styling have been extracted directly from the official **IARC60_PowerPointTemplate_EN.potx** file.

## Color Palette
The theme uses the official IARC 60 color scheme:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Deep Blue | `#243883` | Primary brand color, headings |
| Pink | `#ED709D` | Secondary accent, emphasis |
| Turquoise | `#63BFB5` | Links, highlights, success |
| Orange | `#F3A26F` | Warm accent, warnings |
| Coral | `#F18F8C` | Light accent |
| White | `#FFFEFE` | Backgrounds, light text |

## Typography
- **Font Family**: Arial (as per official template)
- **Fallbacks**: Roboto, Helvetica Neue, Helvetica, sans-serif
- **Heading Sizes**: H1 (2.5em) → H2 (1.8em) → H3 (1.4em) → H4 (1.1em)

## File Locations
- **Source SCSS**: `css/theme/source/iarc_60.scss`
- **Compiled CSS**: `dist/theme/iarc_60.css`
- **Example Presentation**: `examples/iarc_60.html`

## Using the Theme

### Basic Setup
```html
<!doctype html>
<html lang="en">
<head>
    <link rel="stylesheet" href="dist/reset.css">
    <link rel="stylesheet" href="dist/reveal.css">
    <link rel="stylesheet" href="dist/theme/iarc_60.css">
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <!-- Your slides here -->
        </div>
    </div>
    <script src="dist/reveal.js"></script>
    <script>Reveal.initialize();</script>
</body>
</html>
```

## Theme Components

### 1. Title Slide
```html
<section class="title-slide">
    <h1>Main Title</h1>
    <h2>Subtitle</h2>
    <h3>Author / Organization</h3>
    <p class="anniversary-badge">🎉 Celebrating 60 Years</p>
</section>
```

### 2. Section Breaks
```html
<section data-background-color="#243883" class="section-slide">
    <h2>Section Title</h2>
    <p>Section description</p>
</section>
```

### 3. Two-Column Layout
```html
<section>
    <h2>Title</h2>
    <div class="two-columns">
        <div class="column">
            <h3>Left Column</h3>
            <p>Content...</p>
        </div>
        <div class="column">
            <h3>Right Column</h3>
            <p>Content...</p>
        </div>
    </div>
</section>
```

### 4. Three-Column Grid
```html
<div class="three-columns">
    <div class="column">...</div>
    <div class="column">...</div>
    <div class="column">...</div>
</div>
```

### 5. Info Boxes
```html
<!-- Information box -->
<div class="info-box">
    <strong>Info:</strong> Important information here
</div>

<!-- Warning box -->
<div class="warning-box">
    <strong>Warning:</strong> Cautionary information
</div>

<!-- Success box -->
<div class="success-box">
    <strong>Success:</strong> Positive outcome
</div>

<!-- Alert box -->
<div class="alert-box">
    <strong>Alert:</strong> Critical information
</div>
```

### 6. Feature Cards
```html
<div class="three-columns">
    <div class="feature-card">
        <div class="icon">🔬</div>
        <h3>Title</h3>
        <p>Description</p>
    </div>
    <!-- More cards... -->
</div>
```

### 7. Big Numbers / Statistics
```html
<div class="big-number">
    60
    <small>Years of Excellence</small>
</div>
```

### 8. Timeline
```html
<div class="timeline">
    <div class="timeline-item">
        <h4>1965</h4>
        <p>Event description</p>
    </div>
    <div class="timeline-item">
        <h4>2025</h4>
        <p>Event description</p>
    </div>
</div>
```

### 9. Checked Lists
```html
<ul class="checked-list">
    <li>Item with checkmark</li>
    <li>Another item</li>
</ul>
```

### 10. Text Color Utilities
```html
<p class="text-deep-blue">Deep blue text</p>
<p class="text-pink">Pink text</p>
<p class="text-turquoise">Turquoise text</p>
<p class="text-orange">Orange text</p>
<p class="text-coral">Coral text</p>
<p class="text-white">White text</p>
```

### 11. Background Colors
```html
<!-- Solid backgrounds -->
<section data-background-color="#243883">...</section>
<section data-background-color="#63BFB5">...</section>

<!-- Gradient backgrounds -->
<section data-background-gradient="linear-gradient(135deg, #243883 0%, #63BFB5 100%)">
    ...
</section>
```

### 12. Tables
Tables are automatically styled with:
- Gradient headers (deep blue)
- Alternating row colors
- Hover effects
- Rounded corners

```html
<table>
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </tbody>
</table>
```

### 13. Code Blocks
```html
<pre><code class="language-python" data-trim>
# Your code here
def hello():
    print("Hello, IARC!")
</code></pre>
```

### 14. Blockquotes
```html
<!-- Standard blockquote -->
<blockquote>
    Your quote text here
</blockquote>

<!-- Highlighted blockquote -->
<blockquote class="highlight">
    Important highlighted quote
</blockquote>
```

## Customization

### Rebuilding the Theme
After making changes to `css/theme/source/iarc_60.scss`:

```bash
cd 19_PresentationsRevealJS
npm run build -- css-themes
```

Or compile directly:
```bash
npx sass css/theme/source/iarc_60.scss:dist/theme/iarc_60.css
```

### Color Variables
To modify colors, edit these variables in `iarc_60.scss`:
```scss
$iarc60-deep-blue: #243883;
$iarc60-pink: #ED709D;
$iarc60-turquoise: #63BFB5;
$iarc60-orange: #F3A26F;
$iarc60-coral: #F18F8C;
```

## Example Presentation
A comprehensive showcase of all theme features is available at:
**`examples/iarc_60.html`**

This includes 21 slides demonstrating:
- Title slide
- Color palette showcase
- Typography examples
- All list styles
- Info boxes (4 types)
- Multi-column layouts
- Statistics/big numbers
- Tables
- Code blocks
- Blockquotes
- Timeline
- Feature cards
- Background variations
- And more!

## Viewing the Example
1. Start your Python server (if not already running):
   ```bash
   python3 server.py
   ```

2. Open in browser:
   ```
   http://localhost:8000/19_PresentationsRevealJS/examples/iarc_60.html
   ```

## Navigation
- **Arrow Keys**: Navigate between slides
- **ESC**: Slide overview
- **S**: Speaker notes
- **F**: Fullscreen
- **B**: Pause (black screen)

## Features
- ✅ Official IARC 60 colors from PowerPoint template
- ✅ Arial typography (brand standard)
- ✅ 20+ styled components
- ✅ Responsive layouts
- ✅ Smooth animations
- ✅ Code syntax highlighting
- ✅ Print-friendly
- ✅ Speaker notes support

## Credits
- Theme created by: Frédéric LAM
- Based on: IARC60_PowerPointTemplate_EN.potx
- Built with: [Reveal.js](https://revealjs.com)
- Organization: [IARC/WHO](https://www.iarc.who.int)

## License
This theme follows the branding guidelines of the International Agency for Research on Cancer.

---

**🎉 Celebrating 60 Years of Cancer Research Excellence (1965-2025)**
