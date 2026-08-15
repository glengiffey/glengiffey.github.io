# glengiffey.github.io

Personal site for Glen Giffey, served by GitHub Pages at
<https://glengiffey.github.io>.

Hand-written static HTML and CSS. No build step, no framework, no
dependencies: what is in the repository is what is served.

## Contents

- `index.html`, `index.css` - landing page: about, skills, experience,
  education and links. `image/profile.jpg` is the photo. The stylesheet is
  shared by every page.
- `projects.html` - write-ups of the machine learning implementations, with
  figures in `image/`. Source for those lives in the separate `code-vault`
  repository.
- `reflective-teapot.html` - an interactive WebGL demo: a brass teapot that
  reflects a cube-mapped environment. `README.txt` documents its controls.
- `code07.js` - scene setup, geometry, textures and the interaction handlers
  for the teapot demo.
- `shaders_setup.js` - shader compilation and program linking.
- `glMatrix-0.9.5.min.js` - matrix and vector math.
- `teapot.json` - teapot mesh, `brick.png` - surface texture,
  `pos*.jpg` / `neg*.jpg` - the six 1024x1024 cube map faces.
- `favicon.svg` - tab icon. `image/og.png` - the 1200x630 card used for link
  previews, referenced by the Open Graph tags on every page.

## Styling

`index.css` drives all three pages. Every colour resolves through a custom
property on `:root`, with a `prefers-color-scheme: dark` block that redeclares
the values and never the rules, so the two themes cannot drift apart. Adding a
colour means adding a token, not a rule.

Two things in there are easy to break by accident:

- The `pre` scroll shadows fade to the block's own surface colour, not the page
  background, and interpolate to a zero-alpha copy of it rather than to
  `transparent`. Both details matter; the comment above the rule explains why.
- IonQ's brand orange is used unaltered, which only clears WCAG AA because the
  employer line is set at a size that counts as large text. Shrinking that line
  drops it below the threshold.

## Running locally

The teapot demo fetches `teapot.json` over XHR, so it needs to be served over
HTTP rather than opened from the filesystem:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

To check the dark theme without changing your OS setting, open DevTools, run
**Show Rendering** from the command palette, and set **Emulate CSS media
feature prefers-color-scheme**. Avoid the "Auto Dark Mode for Web Contents"
flag: that force-inverts a light page rather than exercising the dark theme,
so it will look roughly right while telling you nothing.
