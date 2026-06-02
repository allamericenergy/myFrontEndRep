import React, {
    useEffect,
    useState
} from 'react';

import {
    DataGrid,
    
} from '@mui/x-data-grid';

import {
    Box,
    
} from '@mui/material';


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CustomToolbar from './CustomToolbar';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';
import CloseIcon
    from '@mui/icons-material/Close';
import AddCompany from './AddCompany';
import {
    Stack
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

function CompaniesGrid({

    pageSize = 10,
    height = 500,
    showToolbar = true,

}) {

    const [companies, setCompanies] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        fetchCompanies();

    }, []);
    const [open, setOpen] = useState(false);
    const API = import.meta.env.VITE_API_URL;
    const fetchCompanies = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem('token');

            const res = await fetch(
                `${API}/api/auth/companies`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (setOpen) {
                setOpen(false);
            }
            setCompanies(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    // Export Excel

    const exportExcel = () => {

        const worksheet =
            XLSX.utils.json_to_sheet(companies);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Companies'
        );

        const excelBuffer =
            XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });

        const fileData = new Blob(
            [excelBuffer],
            {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
            }
        );

        saveAs(
            fileData,
            'Companies.xlsx'
        );
    };

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
    // Columns
    const columns = [


        {
            field: 'Customer ID',
            headerName: 'Customer ID',
            width: 120,
        },

        {
            field: 'Company Name',
            headerName: 'Company',
            width: 200,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Legal Entity Name',
            headerName: 'Legal Entity',
            width: 200,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Mailing Address',
            headerName: 'Address',
            width: 250,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Phone Number',
            headerName: 'Phone Number',
            width: 150,
        },
        {
            field: 'Tax ID',
            headerName: 'Tax ID',
            width: 120,
        },

        {
            field: 'URL',
            headerName: 'Company URL',
            width: 200,

            renderCell: (params) => (
                <Tooltip
                    title={params.value || ''}
                    arrow
                >
                    <a
                        href={params.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid-link"

                        style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            display: 'block',
                        }}
                    >
                        {params.value}
                    </a>
                </Tooltip>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            filterable: false,

            renderCell: (params) => (

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Tooltip title="View">

                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() =>
                                handleView(params.row)
                            }
                        >
                            <VisibilityIcon
                                fontSize="small"
                            />
                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">

                        <IconButton
                            color="secondary"
                            size="small"
                            onClick={() =>
                                handleEdit(params.row)
                            }
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                    </Tooltip>

                </Stack>
            ),
        },

    ];
    const navigate = useNavigate();
    const openPopup = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
    };
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [mode, setMode] = useState('add');
    const handleView = (row) => {

        navigate(`/viewCompany/${row.id}`, {
            state: row,
        });

    };
    const handleEdit = (row) => {

        setSelectedCompany(row);
        setMode('edit');
        setOpen(true);

    };
    const handleAddCompany = () => {

        setSelectedCompany(null);
        setMode('add');
        setOpen(true);

    };

    return (
        <Box
            sx={{
                background: 'white',
                padding: '25px',
                borderRadius: '20px',
                marginTop: '40px',
                boxShadow:
                    '0 10px 30px rgba(0,0,0,0.05)',
            }}
        >

            <div
                style={{
                    width: '100%',
                    height,
                }}
            >

                <DataGrid
                    rows={companies}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    pageSizeOptions={[5, 10, 20]}

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize,
                            },
                        },
                    }}

                    slots={
                        showToolbar
                            ? {
                                toolbar: () => (
                                    <CustomToolbar
                                        exportExcel={exportExcel}
                                        onAdd={handleAddCompany}
                                        entityName = 'Company' // dynamic prop
                                    />
                                ),
                            }
                            : {}
                    }
                    showToolbar={showToolbar}
                    sx={{
                        border: 0,

                        '& .MuiDataGrid-columnHeaders':
                        {
                            backgroundColor:
                                '#f3f4f6',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        },

                        '& .MuiDataGrid-row:hover':
                        {
                            backgroundColor:
                                '#f9fafb',
                        },

                        '& .MuiDataGrid-cell': {
                            borderBottom:
                                '1px solid #f1f1f1',
                            fontSize: '13px',
                            alignItems: 'center',
                        },
                        '& .MuiDataGrid-row': {
                            minHeight: '42px !important',
                            maxHeight: '42px !important',
                        },


                    }}
                />

            </div>

            <Dialog
                open={open}
                onClose={closePopup}
                maxWidth="md"
                fullWidth
            >

                {/* Header */}

                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                            'space-between',

                        fontWeight: 'bold',
                    }}
                >

                    {mode === 'add'
                        ? 'Add Company'
                        : 'Edit Company'}

                    <IconButton
                        onClick={closePopup}
                    >
                        <CloseIcon />
                    </IconButton>

                </DialogTitle>
                <hr />
                {/* Content */}

                <DialogContent>

                    <AddCompany
                        fetchCompanies={fetchCompanies}
                        closePopup={closePopup}
                        selectedCompany={selectedCompany}
                        mode={mode}
                    />

                </DialogContent>

            </Dialog>

        </Box>


    );
}

export default CompaniesGrid;