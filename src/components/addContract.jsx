import React, {
    useEffect,
    useState,
} from 'react';

import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';

import {
    DataGrid,
} from '@mui/x-data-grid';

import {
    useLocation,
    useNavigate,
} from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;


export default function AddContract({

    closePopup,
    mode,
    storeKey,
}) {

    const navigate = useNavigate();
    const location = useLocation();
    const company = storeKey;//location?.state?.record;
    //const companyId = company?.company;

    const [loading, setLoading] = useState(false);
    const [meters, setMeters] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] =
        useState({

            Broker: '',

            Supplier: '',

            ProductType: '',

            Rate: '',

            Fee: '',

            StartDate: '',

            EndDate: '',

            Months: '',

            cFile: null,
        });

    const [brokers, setBrokers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [Products, setProducts] = useState([]);

    useEffect(() => {

        const fetchDropdowns = async () => {

            try {

                const token =
                    localStorage.getItem('token');

                /* BROKERS */

                const brokerRes =
                    await fetch(
                        `${API}/api/auth/brokers`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const brokerData =
                    await brokerRes.json();

                setBrokers(brokerData);

                /* SUPPLIERS */

                const supplierRes =
                    await fetch(
                        `${API}/api/auth/suppliers`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                const supplierData = await supplierRes.json();
                setSuppliers(supplierData);

                /* Products */

                const productRes =
                    await fetch(
                        `${API}/api/auth/Products`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                const productData = await productRes.json();
                setProducts(productData);


            } catch (error) {

                console.log(error);

            }
        };

        fetchDropdowns();

    }, []);

    /* -------------------------------- */
    /* FETCH METERS                     */
    /* -------------------------------- */

    useEffect(() => {

        const fetchMeters = async () => {

            try {

                const token =
                    localStorage.getItem(
                        'token'
                    );

                const response =
                    await fetch(

                        `${API}/api/auth/Meter/${company}`,

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();
                // console.log(data);
                setMeters(data);

            } catch (error) {

                console.log(error);
            }
        };

        if (company) {

            fetchMeters();
        }

    }, [company]);

    /* -------------------------------- */
    /* Calculate months                  */
    /* -------------------------------- */
    useEffect(() => {

        if (
            formData.StartDate &&
            formData.EndDate
        ) {

            const start =
                new Date(formData.StartDate);

            const end =
                new Date(formData.EndDate);

            let months =
                (end.getFullYear() - start.getFullYear()) * 12;

            months +=
                end.getMonth() - start.getMonth();

            /* OPTIONAL:
               count partial month */

            if (end.getDate() >= start.getDate()) {

                months += 1;
            }

            setFormData((prev) => ({

                ...prev,

                Months: months > 0
                    ? months.toString()
                    : '',

            }));
        }

    }, [
        formData.StartDate,
        formData.EndDate,
    ]);

    /* -------------------------------- */
    /* HANDLE CHANGE                    */
    /* -------------------------------- */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,
        }));
    };

    /* -------------------------------- */
    /* FILE CHANGE                      */
    /* -------------------------------- */

    const handleFileChange = (e) => {

        setFormData((prev) => ({

            ...prev,

            cFile:
                e.target.files[0],
        }));
    };

    /* -------------------------------- */
    /* SUBMIT                           */
    /* -------------------------------- */

    const handleSubmit = async (e) => {
        console.log(selectedRows);
        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem('token');

            const payload = new FormData();

            payload.append('Broker', formData.Broker);

            payload.append('Supplier', formData.Supplier);

            payload.append('ProductType', formData.ProductType);

            payload.append('Rate', formData.Rate);

            payload.append('Fee', formData.Fee);

            payload.append('StartDate', formData.StartDate);

            payload.append('EndDate', formData.EndDate);

            //payload.append('Months', formData.Months);

            payload.append('companyId', company);

            // IMPORTANT
            // convert selectedRows array to comma separated string
            payload.append(
                'MeterIDs',
                 Array.from(selectedRows.ids).join(',')
            );

            if (formData.cFile) {

                payload.append(
                    'cFile',
                    formData.cFile || null
                );
            }

            /* ------------------------ */
            /* INSERT CONTRACT          */
            /* ------------------------ */

            const response = await fetch(

                `${API}/api/auth/add-contract`,

                {
                    method: 'POST',

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                    body: payload,
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.message);
            }

            setSuccess(true);

            setTimeout(() => {

                navigate(0);

            }, 1500);

        } catch (error) {

            console.log(error);

            alert(error.message);

        } finally {

            setLoading(false);
        }
    };
    /* -------------------------------- */
    /* GRID COLUMNS                     */
    /* -------------------------------- */

    const columns = [

        {
            field: 'id',
            headerName: 'ID',
            width: 90,
        },

        {
            field: 'MeterNo',
            headerName: 'Meter Number',
            width: 180,
        },

        {
            field: 'ServiceID',
            headerName: 'Service Address',
            width: 250,
        },

        {
            field: 'UtilityAccName',
            headerName: 'Utility Account',
            width: 150,
        },
        {
            field: 'Product',
            headerName: 'Product Type',
            width: 150,
        },

    ];

    /* -------------------------------- */
    /* FILTER METERS                    */
    /* -------------------------------- */

    const filteredMeters =
        formData.ProductType
            ? meters.filter(
                (m) =>
                    m.Product ===
                    formData.ProductType
            )
            : meters;
    // console.log(company);
    return (

        <Box p={2}>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                }}
            >


                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            borderRadius: 0,
                            backgroundColor: '#fff',
                        }}
                    >



                        <Grid
                            container
                            spacing={3}
                        >

                            {/* Broker */}

                            <Grid xs={12} sm={6} md={4}>

                                <TextField
                                    select
                                    fullWidth
                                    label="Broker"
                                    name="Broker"
                                    value={formData.Broker}
                                    onChange={handleChange}
                                    size="medium"
                                    sx={{ width: 200, }}
                                >
                                    {
                                        brokers.map((item) => (

                                            <MenuItem
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.Broker}
                                            </MenuItem>

                                        ))
                                    }
                                </TextField>

                            </Grid>

                            {/* Supplier */}

                            <Grid xs={12} sm={6} md={4}>

                                <TextField
                                    select
                                    fullWidth
                                    label="Supplier"
                                    name="Supplier"
                                    value={formData.Supplier}
                                    onChange={handleChange}
                                    sx={{ width: 200, }}
                                >
                                    {
                                        suppliers.map((item) => (

                                            <MenuItem
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.Supplier}
                                            </MenuItem>

                                        ))
                                    }
                                </TextField>

                            </Grid>
                            {/* Rate */}

                            <Grid xs={12} sm={6} md={3}>

                                <TextField
                                    fullWidth
                                    label="Rate"
                                    name="Rate"
                                    value={formData.Rate}
                                    onChange={handleChange}
                                />

                            </Grid>

                            {/* Fee */}

                            <Grid xs={12} sm={6} md={3}>

                                <TextField
                                    fullWidth
                                    label="Fee"
                                    name="Fee"
                                    value={formData.Fee}
                                    onChange={handleChange}
                                />

                            </Grid>


                        </Grid>

                    </Paper>
                    <br />


                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 1,
                            backgroundColor: '#fff',
                        }}
                    >

                        <Grid
                            container
                            spacing={3}
                        >

                            {/* Start Date */}

                            <Grid xs={12} sm={6} md={2}>

                                <TextField
                                    type="date"
                                    fullWidth
                                    label="Start Date"
                                    name="StartDate"
                                    value={formData.StartDate}
                                    onChange={handleChange}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />

                            </Grid>

                            {/* End Date */}

                            <Grid xs={12} sm={6} md={2}>

                                <TextField
                                    type="date"
                                    fullWidth
                                    label="End Date"
                                    name="EndDate"
                                    value={formData.EndDate}
                                    onChange={handleChange}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />

                            </Grid>
                            {/* Months */}

                            <Grid xs={12} sm={6} md={2}>

                                <TextField
                                    fullWidth
                                    label="Months"
                                    name="Months"
                                    value={formData.Months}
                                    inputprops={{
                                        readOnly: true,
                                    }}
                                    sx={{ width: 70, }}
                                />

                            </Grid>
                        </Grid>

                    </Paper>
                    <br />
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 1,
                            backgroundColor: '#fff',
                        }}
                    >
                        <Grid
                            container
                            spacing={3}
                        >
                            {/* Upload */}

                            <Grid xs={12} md={4}>

                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    sx={{
                                        height: 56,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Upload Contract PDF

                                    <input
                                        hidden
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />

                                </Button>
                                {
                                    formData.cFile && (

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 1,
                                                color: 'text.secondary',
                                                wordBreak: 'break-all',
                                            }}
                                        >
                                            Selected File:
                                            {' '}
                                            {formData.cFile.name}
                                        </Typography>

                                    )
                                }

                            </Grid>

                            {/* Product */}

                            <Grid xs={12} sm={6} md={4}>

                                <TextField
                                    select
                                    fullWidth
                                    label="Product Type"
                                    name="ProductType"
                                    value={formData.ProductType}
                                    onChange={handleChange}
                                    sx={{ width: 300, }}
                                >
                                    {
                                        Products.map((item) => (

                                            <MenuItem
                                                key={item.id}
                                                value={item.Product}
                                            >
                                                {item.Product}
                                            </MenuItem>

                                        ))
                                    }
                                </TextField>

                            </Grid>

                        </Grid>

                    </Paper>
                    <br />
                    {/* ---------------- */}
                    {/* METER GRID       */}
                    {/* ---------------- */}

                    <Box mt={4}>

                        <Typography
                            variant="h6"
                            mb={2}
                        >
                            Select Meters
                        </Typography>

                        <Box
                            sx={{
                                height: 400,
                                width: '100%',
                            }}
                        >

                            <DataGrid
                                rows={filteredMeters}
                                columns={columns}
                                getRowId={(row) => row.id}
                                checkboxSelection
                                onRowSelectionModelChange={(ids) => {
                                    setSelectedRows(ids);
                                }}
                                pageSizeOptions={[
                                    5,
                                    10,
                                ]}
                            />

                        </Box>

                    </Box>

                    <br />
                    {/* ---------------- */}
                    {/* SUBMIT BUTTON    */}
                    {/* ---------------- */}

                    <Box
                        mt={3}
                    >

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                loading
                            }
                        >
                            {
                                loading
                                    ? 'Saving...'
                                    : 'Save Contract'
                            }
                        </Button>

                    </Box>

                </form>

            </Paper >

            <Snackbar
                open={success}
                autoHideDuration={3000}
            >

                <Alert severity="success">

                    Contract Added Successfully

                </Alert>

            </Snackbar>

        </Box >
    );
}