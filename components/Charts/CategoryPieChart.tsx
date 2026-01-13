import React from 'react';
import { useAppSelector } from '../../store';
import { selectSummaryStats } from '../../store/slices/transactionSlice';
import { TransactionType } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../UI/Card/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import './Charts.css';

const COLORS = ['#667eea', '#f093fb', '#38ef7d', '#f5576c', '#11998e', '#ffa502', '#ff6348', '#5f27cd'];

const CategoryPieChart: React.FC = () => {
    const stats = useAppSelector(selectSummaryStats);
    const [chartType, setChartType] = React.useState<TransactionType>(TransactionType.EXPENSE);

    const breakdown = chartType === TransactionType.INCOME
        ? stats.incomeCategoryBreakdown
        : stats.expenseCategoryBreakdown;

    const data = breakdown.map((item) => ({
        name: item.category,
        value: item.amount,
        percentage: item.percentage,
    }));

    if (data.length === 0) {
        return (
            <Card className="chart-card">
                <div className="chart-header-actions">
                    <h3 className="chart-title">{chartType === TransactionType.INCOME ? 'Income' : 'Expense'} Breakdown</h3>
                    <div className="chart-toggle">
                        <button
                            className={`toggle-btn ${chartType === TransactionType.EXPENSE ? 'active' : ''}`}
                            onClick={() => setChartType(TransactionType.EXPENSE)}
                        >
                            Expense
                        </button>
                        <button
                            className={`toggle-btn ${chartType === TransactionType.INCOME ? 'active' : ''}`}
                            onClick={() => setChartType(TransactionType.INCOME)}
                        >
                            Income
                        </button>
                    </div>
                </div>
                <div className="chart-empty">
                    <p>No {chartType.toLowerCase()} data available yet.</p>
                </div>
            </Card>
        );
    }

    const renderCustomLabel = (entry: any) => {
        return `${entry.name}: ${formatPercentage(entry.percentage)}`;
    };

    return (
        <Card className="chart-card">
            <div className="chart-header-actions">
                <h3 className="chart-title">{chartType === TransactionType.INCOME ? 'Income' : 'Expense'} Breakdown</h3>
                <div className="chart-toggle">
                    <button
                        className={`toggle-btn ${chartType === TransactionType.EXPENSE ? 'active' : ''}`}
                        onClick={() => setChartType(TransactionType.EXPENSE)}
                    >
                        Expense
                    </button>
                    <button
                        className={`toggle-btn ${chartType === TransactionType.INCOME ? 'active' : ''}`}
                        onClick={() => setChartType(TransactionType.INCOME)}
                    >
                        Income
                    </button>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => formatCurrency(Number(value))}
                        contentStyle={{
                            background: 'rgba(20, 20, 40, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default CategoryPieChart;
