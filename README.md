<div align="center">
  <h1>Secure Auth Frontend</h1>
  <p>React + Tailwind UI for authentication, 2FA, and user dashboard.</p>
</div>

<hr />

<h2>Overview</h2>
<p>
  This project is a frontend client for <strong>secure-auth-backend</strong>.
  It provides registration, login (including 2FA), Google OAuth sign-in, and
  a personal dashboard with profile and security actions.
</p>

<h2>Features</h2>
<ul>
  <li>Email/password registration and login</li>
  <li>Two-factor authentication (TOTP) flow</li>
  <li>Google OAuth sign-in</li>
  <li>User dashboard with profile + password change + 2FA management</li>
  <li>Light/Dark theme toggle</li>
  <li>Terminal-style typography and green profile output</li>
</ul>

<h2>Tech Stack</h2>
<ul>
  <li>React (Vite)</li>
  <li>Tailwind CSS</li>
  <li>React Router</li>
</ul>

<h2>Getting Started</h2>
<ol>
  <li>Install dependencies:</li>
</ol>
<pre><code>npm install</code></pre>

<ol start="2">
  <li>Create a <code>.env</code> file:</li>
</ol>
<pre><code>VITE_API_BASE_URL=http://localhost:8080</code></pre>

<ol start="3">
  <li>Start the dev server:</li>
</ol>
<pre><code>npm run dev -- --port 5173</code></pre>

<h2>Backend Requirements</h2>
<ul>
  <li>Backend running at <code>http://localhost:8080</code> (or update <code>.env</code>).</li>
  <li>CORS enabled for <code>http://localhost:5173</code>.</li>
  <li>Google OAuth callback must redirect to <code>/oauth2/callback</code> on the frontend.</li>
</ul>

<h2>Routes</h2>
<ul>
  <li><code>/</code> &mdash; Auth page (login/register)</li>
  <li><code>/oauth2/callback</code> &mdash; Receives OAuth token and redirects to dashboard</li>
  <li><code>/dashboard</code> &mdash; User dashboard (protected)</li>
</ul>

<h2>Notes</h2>
<ul>
  <li>Replace the GitHub link in <code>src/pages/AuthPage.jsx</code> with your repo URL.</li>
  <li>If Google OAuth opens a JSON page, ensure backend redirects to the frontend callback.</li>
</ul>
