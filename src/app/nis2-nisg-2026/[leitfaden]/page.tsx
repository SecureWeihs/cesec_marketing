import type { Metadata } from "next";
import { LeitfadenSeite, metadatenFuer, parameterFuer } from "@/components/leitfaden-seite";

/** Leitfäden unter nis2-nisg-2026, erzeugt aus content/leitfaeden/*.mdx. */
export const dynamicParams = false;

export function generateStaticParams() {
	return parameterFuer("nis2-nisg-2026");
}

type Eigenschaften = { params: Promise<{ leitfaden: string }> };

export async function generateMetadata({ params }: Eigenschaften): Promise<Metadata> {
	return metadatenFuer("nis2-nisg-2026", (await params).leitfaden);
}

export default async function Seite({ params }: Eigenschaften) {
	return <LeitfadenSeite saeule="nis2-nisg-2026" slug={(await params).leitfaden} />;
}
