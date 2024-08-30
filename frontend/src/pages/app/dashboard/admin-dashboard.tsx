import { Helmet } from "react-helmet-async";
import { CategoriaEventosPizzaChart } from "./categories-events-pizza-chart";
import { TotalEventosAbertoCard } from "./events-ativos-amount-card";
import { MonthCanceledEventsAmountCard } from "./month-canceled-events-amount";
import { MonthEventsAmountCard } from "./month-events-amount-card";
import { MonthRevenueCard } from "./month-revenue-card";
import { MovimentacaoInscricoesMes, } from "./movimentacao_inscricoes_mes";

export function AdminDashboard() {
    return (
        <>
            <Helmet title="Dashboard" />
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl tracking-tight font-bold">Dashboards</h1>


                <div className="grid grid-cols-4 gap-4">
                    <MonthEventsAmountCard />
                    <TotalEventosAbertoCard />
                    <MonthRevenueCard />
                    <MonthCanceledEventsAmountCard />
                </div>

                <div className="grid grid-cols-9 gap-4">
                    <MovimentacaoInscricoesMes />
                    <CategoriaEventosPizzaChart />
                </div>
            </div>
        </>
    );
}