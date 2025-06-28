import type { ServerOptions } from "vite";
import type { Server } from "http";

export function getViteConfig(server: Server): ServerOptions {
  return {
    middlewareMode: true,
    hmr: {
      server,
    },
    allowedHosts: true as true, // Fix type error here
  };
}
