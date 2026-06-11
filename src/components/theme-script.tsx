// theme-script.tsx

const html = `try{var t=localStorage.getItem("theme"),d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",t==="dark"||(!t&&d))}catch(e){document.documentElement.classList.remove("dark")}`;

// biome-ignore lint/security/noDangerouslySetInnerHtml: blocking script required to prevent FOUC
const ThemeScript = () => <script dangerouslySetInnerHTML={{ __html: html }} />;

export default ThemeScript;
