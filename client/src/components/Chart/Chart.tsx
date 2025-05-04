import { FC, useMemo, useState } from "react";
import styles from "./Chart.module.scss";

interface ChartConfig {
    width: number;
    height: number;
    gridSize: number;
    pointRadius: number;
    strokeWidth: number;
}

interface ChartProps {
    fromCurrency: string;
    toCurrency: string;
}

interface ExchangeRateData {
    [key: string]: {
        [currency: string]: number;
    };
}

interface ApiResponse {
    data: ExchangeRateData;
}

const MONTHS = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"] as const;

const CONFIG: ChartConfig = {
    width: 100,
    height: 50,
    gridSize: 10,
    pointRadius: 1.5,
    strokeWidth: 1,
};

const CurrencyChart: FC<ChartProps> = ({ fromCurrency, toCurrency }) => {
    const [points, setPoints] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const grid = useMemo(() => {
        const lines = [];
        for (let i = 0; i <= CONFIG.width; i += CONFIG.gridSize) {
            lines.push(
                <line
                    key={`v${i}`}
                    x1={i}
                    y1={0}
                    x2={i}
                    y2={CONFIG.height}
                    stroke="#444"
                    strokeWidth="0.1"
                />
            );
            if (i <= CONFIG.height) {
                lines.push(
                    <line
                        key={`h${i}`}
                        x1={0}
                        y1={i}
                        x2={CONFIG.width}
                        y2={i}
                        stroke="#444"
                        strokeWidth="0.1"
                    />
                );
            }
        }
        return lines;
    }, []);

    const labels = useMemo(() => {
        if (points.length === 0) return [];

        const maxValue = Math.max(...points);
        const minValue = Math.min(...points);
        const step = (maxValue - minValue) / 5;

        const monthLabels = MONTHS.map((month, index) => (
            <text
                key={`month${index}`}
                x={index * (CONFIG.width / (MONTHS.length - 1))}
                y={CONFIG.height + 2}
                fontSize="2"
                fill="#FFF"
                textAnchor="middle"
            >
                {month}
            </text>
        ));

        const valueLabels = Array.from(
            { length: 6 },
            (_, i) => minValue + step * i
        ).map((value) => (
            <text
                key={`value${value}`}
                x={-4}
                y={
                    CONFIG.height -
                    ((value - minValue) / (maxValue - minValue)) * CONFIG.height
                }
                fontSize="2"
                fill="#FFF"
                textAnchor="end"
            >
                {value.toFixed(2)}
            </text>
        ));

        return [...monthLabels, ...valueLabels];
    }, [points]);

    const chartPoints = useMemo(() => {
        if (points.length === 0 || points.some(isNaN)) return [];

        const pointWidth = CONFIG.width / (MONTHS.length - 1);
        const maxValue = Math.max(...points);
        const minValue = Math.min(...points);

        return points.map((point, index) => {
            const normalizedY =
                ((point - minValue) / (maxValue - minValue)) * CONFIG.height;
            return (
                <circle
                    key={`point${index}`}
                    cx={index * pointWidth}
                    cy={CONFIG.height - normalizedY}
                    r={CONFIG.pointRadius}
                    fill="#ff4500"
                />
            );
        });
    }, [points]);

    const polylinePoints = useMemo(() => {
        if (points.length === 0 || points.some(isNaN)) return "";

        const pointWidth = CONFIG.width / (MONTHS.length - 1);
        const maxValue = Math.max(...points);
        const minValue = Math.min(...points);

        return points
            .map((point, index) => {
                const normalizedY =
                    ((point - minValue) / (maxValue - minValue)) *
                    CONFIG.height;
                return `${index * pointWidth},${CONFIG.height - normalizedY}`;
            })
            .join(" ");
    }, [points]);

    const handleGenerateChart = () => {
        setIsInitialLoad(false);
        setLoading(true);
        fetchData();
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const currentYear = new Date().getFullYear();
            const requests = Array.from({ length: 6 }, (_, i) => {
                const date = `${currentYear - 1}-${String(i * 2 + 1).padStart(
                    2,
                    "0"
                )}-01`;
                return fetch(
                    `/api/currency/historical?date=${date}&base_currency=${fromCurrency}&currencies=${toCurrency}`
                );
            });

            const responses = await Promise.all(requests);
            const results = await Promise.all(
                responses.map((res) => res.json())
            );

            const rates = results.map((data: ApiResponse) => {
                const rateObj = Object.values(data.data)[0];
                return rateObj?.[toCurrency] ?? NaN;
            });

            const validRates = rates.filter((rate) => !isNaN(rate));
            if (validRates.length === 0)
                throw new Error("No valid rates found");

            setPoints(validRates);
        } catch (err) {
            setError("Failed to load data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (isInitialLoad) {
        return (
            <div className={styles.wrapper}>
                <button
                    className={styles.chartButton}
                    onClick={handleGenerateChart}
                >
                    Generate a schedule
                </button>
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (points.length === 0) return <div>No data available</div>;

    return (
        <>
            <div className={styles.wrapper}>
                <svg
                    viewBox={`-10 -5 ${CONFIG.width + 15} ${
                        CONFIG.height + 10
                    }`}
                    preserveAspectRatio="none"
                    className={styles.chart}
                >
                    <g className={styles.grid}>{grid}</g>
                    <g className={styles.labels}>{labels}</g>
                    <polyline
                        className={styles.line}
                        fill="none"
                        stroke="#3500D3"
                        strokeWidth={CONFIG.strokeWidth}
                        points={polylinePoints}
                    />
                    <g className={styles.points}>{chartPoints}</g>
                </svg>
            </div>
            <button
                className={styles.chartButton}
                onClick={handleGenerateChart}
            >
                Update the schedule
            </button>
        </>
    );
};

export default CurrencyChart;
