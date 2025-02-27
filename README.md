# LearnForge Onboarding Template

A simple, customizable onboarding course template for e-learning, built with HTML, CSS, and JavaScript. Perfect for welcoming new hires or training teams with slides and a quiz—plug-and-play with SCORM support.

## What It Is
This template's a lightweight, realistic tool for short onboarding or training courses. Think company intros (mission, team pics, videos) followed by a quick quiz ("What's our core value?"). It's designed for non-techies—edit one JSON file to swap content, colors, and fonts, no code-digging required.

## Features
- **Flexible Content**: Add slides with text, images, videos, checklists, or quotes via `config.json`.
- **Custom Theming**: Control all colors (`primary`, `text`, `correct`, etc.), header gradient, sidebar/card backgrounds, and font size—match your brand easily, including dark looks. 
- **SCORM Ready**: Tracks progress and quiz scores—works with e-learning platforms out of the box.
- **Responsive**: Looks good on mobile or desktop—buttons and layouts adjust automatically.
- **Smooth Loading**: Shows a "Loading" screen until ready—no flash of default styles.
- **Accessible**: ARIA labels and focus management for basic inclusivity.

## How Realistic Is It?
- **Spot-On for Small Courses**: Ideal for ~10 slides/quizzes (e.g., onboarding, safety intros). Simple, not overbuilt—perfect for quick setups by small teams or solo creators.
- **User-Friendly**: New users edit `config.json` (e.g., change a title or color)—no HTML/JS needed. JSON's easy with a sample, though watch for commas!
- **Limits**: No pagination or fancy interactions (e.g., drag-and-drop)—great for basic checks, less so for huge courses or complex quizzes. Realistic trade-off for its scope.

## Configuration Guide

### Basic Configuration

Open your `config.json` file in any text editor. Start by updating the course title:

```json
{
    "title": "Your Course Title Here",
    ...
}
```

### Theme Customization

The `theme` section controls all visual aspects of your course. Here's what each property does:

```json
"theme": {
    "primary": "#2F3437",       // Main color for buttons and interactive elements
    "secondary": "#898989",     // Secondary color for less important elements
    "gradientStart": "#F7F6F3", // Top color of the header gradient
    "gradientEnd": "#E8E7E4",   // Bottom color of the header gradient
    "background": "#FFFFFF",    // Page background color
    "text": "#2F3437",          // Regular text color
    "correct": "#0F7B6C",       // Color for correct answers in quiz
    "incorrect": "#E03E3E",     // Color for incorrect answers in quiz
    "title": "#2F3437",         // Color for course titles
    "sidebar": "#F7F6F3",       // Sidebar background color
    "card": "#FFFFFF"           // Content card background color
}
```

**Tips:**
- Use hex color codes (e.g., `#007BFF` for blue)
- For a flat header (no gradient), set both `gradientStart` and `gradientEnd` to the same color
- For dark mode, try dark backgrounds (`#333333`) and light text (`#FFFFFF`)
- Adjust `fontSize` (e.g., `"1.25rem"`) to make text larger or smaller

### Content Creation

The `slides` array contains all your course content. Each slide has a `type` that determines its layout:

#### Text Slides

Simple text-only slides:

```json
{
    "type": "text", 
    "title": "Welcome to Our Company", 
    "content": "We're excited to have you join our team! This course will guide you through everything you need to know."
}
```

#### Image Slides

Slides with an image and caption:

```json
{
    "type": "image", 
    "title": "Our Office", 
    "src": "images/office.jpg", 
    "alt": "Modern office space with large windows", 
    "caption": "Our headquarters in downtown Seattle"
}
```

**Important:** Place your images in an `images` folder next to your `index.html` file.

#### Title with Text

Slides with prominent title followed by text:

```json
{
    "type": "title-text", 
    "title": "Our Mission", 
    "content": "We strive to create innovative solutions that make a positive impact on the world."
}
```

#### Video Embeds

Slides with embedded videos:

```json
{
    "type": "video", 
    "title": "Welcome Message", 
    "src": "https://www.youtube.com/embed/YOUR_VIDEO_ID", 
    "description": "A welcome message from our CEO"
}
```

**Note:** Only use embed URLs (e.g., `https://www.youtube.com/embed/dQw4w9WgXcQ` for YouTube, `https://player.vimeo.com/video/76979871` for Vimeo)

#### Image with Text

Slides with an image and text side-by-side:

```json
{
    "type": "image-text", 
    "title": "Your Workstation", 
    "src": "images/desk.jpg", 
    "alt": "Modern desk with computer equipment", 
    "text": "Your workstation comes equipped with the latest technology to help you succeed."
}
```

#### Checklists

Slides with a checklist of items:

