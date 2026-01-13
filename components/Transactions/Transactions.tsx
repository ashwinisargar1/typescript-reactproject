import React from 'react';
import TransactionList from '../TransactionList/TransactionList';
import './Transactions.css';

const Transactions: React.FC = () => {
    return (
        <div className="transactions-page">
            <header className="page-header">
                <h1>All Transactions</h1>
                <p>View, search, and manage your financial history</p>
            </header>
            <TransactionList />
        </div>
    );
};

export default Transactions;
