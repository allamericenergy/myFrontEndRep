import * as React from 'react';

import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
} from '@mui/x-data-grid';

import {
    Box,
    Typography,
    Tooltip,
    IconButton,
    TextField,
    InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function CustomToolbar({
    searchText,
    setSearchText,
    company,
}) {

    const navigate = useNavigate();

    return (

        <GridToolbarContainer
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                borderBottom: '1px solid #e0e0e0',
            }}
        >

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >

                <Typography fontWeight={600}>
                    Meter List
                </Typography>

                <Tooltip title="Add Meter">

                    <IconButton
                        size="small"
                        onClick={() =>
                            navigate('/AddMetertoCompany', {
                                state: {
                                    record: {
                                        company: company?.id,
                                        companyName: company?.['Company Name'],
                                    },
                                },
                            })
                        }
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>

                </Tooltip>

                <GridToolbarColumnsButton />

                <GridToolbarFilterButton />

                <GridToolbarExport />

                <Tooltip title="Refresh">

                    <IconButton
                        size="small"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshIcon fontSize="small" />
                    </IconButton>

                </Tooltip>

            </Box>

            <TextField
                size="small"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                    width: 220,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />

        </GridToolbarContainer>
    );
}

export default function CompanyMeterList({
    storeKey,
    company,
}) {

    const navigate = useNavigate();

    const [rows, setRows] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const [searchText, setSearchText] = React.useState('');

    React.useEffect(() => {

        fetchMeters();

    }, [storeKey]);

    const fetchMeters = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem('token');

            const response = await fetch(
                `${API}/api/auth/Meter/${storeKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            setRows(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    const filteredRows = rows.filter((row) =>
        Object.values(row)
            .join(' ')
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const renderWithTooltip = (params) => (

        <Tooltip
            title={params.value || ''}
            arrow
        >

            <span
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    display: 'block',
                }}
            >
                {params.value}
            </span>

        </Tooltip>
    );

    const columns = [

        /*  {
             field: 'id',
             headerName: 'ID',
             width: 50,
         }, */

        {
            field: 'MeterNo',
            headerName: 'Meter No',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'ContractID',
            headerName: 'Contract ID',
            width: 100,
            renderCell: renderWithTooltip,
        },

        /*  {
             field: 'Company Name',
             headerName: 'Company',
             width: 180,
         },
  */
        {
            field: 'UtilityAccName',
            headerName: 'Utility Account',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'AccountNumber',
            headerName: 'Account Number',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'ServiceId',
            headerName: 'Service ID',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'NameKey',
            headerName: 'Name Key',
            width: 70,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Meter',
            headerName: 'Meter',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'sAddress',
            headerName: 'Address',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'City',
            headerName: 'City',
            width: 70,
            renderCell: renderWithTooltip,
        },

        {
            field: 'State',
            headerName: 'State',
            width: 50,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Zip',
            headerName: 'Zip',
            width: 50,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Utility',
            headerName: 'Utility',
            width: 70,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Broker',
            headerName: 'Broker',
            width: 70,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Supplier',
            headerName: 'Supplier',
            width: 70,
            renderCell: renderWithTooltip,
        },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,

            renderCell: (params) => (

                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                    }}
                >

                    <Tooltip title="View">

                        <IconButton
                            size="small"
                            onClick={() =>
                                navigate(`/tbl_MeterList/${params.row.id}/show`)
                            }
                        >
                            <Visibility fontSize="small" />
                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">

                        <IconButton
                            size="small"
                            onClick={() =>
                                navigate(`/tbl_MeterList/${params.row.id}`)
                            }
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                    </Tooltip>

                </Box>
            ),
        },
    ];

    return (

        <Box
            sx={{
                width: '100%',
                overflowX: 'auto',
            }}
        >

            <Box
                sx={{
                    minWidth: '90%',
                    height: 400,
                    overflowX: 'auto',
                }}
            >

                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    loading={loading}
                    //getRowId={(row) => row.id}
                    checkboxSelection
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    slots={{
                        toolbar: () => (
                            <CustomToolbar
                                searchText={searchText}
                                setSearchText={setSearchText}
                                company={company}
                            />
                        ),
                    }}
                     getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0
                            ? 'Mui-even'
                            : 'Mui-odd'
                    }
                   sx={{
                        minWidth: 900,
                        border: 0,

                        fontSize: 12,

                        "& .MuiSvgIcon-root": {
                            fontSize: "18px",
                        },

                        "& .MuiDataGrid-toolbarContainer": {
                            minHeight: "25px",
                            maxHeight: "25px",
                            py: 0,
                        },

                        "& .MuiDataGrid-row.Mui-even": {
                            backgroundColor: "#f9f9f9",
                        },

                        "& .MuiDataGrid-row.Mui-odd": {
                            backgroundColor: "#ffffff",
                        },

                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            borderBottom: "1px solid #ddd",
                        },

                        "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid #f0f0f0",
                            whiteSpace: "1px solid #f0f0f0",
                            whiteSpace: "nowrap",
                        },
                        "& .MuiDataGrid-main": {
                            overflowX: "auto",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto",
                            overflowY: "auto",
                        },
                    }}
                />

            </Box>

        </Box>
    );
}