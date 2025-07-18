import { NavigationMenu } from "@/app/core/menu/components/mobile-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
			<NavigationMenu />
		</div>
	);
}
