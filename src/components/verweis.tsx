import Link from "next/link";
import { istVerfuegbar } from "@/lib/navigation";

/**
 * Verweis, der nur dann ein Verweis ist, wenn es das Ziel schon gibt.
 * Sonst bleibt der Text stehen, ohne Link — kein 404 für Leser, kein
 * fehlschlagender Vorab-Abruf durch Next.
 */
export function Verweis({
	pfad,
	children,
	klasse,
}: {
	pfad: string;
	children: React.ReactNode;
	klasse?: string;
}) {
	if (!istVerfuegbar(pfad)) return <span className={klasse}>{children}</span>;
	return (
		<Link href={pfad} className={klasse}>
			{children}
		</Link>
	);
}
