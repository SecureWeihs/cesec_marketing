import coreWebVitals from "eslint-config-next/core-web-vitals";

const konfiguration = [
	{ ignores: [".next/**", "node_modules/**", "src/generated/**"] },
	...coreWebVitals,
	{
		rules: {
			// Bilder laufen nach Entscheidung des Inhabers bewusst nicht über
			// next/image; die CSP erlaubt keine Inline-Styles, die next/image setzt.
			"@next/next/no-img-element": "off",
		},
	},
];

export default konfiguration;
