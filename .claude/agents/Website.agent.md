---
name: Website
description: Describe what this custom agent does and when to use it.
tools: Read, Grep, Glob, Bash # specify the tools this agent can use. If not set, all enabled tools are allowed.
---
# Agent instructions: rework paulsteimle.github.io

## Context

Repo: `https://github.com/PaulSteimle/paulsteimle.github.io`
Stack: HTML5 UP "Massively" template — static HTML, SCSS compiled to `assets/css/main.css`, jQuery for behavior.

The site is a personal academic/photography page. Goal: modernize the visual identity and rebuild some interactive parts, without changing the underlying template architecture (no framework migration).

## Already decided / already done

- Color direction chosen: **"warm minimal"** — off-white background, warm gray text, terracotta/amber accent, dark charcoal header. Do not propose alternative palettes unless asked.
- `assets/sass/libs/_vars.scss` `$palette` map has already been updated to these values:

```scss
$palette: (
	bg:					#fafaf8,
	fg:					#7a766c,
	fg-bold:			#5c584e,
	fg-light:			#9a968c,
	border:				#f0eee6,
	border-bg:			#faf9f5,
	border2:			#e4e0d4,
	border2-bg:			#f0eee6,
	border3:			#ddd8cc,
	border3-bg:			#eae6da,

	accent1: (
		bg:				#c97a3d,
		fg-bold:		#ffffff,
		fg:				mix(#c97a3d, #ffffff, 25%),
		fg-light:		mix(#c97a3d, #ffffff, 40%)
	),

	accent2: (
		bg:				#8a8678,
		fg-bold:		#ffffff,
		fg:				mix(#8a8678, #ffffff, 25%),
		fg-light:		mix(#8a8678, #ffffff, 40%)
	),

	header: (
		bg:				#2b2a27,
		fg-bold:		#ffffff,
		fg:				mix(#2b2a27, #ffffff, 55%),
		fg-light:		mix(#2b2a27, #ffffff, 70%),
		border:			mix(#2b2a27, #ffffff, 85%)
	)
);
```

- `glightbox` is already wired into `index.html` (CSS link in `<head>`, `class="glightbox"` on gallery anchors) for the trip photo galleries. Verify it's fully working (CDN script include, `GLightbox()` init call in a script tag, `data-gallery` grouping per trip) rather than rebuilding it from scratch.

## Build / compile step (required after any SCSS edit)

This repo uses Dart Sass with the legacy `@import` syntax (deprecation warnings are expected and harmless). After **every** change to anything under `assets/sass/`, recompile:

```bash
npx sass assets/sass/main.scss assets/css/main.css --style=compressed --no-source-map
```

Never hand-edit `assets/css/main.css` directly — it's a build artifact.

## Remaining tasks

1. **Verify and polish the palette rollout.** Recompile CSS, then visually check: header/nav, buttons (`primary`/`secondary`), links, form inputs and focus states, photo gallery hover states. Look for any hardcoded hex colors outside `_vars.scss` (grep `main.scss` for stray `#` hex values not referencing `$palette`) and migrate them to palette references so the theme stays centrally controlled.

2. **Confirm the glightbox galleries work end-to-end** for all four trip sections (USA, Egypt, Portugal, Dolomites): lightbox opens on click, arrow navigation works, each trip is its own `data-gallery` group (not all photos mixed together), captions/alt text if available, and it's keyboard/escape-dismissible. Test on mobile widths too (this template has a slide-out nav at small breakpoints).

3. **Modernize the header/nav interaction** (`assets/js/main.js`, `index.html` `#header` section): the current jQuery slide-out side nav is functional but dated. Light touch only — e.g. smoother transition easing, active-section highlighting on scroll (it may already use `jquery.scrollex` for this — check before re-adding), no full framework rewrite.

4. **Contact form**: currently a plain `<form>` posting to Formspree (`https://formspree.io/f/xrgneoev`). Leave the backend integration as-is; only restyle to match the new palette (already covered if step 1 is done correctly) and add basic client-side validation feedback (required-field states, inline error text) if not already present.

5. **Do not touch**: the content/copy, the CV/thesis PDF links, the Formspree endpoint, image assets themselves, or the underlying grid/layout system (`_vars.scss` breakpoints, `html-grid`).

## Constraints

- Keep changes scoped to `assets/sass/`, `assets/css/main.css` (build output), `assets/js/main.js`, and `index.html`.
- No new build tooling (no webpack/vite/npm framework) — this is a static GitHub Pages site, keep it that way.
- Commit the compiled `main.css` alongside any `.scss` changes since there's no CI build step.
- Test in a local server (e.g. `npx serve .`) before considering a task done — opening `index.html` directly via `file://` can break some asset paths.

## Definition of done

- Site renders with the warm-minimal palette consistently across all sections (header, hero, about, research, photography, contact).
- All four photo galleries open in a working lightbox with correct per-trip grouping.
- No console errors in browser devtools.
- `assets/css/main.css` reflects the latest compiled output of `assets/sass/main.scss`.