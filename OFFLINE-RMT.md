# Halo Anatomy — Offline RMT Study Atlas

This fork extends Human Atlas for offline anatomy study with an RMT-focused reference layer.

## Offline use on macOS

1. Install Node.js 22 or newer.
2. Clone this repository and check out `feature/rmt-offline-study` (or `main` after the PR is merged).
3. Run `npm ci`.
4. Run `npm run build`.
5. Run `npm run dev` for development, or serve the generated static build with a local HTTP server.
6. Open the app once while connected. The service worker caches the application, atlas catalogue, and model chunks as they are requested. Previously loaded anatomy remains available without internet access.

For guaranteed first-run offline deployment, keep the complete `public/models` directory with the application. No ZygoteBody assets, credentials, or locked features are used.

## RMT study data

`app/rmt-study.ts` contains structured origin, insertion, action and innervation (OIAI) data for high-yield muscles including trapezius, sternocleidomastoid, rotator cuff, pectoralis major, latissimus dorsi, arm, hip, thigh and lower-leg muscles.

The 3D geometry remains BodyParts3D data and must retain its required attribution. Educational information is for anatomy study and is not diagnostic guidance.
