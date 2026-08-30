import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig(({ command }) => ({
	resolve: {
		tsconfigPaths: true,
	},

	plugins: [
		...(command === "build"
			? [
					cloudflare({
						viteEnvironment: {
							name: "ssr",
						},
					}),
				]
			: []),

		devtools(),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		imagetools(),
	],
}));
