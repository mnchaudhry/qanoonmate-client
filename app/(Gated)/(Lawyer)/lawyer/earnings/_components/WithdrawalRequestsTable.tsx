import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const withdrawals = [
    { date: "2025-07-01", amount: 10000, bank: "Meezan Bank •••• 2401", status: "Completed", action: "View Details" },
    { date: "2025-06-18", amount: 5000, bank: "HBL •••• 8832", status: "Rejected", action: "View Reason" },
    { date: "2025-06-01", amount: 8000, bank: "Meezan Bank •••• 2401", status: "Processing", action: "Cancel" },
];

export default function WithdrawalRequestsTable() {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted">
                        <TableHead>Request Date</TableHead>
                        <TableHead>Amount (Rs.)</TableHead>
                        <TableHead>Bank Account</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {withdrawals.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                            <TableCell>{row.bank}</TableCell>
                            <TableCell>
                                <span className={cn(
                                    "px-2 py-1 rounded text-xs font-semibold border",
                                    row.status === "Completed" && "bg-primary-100 text-primary-800 border-primary-200",
                                    row.status === "Rejected" && "bg-destructive-100 text-destructive-800 border-destructive-200",
                                    row.status === "Processing" && "bg-yellow-100 text-yellow-800 border-yellow-200"
                                )}>
                                    {row.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button variant={row.action === "Cancel" ? "destructive" : "outline"} size="sm">{row.action}</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-end px-4 py-3">
                <Button variant="default" size="sm">+ Request New Withdrawal</Button>
            </div>
        </>
    );
} 