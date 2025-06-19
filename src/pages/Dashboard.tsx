import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    BarChart,
    Bar,
    Tooltip,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MenuButton from "@/components/MenuButton";
import Spinner from "@/components/Spinner";

function MetricCard({
    title,
    value,
    change,
    period,
}: {
    title: string;
    value: string;
    change: string;
    period: string;
}) {
    const isPositive = !change.includes("-");

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
                {title}
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {value}
                </span>
                <span
                    className={`flex items-center text-sm ${
                        isPositive ? "text-green-500" : "text-red-500"
                    }`}
                >
                    <ArrowUpRight
                        className={`h-4 w-4 ${!isPositive && "rotate-90"}`}
                    />
                    {change}
                </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                vs previous {period}
            </p>
        </div>
    );
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [ebitdaData, setEbitdaData] = useState<
        { day: number; revenue: number; costs: number }[]
    >([]);
    const [profitMarginData, setProfitMarginData] = useState<
        { month: string; value: number }[]
    >([]);
    const [debtEquityData, setDebtEquityData] = useState<
        { month: string; equity: number; debt: number }[]
    >([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        setTimeout(() => {
            setEbitdaData(
                Array.from({ length: 30 }, (_, i) => ({
                    day: i + 1,
                    revenue: Math.random() * 2000 + 1000,
                    costs: Math.random() * 1500 + 500,
                }))
            );
            setProfitMarginData([
                { month: "Jan", value: 4 },
                { month: "Feb", value: 9 },
                { month: "Mar", value: 12 },
                { month: "Apr", value: 9 },
                { month: "May", value: 3 },
                { month: "Jun", value: 4 },
            ]);
            setDebtEquityData([
                { month: "Jan", equity: 5, debt: 2 },
                { month: "Feb", equity: 7, debt: 3 },
                { month: "Mar", equity: 4, debt: 2 },
                { month: "Apr", equity: 2, debt: 1 },
                { month: "May", equity: 4, debt: 2 },
                { month: "Jun", equity: 5, debt: 2 },
            ]);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 z-50 shadow-md flex justify-between items-center mb-8 p-4 rounded-md">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Data Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <MenuButton />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Earnings Before Interest, Taxes, Depreciation, and
                        Amortization (EBITDA)
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ebitdaData}>
                                <defs>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#86efac"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#86efac"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorCosts"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#fca5a5"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#fca5a5"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#374151"
                                />
                                <XAxis dataKey="day" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        border: "none",
                                        borderRadius: "0.5rem",
                                        color: "#F9FAFB",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#22c55e"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="costs"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorCosts)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Net Profit Margin
                        </h2>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={profitMarginData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#374151"
                                    />
                                    <XAxis dataKey="month" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            color: "#F9FAFB",
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#60a5fa" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Debt-to-Equity Ratio
                        </h2>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={debtEquityData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#374151"
                                    />
                                    <XAxis dataKey="month" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            color: "#F9FAFB",
                                        }}
                                    />
                                    <Bar
                                        dataKey="equity"
                                        stackId="a"
                                        fill="#60a5fa"
                                    />
                                    <Bar
                                        dataKey="debt"
                                        stackId="a"
                                        fill="#f87171"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <MetricCard
                            title="Revenue"
                            value="$24.5M"
                            change="+1.3%"
                            period="7 days"
                        />
                        <MetricCard
                            title="Avg Profit Margin"
                            value="9.5%"
                            change="+1%"
                            period="7 days"
                        />
                        <MetricCard
                            title="Return On Investment (ROI)"
                            value="19.1%"
                            change="+8%"
                            period="7 days"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
