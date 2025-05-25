import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Income {
	id: string;
	source: string;
	amount: string;
}

interface IncomeFormProps {
	incomeSources: Income[];
	onIncomeSourcesChange: (incomeSources: Income[]) => void;
}

export function IncomeForm({
	incomeSources,
	onIncomeSourcesChange,
}: IncomeFormProps) {
	const [incomes, setIncomes] = useState<Income[]>([]);
	const [source, setSource] = useState("");
	const [amount, setAmount] = useState("");

	const handleAddIncome = () => {
		if (!source.trim() || !amount.trim()) return;
		const newIncome = { id: crypto.randomUUID(), source, amount };
		setIncomes([...incomes, newIncome]);
		setSource("");
		setAmount("");
		onIncomeSourcesChange([...incomeSources, newIncome]);
	};

	const handleRemoveIncome = (id: string) => {
		setIncomes(incomes.filter((income) => income.id !== id));
	};

	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-medium text-base">Income</h3>
			<div className="flex gap-2">
				<Input
					placeholder="Income source"
					value={source}
					onChange={(e) => setSource(e.target.value)}
				/>
				<Input
					placeholder="Amount"
					type="number"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
				/>
				<Button onClick={handleAddIncome}>Add</Button>
			</div>
			<ul className="flex flex-col gap-2">
				{incomes.map((income) => (
					<li
						key={income.id}
						className="flex justify-between items-center border p-2 rounded"
					>
						<span>
							{income.source}: ${income.amount}
						</span>
						<Button
							size="sm"
							variant="destructive"
							onClick={() => handleRemoveIncome(income.id)}
						>
							Delete
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}
