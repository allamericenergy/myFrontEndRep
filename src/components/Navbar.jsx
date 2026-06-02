import { React, useState } from 'react';
import {
    useNavigate
} from 'react-router-dom';
import './Navbar.css';

function Navbar({

    title = 'Dashboard',

}) {
    const navigate = useNavigate();
    const [showDropdown,
        setShowDropdown] =
        useState(false);
    const logout = () => {

        localStorage.removeItem('token');

        navigate('/');

    };
    return (

        <div className="top-navbar">
            {/* Logo */}
            <div className="nav-left">
                <img
                    src="Logo.jpg"
                    alt="Logo"
                    className="nav-logo"
                />
            </div>


            {/* Menu */}
            <ul className="nav-menu">

                <li
                    className={
                        location.pathname === '/admin'
                            ? 'active'
                            : ''
                    }

                    onClick={() => navigate('/admin')}
                >
                    Dashboard
                </li>

                <li
                    className={
                        location.pathname === '/companies'
                            ? 'active'
                            : ''
                    }

                    onClick={() =>
                        navigate('/companies')
                    }
                >
                    Companies
                </li>

                <li
                    className={
                        location.pathname === '/meters'
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        navigate('/meters')
                    }
                >
                    Meters
                </li>

                <li
                    className={
                        location.pathname === '/members'
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        navigate('/members')
                    }
                >
                    People
                </li>

                <li
                    className={
                        location.pathname === '/contracts'
                            ? 'active'
                            : ''
                    }
                     onClick={() =>
                        navigate('/contracts')
                    }
                >
                    Contracts
                </li>

                <li
                    className={
                        location.pathname === '/billing'
                            ? 'active'
                            : ''
                    }
                >
                    Billing
                </li>

                <li
                    className={
                        location.pathname === '/reports'
                            ? 'active'
                            : ''
                    }
                >
                    Reports
                </li>

            </ul>
            {/* User Dropdown */}
            <div className="profile-wrapper">
                <div className="profile-box" onClick={() => setShowDropdown(prev => !prev)} >
                    <img src="https://i.pravatar.cc/100" alt="Admin" />
                    <div>
                        <h4>Admin</h4>
                        <span>Administrator</span>
                    </div>
                </div>
                {
                    showDropdown && (
                        <div className="dropdown">
                            <div className="dropdown-item"> 👤 My Account </div>
                            <div className="dropdown-item"> ⚙️ Settings </div>
                            <div className="dropdown-item logout" onClick={logout} > 🚪 Logout </div>
                        </div>
                    )}
            </div>
        </div>

    );

}

export default Navbar;