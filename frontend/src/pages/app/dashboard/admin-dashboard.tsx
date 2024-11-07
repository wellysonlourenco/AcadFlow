import { Helmet } from "react-helmet-async";
import { CargaHorariaTotalCard } from "./carga-horaria-total-card";
import { CategoriaEventosPizzaChart } from "./categories-events-pizza-chart";
import { TotalEventosAbertoCard } from "./events-ativos-amount-card";
import { MonthEventsAmountCard } from "./month-events-amount-card";
import { MonthRevenueCard } from "./month-revenue-card";
import { EventsInscriptionsChart } from "./movimentacao_inscricao_eventos_grafico";
import { TotalUsuariosCard } from "./total_usuarios_card";

export function AdminDashboard() {
    return (
        <>
            <Helmet title="Dashboard" />
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl tracking-tight font-bold">Dashboards</h1>


                <div className="grid grid-cols-3 gap-4">
                    <MonthEventsAmountCard />
                    <TotalEventosAbertoCard />
                    {/* <MonthRevenueCard /> */}
                    <TotalUsuariosCard />
                </div>

                <div className="grid grid-cols-9 gap-4">
                    <EventsInscriptionsChart />
                    <CategoriaEventosPizzaChart />
                </div>
            </div>
        </>
    );
}