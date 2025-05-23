import { Payment } from "./columns";

interface MovementsMobileProps {
  data: Payment[];
  totalExpenses: number;
  totalIncome: number;
}

export default function MovementsMobile({
  data,
  totalExpenses,
  totalIncome,
}: MovementsMobileProps) {
  return (
    <section className="block sm:hidden  bg-card p-4 rounded-t-2xl">
      <h2 className="font-bold mb-4">Last movements</h2>
      <div className="flex justify-between text-muted-foreground text-sm py-4">
        <div>
          <p className="font-bold">Total Expenses</p>
          <p>
            {totalExpenses.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
        </div>
        <div>
          <p className="font-bold">Total Income</p>
          <p className=" text-right">
            {totalIncome.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
        </div>
      </div>
      {data.slice(0, 5).map((payment, index) => (
        <div key={index} className="flex justify-between py-2">
          <div className="max-w-1/2">
            <p className="text-sm font-semibold">{payment.description}</p>
            <p className="text-xs capitalize">{payment.category}</p>
          </div>
          <p className="text-xs font-semibold self-end">
            <span className="text-xs">
              {payment.moveType === "expense" ? "-" : "+"}
            </span>
            {payment.amount.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
        </div>
      ))}
    </section>
  );
}
