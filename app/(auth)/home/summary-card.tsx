import { ChileFlag } from "@/components/icons/chile-flag";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

interface Props {
	amount: number;
	title: string;
	icon: ReactNode;
}

export default function SummaryCard({ amount, title, icon }: Props) {
	return (
		<Card className="w-full rounded-none border-none">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription className="flex gap-2 text-white justify-between items-center">
					{icon}
					<div className="flex gap-2">
						<p className="text-3xl font-bold ">
							{amount.toLocaleString("es-CL", {
								style: "currency",
								currency: "CLP",
							})}
						</p>
						<small className="flex self-start items-center gap-1 text-s font-regular text-white">
							CLP
							<ChileFlag width={14} />
						</small>
					</div>
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
