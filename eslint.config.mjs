import coreWebVitals from "eslint-config-next/core-web-vitals";

const konfiguration = [
	{ ignores: [".next/**", "node_modules/**", "src/generated/**"] },
	...coreWebVitals,
	{
		rules: {
			// Bilder laufen nach Entscheidung des Inhabers bewusst nicht über
			// next/image, siehe OFFENE-PUNKTE.md E1 Nr. 1.
			"@next/next/no-img-element": "off",
		},
	},
];

export default konfiguration;
