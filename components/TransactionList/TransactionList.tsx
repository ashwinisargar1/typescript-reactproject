import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectFilteredTransactions, deleteTransaction, setFilters } from '../../store/slices/transactionSlice';
import { selectAllCategories } from '../../store/slices/categorySlice';
import { type Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../UI/Card/Card';
import Modal from '../UI/Modal/Modal';
import TransactionForm from '../TransactionForm/TransactionForm';
import { Edit2, Trash2, Search, FileQuestion } from 'lucide-react';
import CategoryIcon from '../UI/CategoryIcon';
import './TransactionList.css';

const TransactionList: React.FC = () => {
    const dispatch = useAppDispatch();
    const transactions = useAppSelector(selectFilteredTransactions);
    const filters = useAppSelector((state) => state.transactions.filters);
    const categories = useAppSelector((state) => {
        const allCats = selectAllCategories(state);
        if (filters.type) {
            return allCats.filter(cat => cat.type === filters.type);
        }
        return allCats;
    });

    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            dispatch(deleteTransaction(id));
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value };
        if (key === 'type') {
            newFilters.category = undefined;
        }
        dispatch(setFilters(newFilters));
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        handleFilterChange('searchTerm', value);
    };

    const getCategoryIconName = (categoryName: string) => {
        const category = categories.find((cat) => cat.name === categoryName);
        return category?.icon || 'HelpCircle';
    };

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find((cat) => cat.name === categoryName);
        return category?.color || '#667eea';
    };

    return (
        <div className="transaction-list-container">
            <div className="list-header">
                <h2>Transactions</h2>
                <div className="list-filters">
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="date-filters">
                        <input
                            type="datetime-local"
                            value={filters.startDate || ''}
                            onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                            className="filter-date"
                            title="Start Date"
                        />
                        <span className="date-separator">to</span>
                        <input
                            type="datetime-local"
                            value={filters.endDate || ''}
                            onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                            className="filter-date"
                            title="End Date"
                        />
                    </div>
                    <select
                        value={filters.type || ''}
                        onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                        className="filter-select"
                    >
                        <option value="" style={{ color: '#fff', background: '#2d2d2d' }}>All Types</option>
                        <option value={TransactionType.INCOME} style={{ color: '#38ef7d', background: '#2d2d2d' }}>Income</option>
                        <option value={TransactionType.EXPENSE} style={{ color: '#f5576c', background: '#2d2d2d' }}>Expense</option>
                    </select>
                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                        className="filter-select"
                    >
                        <option value="" style={{ color: '#fff', background: '#2d2d2d' }}>All Categories</option>
                        {categories.map((cat) => (
                            <option
                                key={cat.id}
                                value={cat.name}
                                style={{ color: cat.color || '#fff', background: '#2d2d2d' }}
                            >
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            {transactions.length === 0 ? (
                <Card className="empty-state">
                    <div className="empty-icon">
                        <FileQuestion size={64} color="#667eea" />
                    </div>
                    <h3>No transactions found</h3>
                    <p>Start by adding your first transaction!</p>
                </Card>
            ) : (
                <div className="transaction-list">
                    {transactions.map((transaction) => (
                        <Card key={transaction.id} className="transaction-item">
                            <div className="transaction-info">
                                <div
                                    className="transaction-icon"
                                    style={{ background: getCategoryColor(transaction.category) }}
                                >
                                    <CategoryIcon name={getCategoryIconName(transaction.category)} size={20} color="#fff" />
                                </div>
                                <div className="transaction-details">
                                    <h4>{transaction.description}</h4>
                                    <div className="transaction-meta">
                                        <span className="transaction-category">{transaction.category}</span>
                                        <span className="transaction-date">{formatDate(transaction.date)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="transaction-actions">
                                <span
                                    className={`transaction-amount ${transaction.type === TransactionType.INCOME ? 'income' : 'expense'
                                        }`}
                                >
                                    {transaction.type === TransactionType.INCOME ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                </span>
                                <div className="action-buttons">
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => handleEdit(transaction)}
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(transaction.id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <TransactionForm transaction={editingTransaction || undefined} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default TransactionList;
