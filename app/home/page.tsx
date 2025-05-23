import { AddExpenseDialog } from "./AddExpenseDialog";
import { client } from "@/database/database";
import { AddExpenseFromFile } from "./add-expense-from-file";
import { unstable_cache } from "next/cache";

const getExpenses = unstable_cache(
  async () => {
    const expenses = await client.execute({
      sql: `SELECT expenses.id, expenses.name, expenses.amount, categories.name as category, expenses.created_at as date FROM expenses
    INNER JOIN categories ON expenses.category_id = categories.id`,
    });
    return expenses.rows.map((expense) => ({
      id: expense.id,
      moveType: "expense",
      category: expense.category as string,
      description: expense.name as string,
      date: expense.date as string,
      amount: Number(expense.amount),
    }));
  },
  ["expenses"],
  { tags: ["expenses"] },
);

import { redirect } from "next/navigation";
import SummaryCard from "./summary-card";
import { BanknoteArrowDown, BanknoteArrowUp, Scale } from "lucide-react";
import MovementsMobile from "./movements-mobile";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const pageSize = Math.max(1, parseInt(searchParams?.pageSize || "10", 10));

  const totalExpenses = await client.execute({
    sql: `SELECT SUM(amount) as total FROM expenses`,
  });

  const totalIncome = await client.execute({
    sql: `SELECT SUM(amount) as total FROM income_sources`,
  });

  // Fetch paginated expenses
  const expensesResult = await client.execute({
    sql: `SELECT expenses.id, expenses.name, expenses.amount, categories.name as category, expenses.created_at as date FROM expenses
      INNER JOIN categories ON expenses.category_id = categories.id
      ORDER BY expenses.created_at DESC
      LIMIT ? OFFSET ?`,
    args: [pageSize, (page - 1) * pageSize],
  });
  const data = expensesResult.rows.map((expense) => ({
    id: expense.id,
    moveType: "expense",
    category: expense.category as string,
    description: expense.name as string,
    date: expense.date as string,
    amount: Number(expense.amount),
  }));

  const totalExpensesAmount = Number(totalExpenses.rows[0]?.total || 0);
  const totalIncomeAmount = Number(totalIncome.rows[0]?.total || 0);

  // Fetch total count
  const totalCountResult = await client.execute({
    sql: `SELECT COUNT(*) as count FROM expenses`,
  });
  const totalCount = Number(totalCountResult.rows[0]?.count || 0);

  const categories = await client.execute({
    sql: "SELECT * FROM categories",
  });
  const categoriesData = categories.rows.map((category) => ({
    id: Number(category.id),
    name: category.name as string,
  }));

  // Redirect to first page if page is out of range
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (page > totalPages && totalPages > 0) {
    redirect(`?page=1&pageSize=${pageSize}`);
  }

  return (
    <main className="flex flex-col max-w-6xl mx-auto py-10 gap-8">
      <h1 className="text-4xl font-bold mb-4">Home</h1>
      <section>
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="flex gap-4">
          <SummaryCard
            amount={0}
            title="Total Balance"
            icon={<Scale size={48} strokeWidth={2} />}
          ></SummaryCard>
        </div>
      </section>
      <section>
        <div className="flex gap-4 self-end w-full justify-end"></div>
        <MovementsMobile
          data={data}
          totalExpenses={totalExpensesAmount}
          totalIncome={totalIncomeAmount}
        />
      </section>
    </main>
  );
}
