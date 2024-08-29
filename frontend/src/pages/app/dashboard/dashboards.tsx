import { Helmet } from "react-helmet-async";
import { MonthCanceledEventsAmountCard } from "./month-canceled-events-amount";
import { MonthEventsAmountCard } from "./month-events-amount-card";
import { MonthRevenueCard } from "./month-revenue-card";
import { CategoriaEventosChart } from "./categories-events-chart";
import { MovimentacaoInscricoesMes,  } from "./movimentacao_inscricoes_mes";
import { TotalEventosAbertoCard } from "./events-ativos-amount-card";

export function Dashboard() {
    return (
        <>
            <Helmet title="Dashboard" />
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl tracking-tight font-bold">Dashboard</h1>


                <div className="grid grid-cols-4 gap-4">
                    <MonthEventsAmountCard />
                    <TotalEventosAbertoCard />
                    <MonthRevenueCard />
                    <MonthCanceledEventsAmountCard />
                </div>

                <div className="grid grid-cols-9 gap-4">
                    <MovimentacaoInscricoesMes />
                    <CategoriaEventosChart />
                </div>
            </div>
        </>
    );
}