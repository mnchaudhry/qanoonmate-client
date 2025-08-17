import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const earnings = [
  { date: "2025-07-14", client: "Ahsan Khalid", type: "Video Call", duration: "30 mins", amount: 2500, status: "Paid" },
  { date: "2025-07-12", client: "Fatima Noor", type: "Chat", duration: "15 mins", amount: 1000, status: "Paid" },
  { date: "2025-07-10", client: "Bilal Rehman", type: "Call", duration: "45 mins", amount: 3000, status: "Paid" },
  { date: "2025-07-08", client: "LegalAI Referral", type: "Chat", duration: "20 mins", amount: 1500, status: "Pending" },
];

export default function EarningsBreakdownTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead>Date</TableHead>
          <TableHead>Client Name</TableHead>
          <TableHead>Session Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Amount (Rs.)</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {earnings.map((row, i) => (
          <TableRow key={i}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.client}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>{row.duration}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>
              <span className={cn(
                "px-2 py-1 rounded text-xs font-semibold border",
                row.status === "Paid" ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"
              )}>
                {row.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 