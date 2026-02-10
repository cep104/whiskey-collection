# App Icon Generation

To generate proper PWA icons, create a 512x512 PNG logo and run:

```bash
# Using sharp (npm install sharp)
npx sharp-cli -i logo-512.png -o icon-192.png resize 192 192
npx sharp-cli -i logo-512.png -o icon-512.png resize 512 512
npx sharp-cli -i logo-512.png -o icon-maskable-192.png resize 192 192
npx sharp-cli -i logo-512.png -o icon-maskable-512.png resize 512 512
```

For now, placeholder SVG icons are used as favicons.
The app will work as a PWA on iOS without PNG icons — just the manifest and meta tags.
