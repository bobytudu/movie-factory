import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import puppeteer from 'puppeteer'

function corsProxyPlugin() {
  return {
    name: 'cors-proxy-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/proxy')) {
          let browser;
          try {
            const urlParams = new URL(req.url, 'http://localhost').searchParams;
            const targetUrl = urlParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing url parameter' }));
              return;
            }

            // Launch Puppeteer headless browser to render JavaScript on target page
            browser = await puppeteer.launch({
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            
            // Navigate and wait for content to render
            await page.goto(targetUrl, {
              waitUntil: 'networkidle2',
              timeout: 30000
            });

            const htmlContent = await page.content();
            await browser.close();

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(htmlContent);
          } catch (error: any) {
            console.error('Puppeteer scraper error:', error);
            if (browser) {
              try {
                await browser.close();
              } catch (e) {
                console.error('Failed to close browser:', e);
              }
            }
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    corsProxyPlugin(),
  ],
})
