import { NavigationMenu } from "@/app/core/menu/components/mobile-menu";
import { UserProfileCard } from "./home/user-profile-card";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<UserProfileCard />
			<div className="px-4">{children}</div>
			<NavigationMenu />
		</div>
	);
}
