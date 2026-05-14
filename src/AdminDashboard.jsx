import React, {
    useEffect,
    useState
} from 'react';
import './AdminDashboard.css';
import CompaniesGrid from './CompaniesGrid';


function AdminDashboard() {
    const [showDropdown, setShowDropdown] =
        useState(false);

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const [totalCompanies, setTotalCompanies] =
        useState(0);
    const [totalMeters, setTotalMeters] = useState(0);
    const [totalPeople, setTotalPeople] = useState(0);
    const [totalContracts, setTotalContracts] = useState(0);
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetchCompanies();
        fetchMeters();
        fetchPeople();
        fetchContracts();

    }, []);

    const fetchCompanies = async () => {

        try {

            const token =
                localStorage.getItem('token');

            const res = await fetch(
                `${API}/api/auth/total-companies`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            setTotalCompanies(data.total);

        } catch (error) {

            console.log(error);

        }
    };

    const fetchMeters = async () => {

        try {
            const token =
                localStorage.getItem('token');
            const res = await fetch(
                `${API}/api/auth/total-meters`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();

            setTotalMeters(data.total);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPeople = async () => {

        try {
            const token =
                localStorage.getItem('token');
            const res = await fetch(
                `${API}/api/auth/total-people`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();

            setTotalPeople(data.total);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchContracts = async () => {

        try {
            const token =
                localStorage.getItem('token');
            const res = await fetch(
                `${API}/api/auth/total-contracts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();

            setTotalContracts(data.total);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="dashboard-container">

            {/* Top Navigation */}
            <div className="top-navbar">

                {/* Logo */}
                <div className="nav-left">
                    <img
                        src="/assets/Logo.jpg"
                        alt="Logo"
                        className="nav-logo"
                    />

                </div>

                {/* Menu */}
                <ul className="nav-menu">

                    <li className="active">
                        Dashboard
                    </li>
                    <li>
                        Companies
                    </li>
                    <li>
                        Meters
                    </li>

                    <li>
                        People
                    </li>

                    <li>
                        Contracts
                    </li>

                    <li>
                        Billing
                    </li>

                    <li>
                        Reports
                    </li>

                </ul>

                {/* User Dropdown */}
                <div className="profile-wrapper">

                    <div
                        className="profile-box"
                        onClick={() =>
                            setShowDropdown(!showDropdown)
                        }
                    >
                        <img
                            src="https://i.pravatar.cc/100"
                            alt="Admin"
                        />

                        <div>
                            <h4>Admin</h4>
                            <span>Administrator</span>
                        </div>
                    </div>

                    {showDropdown && (
                        <div className="dropdown">

                            <div className="dropdown-item">
                                👤 My Account
                            </div>

                            <div className="dropdown-item">
                                ⚙️ Settings
                            </div>

                            <div
                                className="dropdown-item logout"
                                onClick={logout}
                            >
                                🚪 Logout
                            </div>

                        </div>
                    )}
                </div>

            </div>

            {/* Main Dashboard */}
            <div className="dashboard-content">

                {/* <div className="page-title">
          <h1>Admin Dashboard</h1>

          <p>
            Welcome back to Energy CRM
          </p>
        </div> */}

                {/* Cards */}
                <div className="cards">

                    <div className="dashboard-card">
                        <h3>Total Companies</h3>
                        <h2>{totalCompanies.toLocaleString()}</h2>
                        <p>+12% this month</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Total Meters</h3>
                        <h2>{totalMeters.toLocaleString()}</h2>
                        <p>+12% this month</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Total People</h3>
                        <h2>{totalPeople.toLocaleString()}</h2>
                        <p>+8% this month</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Contracts</h3>
                        <h2>{totalContracts.toLocaleString()}</h2>
                        <p>24 expiring soon</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Efficiency</h3>
                        <h2>92%</h2>
                        <p>Energy Optimized</p>
                    </div>

                </div>

                <div className="data-section">
                    <CompaniesGrid />
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;
