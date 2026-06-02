import React, {
    useEffect,
    useState,
    useMemo,
} from 'react';

import {
    DataGrid,

} from '@mui/x-data-grid';

import {
    Box,

} from '@mui/material';


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CustomToolbar from '../CustomToolbar.jsx';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';
import CloseIcon
    from '@mui/icons-material/Close';
//import AddMeter from './addMeter.jsx';
import {
    Stack
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CheckIcon from '@mui/icons-material/Check';
import FlashOnTwoToneIcon from '@mui/icons-material/FlashOnTwoTone';
import FlashOffTwoToneIcon from '@mui/icons-material/FlashOffTwoTone';
import AddMeter from './addMeter';

function meterGrid({

    pageSize = 10,
    height = 500,
    showToolbar = true,

}) {

    const [meters, setMeters] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [OnSiteGenerationOptions, setOnSiteGenerationOptions] = useState([]);
    const [OniEnergyBillOptions, setiEnergyBillOptions] = useState([]);
    const [OnEnergyDashboardOptions, setEnergyDashboardOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    useEffect(() => {

        fetchMeters();
        fetchSiteGenerationDropdown();
        fetchiEnergyBillDropdown();
        fetchEnergyDashboardDropdown();

    }, []);
    const [open, setOpen] = useState(false);
    const API = import.meta.env.VITE_API_URL;


    const fetchMeters = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem('token');

            const res = await fetch(
                `${API}/api/auth/meters`,
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
            setMeters(data);
            console.log(data);
        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    const fetchSiteGenerationDropdown = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API}/api/auth/SiteGeneration`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            console.log("Dropdown Data:", data);

            setOnSiteGenerationOptions(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchiEnergyBillDropdown = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API}/api/auth/iEnergyBill`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            console.log("Dropdown Data:", data);

            setiEnergyBillOptions(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnergyDashboardDropdown = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API}/api/auth/EnergyDashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            console.log("Dropdown Data:", data);

            setEnergyDashboardOptions(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    // Export Excel
    const exportExcel = () => {

        const worksheet =
            XLSX.utils.json_to_sheet(meters);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Meters'
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
            'Meters.xlsx'
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
    // convert API data into dropdown format
    const mappedOnSiteGenerationOptions = useMemo(() => {

        return OnSiteGenerationOptions.map((item) => ({
            value: Number(item.id),
            label: item.Type,
        }));

    }, [OnSiteGenerationOptions]);

    // console.log("Mapped Options:", mappedOnSiteGenerationOptions);

    const mappediEnergyBillOptions = useMemo(() => {

        return OniEnergyBillOptions.map((item) => ({
            value: Number(item.id),
            label: item.Type,
        }));

    }, [OniEnergyBillOptions]);

    // console.log("Mapped Options:", mappediEnergyBillOptions);

    const mappedEnergyDashboardOptions = useMemo(() => {

        return OnEnergyDashboardOptions.map((item) => ({
            value: Number(item.id),
            label: item.Type,
        }));

    }, [OnEnergyDashboardOptions]);

    console.log("Mapped Options:", mappedEnergyDashboardOptions);

    // Columns
    const columns = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerClassName: "sticky-column",
            cellClassName: "sticky-column",

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
                            <VisibilityIcon fontSize="small" />
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

        {
            field: 'Status',
            headerName: 'Status',
            width: 1,

            renderCell: (params) => {
                //console.log('params: ', params.value)
                if (params.value === "ACTIVE") {
                    return <FlashOnTwoToneIcon color="success" fontSize="small" />;
                }
                if (params.value === "INACTIVE") {
                    return <FlashOffTwoToneIcon color="error" fontSize="small" />;
                }

                return null; // or a default icon
            },

        },
        {
            field: 'MeterNo',
            headerName: 'Meter No',
            width: 200,
            minWidth: 130,
            maxWidth: 130,
            renderCell: renderWithTooltip,
        },


        /* {
             field: 'Type',
             headerName: 'Type',
             width: 120,
             renderCell: (params: GridRenderCellParams) => (
                 <Chip
                     label={params.value}
                     size="small"
                     color="primary"
                     variant="outlined"
                 />
             ),
         },*/

        {
            field: 'UtilityAccName',
            headerName: 'UtilityAccName',
            width: 120,
            minWidth: 130,
            maxWidth: 130,

            renderCell: renderWithTooltip,
        },
        {
            field: 'AccountNumber',
            headerName: 'Account Number',
            width: 200,
            minWidth: 130,
            maxWidth: 130,
            renderCell: renderWithTooltip,

        },
        {
            field: 'ServiceId',
            headerName: 'Service ID',
            width: 120,
            minWidth: 130,
            maxWidth: 130,
            renderCell: renderWithTooltip,
        },
        {
            field: 'NameKey',
            headerName: 'Name Key',
            width: 200,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'Meter',
            headerName: 'Meter',
            width: 200,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'sAddress',
            headerName: 'Address',
            width: 120,
            minWidth: 130,
            maxWidth: 130,
            renderCell: renderWithTooltip,
        },
        {
            field: 'City',
            headerName: 'City',
            width: 200,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'State',
            headerName: 'State',
            width: 120,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'Zip',
            headerName: 'Zip',
            width: 120,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'tax',
            headerName: 'Tax',
            width: 130,
            flex: 1.2,

            renderCell: (params) => {
                //console.log('params: ', params.value)
                if (params.value === "Y") {
                    return <CheckIcon color="success" fontSize="small" />;
                }
                if (params.value === "N") {
                    return <CloseIcon color="error" fontSize="small" />;
                }

                return null; // or a default icon
            },
            renderCell: renderWithTooltip,
        },
        {
            field: 'cycle',
            headerName: 'Cycle',
            width: 130,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'Rate',
            headerName: 'Rate',
            width: 130,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'Utility',
            headerName: 'Utility',
            width: 130,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'Product',
            headerName: 'Product',
            width: 130,
            flex: 1.2,

            renderCell: (params) => {
                // console.log('params: ', params.value)
                if (params.value === "Power") {
                    return <BoltIcon color="success" fontSize="small" />;
                }
                if (params.value === "Gas") {
                    return <LocalGasStationIcon color="error" fontSize="small" />;
                }

                return null; // or a default icon
            },
        },

        {
            field: "OnSiteGeneration",
            headerName: "OnSite Generation",
            width: 150,
            editable: true,
            type: "singleSelect",

            valueOptions: mappedOnSiteGenerationOptions,

            getOptionValue: (option) => option.value,
            getOptionLabel: (option) => option.label,

            renderCell: (params) => {

                const option = mappedOnSiteGenerationOptions.find(
                    (opt) => opt.value === Number(params.value)
                );

                return option ? option.label : "";
            },

        },

        {
            field: "iEnergyBill",
            headerName: "iEnergy Bill",
            width: 100,
            editable: true,
            type: "singleSelect",
            valueOptions: mappediEnergyBillOptions,
            getOptionValue: (option) => option.value,
            getOptionLabel: (option) => option.label,
            renderCell: (params) => {
                // console.log('params: ', params.value)
                if (params.value === 1) {
                    return <CheckIcon color="success" fontSize="small" />;
                }
                if (params.value === 2) {
                    return <CloseIcon color="error" fontSize="small" />;
                }

                return null; // or a default icon
            },

        },
        {
            field: "EnergyDashboard",
            headerName: "Energy Dashboard",
            width: 100,
            editable: true,
            type: "singleSelect",
            valueOptions: mappedEnergyDashboardOptions,
            getOptionValue: (option) => option.value,
            getOptionLabel: (option) => option.label,
            renderCell: (params) => {
                //console.log('params: ', params.value)
                if (params.value === 1) {
                    return <CheckIcon color="success" fontSize="small" />;
                }
                if (params.value === 2) {
                    return <CloseIcon color="error" fontSize="small" />;
                }

                return null; // or a default icon
            },

        },
        {
            field: 'broker',
            headerName: 'Broker',
            width: 130,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },
        {
            field: 'supplier',
            headerName: 'Supplier',
            width: 130,
            flex: 1.2,
            renderCell: renderWithTooltip,
        },


    ];
    const navigate = useNavigate();
    const openPopup = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
    };
    const [selectedMeter, setSelectedMeter] = useState(null);
    const [mode, setMode] = useState('add');
    const handleView = (row) => {

        navigate(`/viewMeter/${row.id}/show`, {
            state: row,
        });

    };
    const handleEdit = (row) => {

        setSelectedMeter(row);
        setMode('edit');
        setOpen(true);

    };
    const handleAddMeter = () => {

        setSelectedMeter(null);
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

            <Box
                sx={{
                    width: "100%",
                    height: "calc(100vh - 100px)",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    p: 2,
                }}
            >

                <DataGrid
                    rows={meters}
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
                                        onAdd={handleAddMeter}
                                        entityName='Meter' // dynamic prop
                                    />
                                ),
                            }
                            : {}
                    }
                    showToolbar={showToolbar}
                    sx={{
                        border: 0,
                        height: "100%",
                        width: 1400,

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
                        "& .MuiDataGrid-main": {
                            overflow: "hidden",
                        },

                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto",
                            overflowY: "auto",
                        },
                        "& .MuiDataGrid-columnHeader.sticky-right": {
                            position: "sticky",
                            right: 0,
                            zIndex: 1001,
                            backgroundColor: "#fff",
                        },

                        "& .MuiDataGrid-cell.sticky-right": {
                            position: "sticky",
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: "#fff",
                        },

                    }}
                />

            </Box>

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
                        ? 'Add Meter'
                        : 'Edit Meter'}

                    <IconButton
                        onClick={closePopup}
                    >
                        <CloseIcon />
                    </IconButton>

                </DialogTitle>
                <hr />
                {/* Content */}

                <DialogContent>

                    <AddMeter
                        fetchMeters={fetchMeters}
                        closePopup={closePopup}
                        selectedMeter={selectedMeter}
                        mode={mode}
                    />

                </DialogContent>

            </Dialog>

        </Box>


    );
}

export default meterGrid;