```json
{
    "type": "checklist", 
    "title": "First Day Tasks", 
    "items": [
        "Complete HR paperwork",
        "Set up your computer",
        "Meet your team",
        "Review company handbook"
    ]
}
```

#### Quotes

Slides with a quotation and attribution:

```json
{
    "type": "quote", 
    "title": "Leadership Insight", 
    "content": "Innovation distinguishes between a leader and a follower.", 
    "author": "Steve Jobs"
}
```

### Quiz Configuration

The quiz appears at the end of your course. Configure questions, options, and correct answers:

```json
"quiz": {
    "questions": [
        {
            "question": "What is our company's mission?", 
            "options": [
                "To maximize profit",
                "To create innovative solutions",
                "To be the largest in our industry"
            ], 
            "correct": "To create innovative solutions"
        },
        {
            "question": "Where is our headquarters located?", 
            "options": [
                "New York",
                "Seattle",
                "Chicago"
            ], 
            "correct": "Seattle"
        }
    ]
}
```

**Important:** The `correct` value must exactly match one of the options!

### Sidebar Navigation

Enable or disable the sidebar navigation:

```json
"sidebar": true,  // true = show sidebar, false = hide sidebar
```

### Common Issues

1. **Blank Screen or Loading Forever**
   - Check for JSON syntax errors (missing commas, brackets, or quotes)
   - Verify all required fields are present

2. **Images Not Showing**
   - Confirm image paths are correct (`images/filename.jpg`)
   - Ensure images are in the correct folder

3. **Videos Not Playing**
   - Use embed URLs only, not direct video URLs
   - For YouTube: `https://www.youtube.com/embed/VIDEO_ID`
   - For Vimeo: `https://player.vimeo.com/video/VIDEO_ID`

4. **Quiz Not Working**
   - Ensure `correct` value exactly matches one of the options

## How to Use It
1. **Clone or Download**: Grab this repo.
2. **Edit `config.json`** using the configuration guide above.
3. **Add Images**: Place local images in an `images` folder next to `index.html` (e.g., `images/team.jpg`), reference them in `config.json` with relative paths (e.g., `"src": "images/team.jpg"`).
4. **Run Locally**: Open `index.html` in a browser (VS Code Live Server works great) to test.
5. **Package for SCORM**: Open the repo folder, select all files inside (e.g., `index.html`, `config.json`, `images` folder, `imsmanifest.xml`), right-click and zip them. Edit `imsmanifest.xml`'s `<title>` (e.g., `<title>New Hire Welcome</title>`)—`<file href="index.html"/>` is already set. Upload the zip to your SCORM platform.
6. **Test**: Refresh—see "Loading," then your themed course.

## Example Config

Here's a complete example config.json file:

```json
{
    "title": "New Employee Orientation",
    "theme": {
        "primary": "#0056b3",
        "secondary": "#6c757d",
        "gradientStart": "#f8f9fa",
        "gradientEnd": "#e9ecef",
        "background": "#ffffff",
        "text": "#212529",
        "correct": "#28a745",
        "incorrect": "#dc3545",
        "title": "#0056b3",
        "sidebar": "#f8f9fa",
        "card": "#ffffff"
    },
    "fontSize": "1.125rem",
    "sidebar": true,
    "slides": [
        {"type": "text", "title": "Welcome!", "content": "Welcome to our team! We're excited to have you join us."},
        {"type": "image", "title": "Our Team", "src": "images/team.jpg", "alt": "Team photo", "caption": "Your new colleagues"},
        {"type": "title-text", "title": "Our Values", "content": "Integrity, Innovation, and Teamwork guide everything we do."},
        {"type": "video", "title": "Welcome Video", "src": "https://www.youtube.com/embed/dQw4w9WgXcQ", "description": "A message from our founder"},
        {"type": "image-text", "title": "Office Tour", "src": "images/office.jpg", "alt": "Office space", "text": "Our open-concept workspace promotes collaboration."},
        {"type": "checklist", "title": "First Week Checklist", "items": ["Complete paperwork", "Set up workstation", "Meet your team", "Schedule orientation"]},
        {"type": "quote", "title": "Our Philosophy", "content": "Alone we can do so little; together we can do so much.", "author": "Helen Keller"}
    ],
    "quiz": {
        "questions": [
            {"question": "What are our company values?", "options": ["Profit, Power, Prestige", "Integrity, Innovation, Teamwork", "Growth, Sales, Marketing"], "correct": "Integrity, Innovation, Teamwork"},
            {"question": "What type of workspace do we have?", "options": ["Cubicles", "Private offices", "Open-concept"], "correct": "Open-concept"}
        ]
    }
}
```

Built by a program manager-dev duo—practical, polished, and ready for your onboarding needs!

## License
This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details.
