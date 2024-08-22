import { Helmet } from "react-helmet-async";
import { DayEventsAmountCard } from "./day-events-amount-card";
import { MonthCanceledEventsAmountCard } from "./month-canceled-events-amount";
import { MonthEventsAmountCard } from "./month-events-amount-card";
import { MonthRevenueCard } from "./month-revenue-card";
import { PopularProductsChart } from "./popular-events-chart";
import { RevenueChart } from "./revenue-chart";

export function Dashboard() {
    return (
        <>
            <Helmet title="Dashboard" />
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl tracking-tight font-bold">Dashboard</h1>


                <div className="grid grid-cols-4 gap-4">
                    <MonthEventsAmountCard />
                    <DayEventsAmountCard />
                    <MonthRevenueCard />
                    <MonthCanceledEventsAmountCard />
                </div>

                <div className="grid grid-cols-9 gap-4">
                    <RevenueChart />
                    <PopularProductsChart />
                </div>
            </div>
        </>
    );
}