import React from 'react';
import { useAppSelector } from '../../store';
import { selectSummaryStats } from '../../store/slices/transactionSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../UI/Card/Card';
import './Charts.css';

const IncomeExpenseChart: React.FC = () => {
    const stats = useAppSelector(selectSummaryStats);

    const data = stats.monthlyData.map((item) => ({
        month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        Income: item.income,
        Expenses: item.expenses,
    }));

    if (data.length === 0) {
        return (
            <Card className="chart-card">
                <h3 className="chart-title">Income vs Expenses</h3>
                <div className="chart-empty">
                    <p>No data available yet. Add some transactions to see the chart!</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="chart-card">
            <h3 className="chart-title">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(20, 20, 40, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="Income" fill="#38ef7d" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Expenses" fill="#f5576c" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default IncomeExpenseChart;
