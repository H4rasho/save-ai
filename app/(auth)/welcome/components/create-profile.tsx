import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface CreateProfileProps {
	onSubmit: () => void;
	isLoading: boolean;
}

export function CreateProfile({ onSubmit, isLoading }: CreateProfileProps) {
	return (
		<div className="flex flex-col gap-4 items-center">
			<h3 className="font-medium text-sm sm:text-base">Create your Profile</h3>
			<p className="text-muted-foreground text-center max-w-xs text-xs sm:text-sm">
				You are almost done! Please review your information and create your
				profile to get started with Save IA.
			</p>
			<Button
				type="submit"
				className="mt-4 w-full max-w-xs text-xs sm:text-sm"
				onClick={onSubmit}
			>
				{isLoading ? <Spinner className="mr-2" /> : "Create Profile"}
			</Button>
		</div>
	);
}
