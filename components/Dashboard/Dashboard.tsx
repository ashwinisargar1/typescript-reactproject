import React, { useState } from 'react';
import SummaryCards from '../SummaryCards/SummaryCards';
import IncomeExpenseChart from '../Charts/IncomeExpenseChart';
import CategoryPieChart from '../Charts/CategoryPieChart';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import TransactionForm from '../TransactionForm/TransactionForm';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCategories } from '../../store/slices/categorySlice';
import { fetchTransactions } from '../../store/slices/transactionSlice';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Plus, Receipt } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    React.useEffect(() => {
        if (user) {
            dispatch(fetchCategories());
            dispatch(fetchTransactions(user.id));
        }
    }, [dispatch, user]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">
                        <LayoutDashboard size={32} style={{ marginRight: '0.75rem' }} />
                        Financial Overview
                    </h1>
                    <p className="dashboard-subtitle">Welcome back, {user?.name}! Here is your current status.</p>
                </div>
                <div className="header-actions">
                    <Link to="/transactions" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '1rem' }}>
                        <Receipt size={20} style={{ marginRight: '0.5rem' }} />
                        View All
                    </Link>
                    <Button variant="primary" size="large" onClick={handleOpenModal}>
                        <Plus size={20} style={{ marginRight: '0.5rem' }} />
                        Add Transaction
                    </Button>
                </div>
            </header>

            <SummaryCards />

            <div className="charts-grid">
                <IncomeExpenseChart />
                <CategoryPieChart />
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add Transaction">
                <TransactionForm onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default Dashboard;
