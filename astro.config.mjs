// @ts-check
import { defineConfig, sharpImageService } from "astro/config";
import { WEBSLAB_PROJECT, WEBSLAB_SITE } from "$lib/consts.ts";

import lit from "@astrojs/lit";
import purgecss from "astro-purgecss";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
	devToolbar: { enabled: false },

	site: WEBSLAB_SITE,
	server: {
		port: 3000,
	},

	vite: {
		esbuild: {
			target: "es2021",
		},

		server: {
			proxy: {
				"/filefind": {
					target: WEBSLAB_SITE,
					changeOrigin: true,
					secure: false,
				},

				["/" + WEBSLAB_PROJECT]: {
					target: WEBSLAB_SITE,
					changeOrigin: true,
					secure: false,
				},
			},
			cors: false,
		},

		build: {
			rollupOptions: {
				external: [
					"sharp",
				],
			},
		},
	},

	image: {
		service: sharpImageService(),
		remotePatterns: [{ protocol: "https" }],
	},

	integrations: [
		lit(),
		solidJs(),
		sitemap(),

		AstroPWA({
			mode: "production",
			base: "/",
			scope: "/",
			selfDestroying: true,
			includeAssets: ["favicon.svg"],
			registerType: "autoUpdate",

			manifest: {
				id: "/",
				description: "Base for WebsLab projects",
				display_override: ["fullscreen", "minimal-ui"],
				display: "standalone",
				name: "WebsLab Base",
				short_name: "Base",

				background_color: "#ffffff",
				theme_color: "#613583",

				icons: [
					{
						src: "/favicon.svg",
						sizes: "512x512",
						type: "image/svg+xml",
					},
				],
			},

			pwaAssets: { config: true },

			workbox: {
				navigateFallback: "/",
				globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
			},

			devOptions: {
				enabled: true,
				navigateFallbackAllowlist: [/^\/$/],
			},

			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
		}),

		purgecss({
			keyframes: false,

			safelist: {
				standard: [/^jodit/, /article-video/],
				greedy: [/*astro*/],
				deep: [
					/dropdown-menu-end/,
				],
			},
		}),
	],
});
