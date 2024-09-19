import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketCheck } from "lucide-react";

export function MonthRevenueCard() {
    return (
        <Card>
            <CardHeader className="flex-row items-center space-y-0 justify-between pb-2">
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">Eventos em Destaque:</span>
            </CardContent>
        </Card>
    );
}