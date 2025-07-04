import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FixedExpense {
	name: string;
	amount: string;
}

interface FixedExpensesFormProps {
	fixedExpenses: string[];
	onFixedExpensesChange: (fixedExpenses: string[]) => void;
}

export function FixedExpensesForm({
	fixedExpenses,
	onFixedExpensesChange,
}: FixedExpensesFormProps) {
	const [expenses, setExpenses] = useState<FixedExpense[]>([]);
	const [expenseName, setExpenseName] = useState("");
	const [amount, setAmount] = useState("");

	const handleAddExpense = () => {
		if (!expenseName.trim() || !amount.trim()) return;
		setExpenses([...expenses, { name: expenseName, amount }]);
		setExpenseName("");
		setAmount("");
		onFixedExpensesChange([...fixedExpenses, expenseName]);
	};

	const handleRemoveExpense = (index: number) => {
		setExpenses(expenses.filter((_, i) => i !== index));
	};

	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-medium text-base">Fixed Expenses</h3>
			<div className="flex gap-2">
				<Input
					placeholder="Expense name"
					value={expenseName}
					onChange={(e) => setExpenseName(e.target.value)}
				/>
				<Input
					placeholder="Amount"
					type="number"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
				/>
				<Button onClick={handleAddExpense}>Add</Button>
			</div>
			<ul className="flex flex-col gap-2">
				{expenses.map((expense, index) => (
					<li
						key={expense.name}
						className="flex justify-between items-center border p-2 rounded"
					>
						<span>
							{expense.name}: ${expense.amount}
						</span>
						<Button
							size="sm"
							variant="destructive"
							onClick={() => handleRemoveExpense(index)}
						>
							Delete
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}
