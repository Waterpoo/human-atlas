import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser',timeout:90000,use:{baseURL:'http://127.0.0.1:3016',launchOptions:{args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}},webServer:{command:'npx vite preview --host 127.0.0.1 --port 3016',port:3016,reuseExistingServer:!process.env.CI}});
