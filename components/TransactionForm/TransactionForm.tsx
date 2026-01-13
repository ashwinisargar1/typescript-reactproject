import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addTransaction, updateTransaction } from '../../store/slices/transactionSlice';
import { selectCategoriesByType } from '../../store/slices/categorySlice';
import { type Transaction, TransactionType } from '../../types';
import { validateAmount, validateDescription, validateCategory, validateDate } from '../../utils/validators';
import Button from '../UI/Button/Button';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import './TransactionForm.css';

interface TransactionFormProps {
    transaction?: Transaction;
    onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onClose }) => {
    const dispatch = useAppDispatch();
    const [type, setType] = useState<TransactionType>(transaction?.type || TransactionType.EXPENSE);
    const [amount, setAmount] = useState(transaction?.amount.toString() || '');
    const [category, setCategory] = useState(transaction?.category || '');
    const [description, setDescription] = useState(transaction?.description || '');
    const [date, setDate] = useState(
        transaction?.date ? transaction.date.slice(0, 16) : new Date().toISOString().slice(0, 16)
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const categories = useAppSelector((state) => selectCategoriesByType(state, type));

    const { user } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        const newErrors: Record<string, string> = {};
        const amountError = validateAmount(amount);
        const descError = validateDescription(description);
        const catError = validateCategory(category);
        const dateError = validateDate(date);

        if (amountError) newErrors.amount = amountError;
        if (descError) newErrors.description = descError;
        if (catError) newErrors.category = catError;
        if (dateError) newErrors.date = dateError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (transaction) {
            const updatedTransaction: Transaction = {
                ...transaction,
                type,
                amount: parseFloat(amount),
                category,
                description,
                date: new Date(date).toISOString(),
            };
            dispatch(updateTransaction(updatedTransaction));
        } else {
            const newTransaction: Omit<Transaction, 'id' | 'createdAt'> = {
                userId: user.id,
                type,
                amount: parseFloat(amount),
                category,
                description,
                date: new Date(date).toISOString(),
            };
            dispatch(addTransaction(newTransaction));
        }

        onClose();
    };

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        setCategory(''); // Reset category when type changes
    };

    return (
        <form className="transaction-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Transaction Type</label>
                <div className="type-selector">
                    <button
                        type="button"
                        className={`type-btn ${type === TransactionType.INCOME ? 'active income' : ''}`}
                        onClick={() => handleTypeChange(TransactionType.INCOME)}
                    >
                        <ArrowUpCircle size={18} /> Income
                    </button>
                    <button
                        type="button"
                        className={`type-btn ${type === TransactionType.EXPENSE ? 'active expense' : ''}`}
                        onClick={() => handleTypeChange(TransactionType.EXPENSE)}
                    >
                        <ArrowDownCircle size={18} /> Expense
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount *</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className={errors.amount ? 'error' : ''}
                />
                {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={errors.category ? 'error' : ''}
                >
                    <option value="" style={{ color: '#fff', background: '#2d2d2d' }}>Select a category</option>
                    {categories.map((cat) => (
                        <option
                            key={cat.name}
                            value={cat.name}
                            style={{ color: cat.color || '#fff', background: '#2d2d2d' }}
                        >
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter transaction details..."
                    rows={3}
                    className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="date">Date & Time *</label>
                <input
                    type="datetime-local"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-actions">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    {transaction ? 'Update' : 'Add'} Transaction
                </Button>
            </div>
        </form>
    );
};

export default TransactionForm;
