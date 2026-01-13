import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { logout } from '../../../store/slices/authSlice';
import type { RootState } from '../../../types';
import './Navbar.css';

const Navbar: React.FC = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <LayoutDashboard size={24} />
                <span>FinanceTracker</span>
            </div>
            <div className="navbar-links">
                <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>
                <Link
                    to="/transactions"
                    className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}
                >
                    <Receipt size={18} />
                    Transactions
                </Link>
            </div>
            <div className="navbar-user">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
