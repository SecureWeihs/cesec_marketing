import type { Metadata } from "next";
import { LeitfadenSeite, metadatenFuer, parameterFuer } from "@/components/leitfaden-seite";

/** Leitfäden unter iso-27001, erzeugt aus content/leitfaeden/*.mdx. */
export const dynamicParams = false;

export function generateStaticParams() {
	return parameterFuer("iso-27001");
}

type Eigenschaften = { params: Promise<{ leitfaden: string }> };

export async function generateMetadata({ params }: Eigenschaften): Promise<Metadata> {
	return metadatenFuer("iso-27001", (await params).leitfaden);
}

export default async function Seite({ params }: Eigenschaften) {
	return <LeitfadenSeite saeule="iso-27001" slug={(await params).leitfaden} />;
}
