import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import {
    Box,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';

const API = import.meta.env.VITE_API_URL;

const AddMeter = () => {

    const [formData, setFormData] = useState({
        CompanyID: '',
        AccountID: '',
        Meter: '',
        ServiceID: '',
        NameKey: '',
        Address: '',
        City: '',
        State: '',
        Zip: '',
        TaxID: '',
        Cycle: '',
        Rate: '',
        Utility: '',
        ProductID: '',
        OnsiteGeneration: '',
        IEnergyBill: '',
        EnergyDashboard: '',
        BrokerID: '',
        SupplierID: '',
    });

    const [companies, setCompanies] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [newAccount, setNewAccount] = useState('');
    const [products, setProducts] = useState([]);
    const [onsitegeneration, setOnsitegeneration] = useState([]);
    const [ienergybill, setIenergybill] = useState([]);
    const [energydashboard, setEnergydashboard] = useState([]);
    const [brokers, setBrokers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [type, setType] = useState([]);
    const [meterStatus, setMeterStatus] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {

        try {

            const token = localStorage.getItem('token');

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [
                companyRes,
                productRes,
                onsitegeneration,
                ienergybill,
                energydashboard,
                brokerRes,
                supplierRes,
                typeMeter,
                meterStatusRes
            ] = await Promise.all([
                axios.get(`${API}/api/auth/companies`, { headers }),
                axios.get(`${API}/api/auth/products`, { headers }),
                axios.get(`${API}/api/auth/SiteGeneration`, { headers }),
                axios.get(`${API}/api/auth/iEnergyBill`, { headers }),
                axios.get(`${API}/api/auth/EnergyDashboard`, { headers }),
                axios.get(`${API}/api/auth/brokers`, { headers }),
                axios.get(`${API}/api/auth/suppliers`, { headers }),
                axios.get(`${API}/api/auth/typemeter`, { headers }),
                axios.get(`${API}/api/auth/meterstatus`, { headers }),
            ]);

            setCompanies(companyRes.data || []);
            setProducts(productRes.data || []);
            setOnsitegeneration(onsitegeneration.data || []);
            setIenergybill(ienergybill.data || []);
            setEnergydashboard(energydashboard.data || []);
            setBrokers(brokerRes.data || []);
            setSuppliers(supplierRes.data || []);
            //console.log("Type: ",typeMeter.data);
            setType(typeMeter.data || []);
            setMeterStatus(meterStatusRes.data || []);

        } catch (error) {

            console.error(error);

        }
    };

    const fetchAccountsByCompany = async (companyId) => {

        try {

            const token = localStorage.getItem('token');

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(
                `${API}/api/auth/accountnos/${companyId}`,
                { headers }
            );

            setAccounts(response.data || []);
            //setAccounts(data);

            // Check accounts exist or not
            if (response.data.length > 0) {
                setShowAddAccount(false);
            } else {
                setShowAddAccount(true);
            }

        } catch (error) {

            console.error(error);
            setAccounts([]);
            setShowAddAccount(true);

        }
    };

    const handleAddAccount = async () => {

        try {

            const token = localStorage.getItem('token');

            await axios.post(
                `${API}/api/auth/addAccount`,
                {
                    CompanyID: formData.CompanyName,
                    AccountNo: newAccount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Account Added Successfully');

            // Refresh accounts dropdown
            fetchAccountsByCompany(formData.CompanyName);

            // Clear textbox
            setNewAccount('');

            // Hide textbox and show dropdown
            setShowAddAccount(false);

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                'Error adding account'
            );

        }
    };

    const handleChange = async (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'id') {

            setFormData((prev) => ({
                ...prev,
                CompanyID: value,
                AccountID: '',
            }));
            console.log("Value: ", value);
            if (value) {
                fetchAccountsByCompany(value);
            } else {
                setAccounts([]);
            }
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem('token');

            const response = await fetch(
                `${API}/api/auth/addMeter`,
                {
                   method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body:formData,
                }
            );

            if (!response.ok) {

                throw new Error(data.message);
            }

            setSuccess(true);

            setTimeout(() => {

                navigate(0);

            }, 1500);

            alert('Meter Added Successfully');

            setFormData({
                CompanyID: '',
                AccountID: '',
                Meter: '',
                ServiceID: '',
                NameKey: '',
                Address: '',
                City: '',
                State: '',
                Zip: '',
                TaxID: '',
                Cycle: '',
                Rate: '',
                Utility: '',
                ProductID: '',
                OnsiteGeneration: '',
                IEnergyBill: '',
                EnergyDashboard: '',
                BrokerID: '',
                SupplierID: '',
            });

            setAccounts([]);

        } catch (error) {

            console.error(error);
            alert(error.response?.data?.message || 'Error adding meter');

        } finally {

            setLoading(false);

        }
    };
    const labelStyle = {
        mb: 1,
        fontWeight: 600,
        color: '#334155',
        fontSize: '14px',
    };

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: '#fff',

        },
    };
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to right, #eef2ff, #f8fafc)',
                p: { xs: 2, md: 5 },
            }}
        >

            <Paper
                elevation={0}
                sx={{
                    maxWidth: 1400,
                    mx: 'auto',
                    p: { xs: 3, md: 5 },
                    borderRadius: 5,
                    background: '#ffffffcc',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                }}
            >

                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Typography
                        sx={{
                            color: '#64748b',
                            fontSize: '15px',
                        }}
                    >
                        Fill all required details to create a new meter.
                    </Typography>

                </Box>

                <form onSubmit={handleSubmit}>

                    <Grid container spacing={3}>


                        {/* Company Dropdown */}
                        <Grid item xs={12} md={4}>
                            <FormControl sx={{ width: 450 }}>
                                <InputLabel>Company</InputLabel>
                                <Select name="id" value={formData.id} onChange={handleChange} label="Company"  >
                                    {companies.map((company) =>
                                    (<MenuItem
                                        key={company.id}
                                        value={company.id} >
                                        {company["Company Name"]} </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Account Section */}
                        <Grid item xs={12} md={4}>
                            {showAddAccount ? (<Box>

                                <Typography
                                    sx={{
                                        color: 'error.main',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        mb: 1,
                                    }}
                                >
                                    No accounts with this Company...
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                    }}
                                >

                                    <TextField
                                        fullWidth
                                        label="Add Account"
                                        value={newAccount}
                                        onChange={(e) =>
                                            setNewAccount(e.target.value)
                                        }
                                        sx={{ ...inputStyle, width: 400 }}
                                    />

                                    <Button
                                        variant="contained"
                                        onClick={handleAddAccount}
                                        sx={{
                                            height: 56,
                                            borderRadius: 3,
                                            px: 3,
                                        }}
                                    >
                                        Add
                                    </Button>

                                </Box>

                            </Box>
                            ) : (<FormControl sx={{ width: 450 }}>
                                <InputLabel>Account</InputLabel>
                                <Select name="AccountID" value={formData.AccountID} onChange={handleChange} label="Account" >
                                    {accounts.map((account) => (<MenuItem key={account.id} value={account.id} >
                                        {account.accountNo} </MenuItem>))}
                                </Select>
                            </FormControl>
                            )}
                        </Grid>
                        <Divider
                            sx={{
                                width: '100%',
                                borderColor: '#ccc',
                                my: 2,
                            }}
                        />
                        {/* Type Dropdown */}
                        <Grid item xs={12} md={6}>
                            <FormControl sx={{ width: 200 }}>
                                <InputLabel>Type</InputLabel>

                                <Select
                                    name="Type"
                                    value={formData.id}
                                    onChange={handleChange}
                                    label="Type"
                                    sx={inputStyle}
                                >
                                    {type.map((tMeter) => (
                                        <MenuItem
                                            key={tMeter.id}
                                            value={tMeter.id}
                                        >
                                            {tMeter["Type"]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Meter */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Meter" name="Meter" value={formData.Meter} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* Service ID */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Service ID" name="ServiceID" value={formData.ServiceID} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* Name Key */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Name Key" name="NameKey" value={formData.NameKey} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* Tax ID */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Tax ID" name="TaxID" value={formData.TaxID} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* Cycle */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Cycle" name="Cycle" value={formData.Cycle} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* Rate */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Rate" name="Rate" value={formData.Rate} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* Utility */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Utility" name="Utility" value={formData.Utility} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        <Divider
                            sx={{
                                width: '100%',
                                borderColor: '#ccc',
                                my: 2,
                            }}
                        />
                        {/* Address */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Address" name="Address" value={formData.Address} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* City */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="City" name="City" value={formData.City} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* State */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="State" name="State" value={formData.State} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        {/* Zip */}
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Zip" name="Zip" value={formData.Zip} onChange={handleChange} sx={inputStyle} />
                        </Grid>

                        <Divider
                            sx={{
                                width: '100%',
                                borderColor: '#ccc',
                                my: 2,
                            }}
                        />
                        {/* Product Dropdown */}
                        <Grid item xs={12} md={6}>
                            <FormControl sx={{ width: 200 }}>
                                <InputLabel>Product</InputLabel>
                                <Select name="Product" value={formData.id} onChange={handleChange} label="Product" sx={inputStyle} >
                                    {products.map((product) => (<MenuItem key={product.id} value={product.id} >
                                        {product.Product} </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Onsite Generation */}
                        <Grid item xs={12} md={4}>
                            <FormControl sx={{ width: 200 }}>
                                <InputLabel>Onsite Generation</InputLabel>
                                <Select name="OnsiteGeneration" value={formData.OnsiteGeneration} onChange={handleChange} label="Onsite Generation" >
                                    {onsitegeneration.map((item) =>
                                    (<MenuItem key={item.id} value={item.id} >
                                        {item.Type} </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* iEnergy Bill */}
                        <Grid item xs={12} md={4}>
                            <FormControl sx={{ width: 200 }}>
                                <InputLabel>iEnergy Bill</InputLabel>
                                <Select name="Ienergybill" value={formData.ienergybill} onChange={handleChange} label="iEnergy Bill" >
                                    {ienergybill.map((item) => (<MenuItem key={item.id} value={item.id} > {item.Type}
                                    </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Energy Dashboard */}
                        <Grid item xs={12} md={4}>
                            <FormControl sx={{ width: 200 }}>
                                <InputLabel>Energy Dashboard</InputLabel>
                                <Select name="Energydashboard" value={formData.energydashboard} onChange={handleChange} label="Energy Dashboard" >
                                    {energydashboard.map((item) => (<MenuItem key={item.id} value={item.id} >
                                        {item.Type} </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Broker Dropdown */}
                        <Grid item xs={12} md={4}>
                            <FormControl sx={{ width: 200 }}>
                                <InputLabel>Broker</InputLabel>
                                <Select name="Broker" value={formData.id} onChange={handleChange} label="Broker" >
                                    {brokers.map((broker) => (<MenuItem key={broker.id} value={broker.id} >
                                        {broker.Broker} </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Supplier Dropdown */}
                        <Grid item xs={12} md={4}>
                            <FormControl sx={{ width: 200 }}>
                                <InputLabel>Supplier</InputLabel>
                                <Select name="Supplier" value={formData.id} onChange={handleChange} label="Supplier" >
                                    {suppliers.map((supplier) => (<MenuItem key={supplier.id} value={supplier.id} >
                                        {supplier.Supplier} </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Divider
                            sx={{
                                width: '100%',
                                borderColor: '#ccc',
                                my: 2,
                            }}
                        />
                        {/* Meter Status Dropdown */}
                        <Grid item xs={12} md={6}>
                            <FormControl sx={{ width: 300 }}>
                                <InputLabel>Status</InputLabel>
                                <Select name="Status" value={formData.id} onChange={handleChange} label="Status" sx={inputStyle} >
                                    {meterStatus.map((status) => (<MenuItem key={status.id} value={status.id} >
                                        {status.Status} </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>

                         <Divider
                            sx={{
                                width: '100%',
                                borderColor: '#ccc',
                                my: 2,
                            }}
                        />

                        {/* Submit */}
                        <Grid item xs={12} sx={{ mt: 3 }}>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    height: 58,
                                    borderRadius: 4,
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    background:
                                        'linear-gradient(to right, #2563eb, #4f46e5)',
                                    boxShadow:
                                        '0 10px 25px rgba(37,99,235,0.3)',
                                    '&:hover': {
                                        background:
                                            'linear-gradient(to right, #1d4ed8, #4338ca)',
                                    },
                                }}
                            >
                                {loading ? 'Submitting...' : 'Submit Meter'}
                            </Button>

                        </Grid>

                    </Grid>

                </form>

            </Paper>

        </Box>
    );
};

export default AddMeter;

