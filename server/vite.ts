import { createServer as createViteServer } from "vite";
import type { ViteDevServer } from "vite";
import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupVite(app: Express, server: Server): Promise<void> {
  const vite: ViteDevServer = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        server,
      },
      allowedHosts: "all", // ✅ Fixes type issue
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const template = await vite.transformIndexHtml(
        url,
        `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vivaly</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
      `
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (err) {
      vite.ssrFixStacktrace(err as Error);
      next(err);
    }
  });
}
