import { Button } from "@/components/ui/button";

export default function EarningsOverview() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 bg-muted rounded-xl p-6 flex flex-col gap-2 border !border-border">
        <div className="text-lg font-semibold">Total Earnings: <span className="text-primary font-bold">Rs. 85,000</span></div>
        <div className="text-sm text-muted-foreground">Completed Consultations: <span className="font-medium text-foreground">32</span></div>
        <div className="text-sm text-muted-foreground">Pending Withdrawals: <span className="font-medium text-foreground">Rs. 5,000</span></div>
      </div>
      <div className="flex items-end md:items-start">
        <Button className="w-full md:w-auto" variant="default">Withdraw Funds</Button>
      </div>
    </div>
  );
} 