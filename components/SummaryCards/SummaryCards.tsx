import React from 'react';
import { useAppSelector } from '../../store';
import { selectSummaryStats } from '../../store/slices/transactionSlice';
import { formatCurrency } from '../../utils/formatters';
import Card from '../UI/Card/Card';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './SummaryCards.css';

const SummaryCards: React.FC = () => {
    const stats = useAppSelector(selectSummaryStats);

    const cards = [
        {
            title: 'Total Income',
            amount: stats.totalIncome,
            icon: ArrowUpRight,
            gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: '#38ef7d',
        },
        {
            title: 'Total Expenses',
            amount: stats.totalExpenses,
            icon: ArrowDownRight,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f5576c',
        },
        {
            title: 'Net Balance',
            amount: stats.balance,
            icon: Wallet,
            gradient:
                stats.balance >= 0
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: stats.balance >= 0 ? '#667eea' : '#f5576c',
        },
    ];

    return (
        <div className="summary-cards">
            {cards.map((card, index) => (
                <Card key={index} className="summary-card">
                    <div className="summary-icon" style={{ background: card.gradient }}>
                        <card.icon size={24} color="#fff" />
                    </div>
                    <div className="summary-content">
                        <h3 className="summary-title">{card.title}</h3>
                        <p className="summary-amount" style={{ color: card.color }}>
                            {formatCurrency(card.amount)}
                        </p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default SummaryCards;
