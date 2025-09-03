# Red Malanga - Creative Portfolio

![Red Malanga Portfolio Screenshot](./screenshot.png)
*(Replace this with a screenshot of your project)*

A modern, fast, and fully responsive creative portfolio for Aaron Alayo, showcasing work in videography, photography, and web development. Built from the ground up with a professional tech stack including React, TypeScript, Vite, Sanity.io, and Tailwind CSS.

**Live Demo:** [**redmalanga.com**](https://redmalanga.com)

---

## ✨ Features

This project is not just a gallery, but a complete, modern web application with a focus on performance, user experience, and SEO.

*   🎨 **High-Contrast Dark Mode:** A sleek black and white theme with a manual toggle. It respects the user's OS preference (`prefers-color-scheme`) on their first visit and saves their choice in `localStorage`.
*   🔗 **Deep Linking (URL-Aware Modals):** Every photo and video has its own unique, shareable URL (e.g., `/photos/paris-fashion-week`). Visiting a link directly opens the specific piece of work, greatly improving shareability and SEO.
*   📈 **Fully SEO Optimized:**
    *   Dynamic page titles, descriptions, and canonical URLs for each page and individual piece of work.
    *   A complete `sitemap.xml` submitted to search engines.
    *   A valid `manifest.json` for PWA capabilities.
*   🍪 **GDPR Compliant Cookie Consent:** A modern, non-intrusive banner that stores a detailed consent record in `localStorage`, only enabling Google Analytics after explicit user consent.
*   📬 **Dual-Endpoint Contact Form:** Submissions are sent as an instant email notification via **Formspree** and are simultaneously saved as a permanent record in the **Sanity.io** database.
*   🤖 **Google reCAPTCHA v3 Spam Protection:** The contact form is protected by Google's invisible reCAPTCHA v3, providing a frictionless experience for real users.
*   📱 **Fully Responsive Design:** A mobile-first approach ensures a perfect viewing experience on all devices, with special attention to mobile landscape mode for menus and background videos.
*   🚀 **Headless CMS Integration:** All content (videos, photos, projects, about page) is managed dynamically through a powerful and easy-to-use **Sanity.io Studio**.

---

## 🛠️ Tech Stack

*   **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with the Typography plugin
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Headless CMS:** [Sanity.io](https://www.sanity.io/)
*   **Email & Forms:** [Formspree](https://formspree.io/)
*   **Spam Protection:** [Google reCAPTCHA v3](https://www.google.com/recaptcha/about/)
*   **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 🚀 Getting Started

To run this project locally, you'll need to have Node.js and npm (or yarn) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/[YourGitHubUsername]/[YourRepoName].git
cd [YourRepoName]
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires environment variables to connect to Sanity, Formspree, and Google reCAPTCHA.

Create a new file in the root of the project named `.env.local`. Copy the contents of `.env.example` into it and fill in your keys.

```env
# .env.local

# Get this from your Sanity project settings (e.g., in sanity.json)
VITE_SANITY_PROJECT_ID="xxxxxxxx"

# Get this from your Formspree form's URL (e.g., https://formspree.io/f/YOUR_ID)
VITE_FORMPSREE_ID="xxxxxxxx"

# Get this from your Google reCAPTCHA v3 admin console
VITE_GOOGLE_RECAPTCHA_V3_SITE_KEY="xxxxxxxxxxxxxxxxxxxxxxxx"
```

*Your Sanity client in `sanityClient.ts` may not use an environment variable for the Project ID. If it's hardcoded there, you can ignore that variable.*

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.

### 5. Set Up the Sanity Studio

The Sanity Studio is a separate application, likely in a `/studio` subfolder.

```bash
# Navigate to your Sanity folder
cd studio

# Install dependencies
npm install

# Run the Studio
sanity start
```

The Studio should now be running on `http://localhost:3333`.

---

## ☁️ Deployment

This project is deployed on **Cloudflare Pages**.

For a successful deployment, the same environment variables found in your `.env.local` file must be added to the project settings in the Cloudflare Pages dashboard under **Settings > Environment Variables**.

---

## 👤 Author

**Aaron Alayo**

*   Portfolio: [redmalanga.com](https://redmalanga.com)
*   GitHub: [@aaronalayo](https://github.com/aaronalayo)

---

## 📄 License

This project is licensed under the MIT License.