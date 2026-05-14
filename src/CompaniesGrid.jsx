import React, {
    useEffect,
    useState
} from 'react';

import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid';

import {
    Box,
    Typography
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
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

function CompaniesGrid() {

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
            flex: 1,
        },

        {
            field: 'Legal Entity Name',
            headerName: 'Legal Entity',
            flex: 1,
        },

        {
            field: 'Mailing Address',
            headerName: 'Address',
            flex: 1,
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
            flex: 1,

            renderCell: (params) => (

                <a
                    href={params.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid-link"
                >
                    {params.value}
                </a>
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
                    height: 500,
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
                                pageSize: 10,
                            },
                        },
                    }}

                    slots={{
                        toolbar: () => (
                            <CustomToolbar
                                exportExcel={exportExcel}
                                onAdd={openPopup}
                            />
                        ),
                    }}
                    showToolbar
                    sx={{
                        border: 0,

                        '& .MuiDataGrid-columnHeaders':
                        {
                            backgroundColor:
                                '#f3f4f6',
                            fontSize: '15px',
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

                    Add Company

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
                    />

                </DialogContent>

            </Dialog>

        </Box>


    );
}

export default CompaniesGrid;
