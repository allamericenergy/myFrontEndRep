import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
    DataGrid,
    Toolbar,
    ToolbarButton,
    ColumnsPanelTrigger,
    FilterPanelTrigger,
    ExportCsv,
    ExportPrint,
    QuickFilter,
    QuickFilterControl,
    QuickFilterClear,
    QuickFilterTrigger,
    useGridApiRef,
    gridExpandedSortedRowIdsSelector,
    gridVisibleColumnDefinitionsSelector,
} from '@mui/x-data-grid';

import {
    Box,
    Tooltip,
    Menu,
    MenuItem,
    Divider,
    Badge,
    Typography,
    IconButton,
    Snackbar,
    InputAdornment,
    TextField,
} from '@mui/material';

import { styled } from '@mui/material/styles';

import {
    ViewColumn as ViewColumnIcon,
    FilterList as FilterListIcon,
    FileDownload as FileDownloadIcon,
    Search as SearchIcon,
    Cancel as CancelIcon,
    Visibility,
    Edit,
    Add as AddIcon,
} from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import AddContract from './addContract.jsx';
import CloseIcon
    from '@mui/icons-material/Close';
import CustomToolbar from '../CustomToolbar';

const API = import.meta.env.VITE_API_URL;

//console.log(API);
const StyledQuickFilter = styled(QuickFilter)({
    display: 'grid',
    alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)(
    ({ theme, ownerState }) => ({
        gridArea: '1 / 1',
        width: 'min-content',
        height: 'min-content',
        zIndex: 1,
        opacity: ownerState.expanded ? 0 : 1,
        pointerEvents: ownerState.expanded ? 'none' : 'auto',
        transition: theme.transitions.create(['opacity']),
    })
);

const StyledTextField = styled(TextField)(
    ({ theme, ownerState }) => ({
        gridArea: '1 / 1',
        overflowX: 'clip',
        width: ownerState.expanded ? 260 : 'var(--trigger-width)',
        opacity: ownerState.expanded ? 1 : 0,
        transition: theme.transitions.create(['width', 'opacity']),
    })
);


export default function contractGrid({
    pageSize = 10,
    height = 500,
    showToolbar = true,
}) {

    const navigate = useNavigate();

    const apiRef = useGridApiRef();

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(false);

    const [hasMeter, setHasMeter] = useState([]);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('add');
    const [selectedContract, setSelectedContract] = useState(null);
    const openPopup = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
    };
    const [openError, setOpenError] = useState(false);

    const handleAddContract = () => {

        if (hasMeter && hasMeter.length > 0) {

            setSelectedContract(null);
            setMode('add');
            setOpen(true);

        } else {

            setOpenError(true);

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
    /* FETCH CONTRACTS */

    useEffect(() => {

        const fetchContracts = async () => {

            try {

                setLoading(true);
                console.log('Start');
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${API}/api/auth/Contract`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                console.log(data);
                setRows(data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };
        fetchContracts();

    }, []);

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

    /* COLUMNS */

    const columns = [

        /* {
            field: 'id',
            headerName: 'ID',
            width: 70,
        }, */

        {
            field: 'ContractID',
            headerName: 'Contract ID',
            width: 150,
            renderCell: renderWithTooltip,
        },

        {
            field: 'cName',
            headerName: 'Name',
            width: 200,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Broker',
            headerName: 'Broker',
            width: 150,
            renderCell: renderWithTooltip,
        },

        {
            field: 'Supplier',
            headerName: 'Supplier',
            width: 150,
            renderCell: renderWithTooltip,
        },

        {
            field: 'StartDate',
            headerName: 'Start Date',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'EndDate',
            headerName: 'End Date',
            width: 100,
            renderCell: renderWithTooltip,
        },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
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
                                navigate(`/contract/view/${params.row.id}`)
                            }
                        >
                            <Visibility fontSize="small" />
                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">

                        <IconButton
                            size="small"
                            onClick={() =>
                                navigate(`/contract/edit/${params.row.id}`)
                            }
                        >
                            <Edit fontSize="small" />
                        </IconButton>

                    </Tooltip>

                </Box>
            ),
        },
    ];

    /* SCROLL POSITION */

    const [coordinates, setCoordinates] = useState({
        rowIndex: 0,
        colIndex: 0,
    });

    useEffect(() => {

        const { rowIndex, colIndex } = coordinates;

        apiRef.current?.scrollToIndexes(coordinates);

        const id =
            gridExpandedSortedRowIdsSelector(apiRef)[rowIndex];

        const column =
            gridVisibleColumnDefinitionsSelector(apiRef)[colIndex];

        if (id && column) {
            apiRef.current?.setCellFocus(id, column.field);
        }

    }, [coordinates]);

    const handleCellClick = (params) => {

        const rowIndex =
            gridExpandedSortedRowIdsSelector(apiRef)
                .findIndex((id) => id === params.id);

        const colIndex =
            gridVisibleColumnDefinitionsSelector(apiRef)
                .findIndex(
                    (column) => column.field === params.field
                );

        setCoordinates({
            rowIndex,
            colIndex,
        });
    };

    /* ROW COUNT */

    const rowCountRef = useRef(rows.length || 0);

    const rowCount = useMemo(() => {

        if (rows.length !== undefined) {
            rowCountRef.current = rows.length;
        }

        return rowCountRef.current;

    }, [rows.length]);

    return (

        <Box  sx={{
                background: "#fff",
                padding: "25px",
                borderRadius: "20px",
                marginTop: "40px",
                boxShadow:
                    "0 10px 30px rgba(0,0,0,0.05)",
            }}>

            <Box
                sx={{
                    height: 300,
                    width: '100%',
                    overflow: 'auto',
                }}
            >

                <DataGrid
                    apiRef={apiRef}
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    //rowCount={rowCount}

                    checkboxSelection
                    disableRowSelectionOnClick

                    paginationModel={paginationModel}
                    onPaginationModelChange={
                        setPaginationModel
                    }

                    filterModel={filterModel}
                    onFilterModelChange={
                        setFilterModel
                    }

                    pageSizeOptions={[5, 10, 20]}

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}

                    paginationMode="client"
                    filterMode="client"

                    rowHeight={32}
                    columnHeaderHeight={38}

                    onCellClick={handleCellClick}

                    slots={
                        showToolbar
                            ? {
                                toolbar: () => (
                                    <CustomToolbar
                                        exportExcel={exportExcel}
                                        onAdd={handleAddContract}
                                        entityName='Contract' // dynamic prop
                                    />
                                ),
                            }
                            : {}
                    }
                    showToolbar={showToolbar}

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
                            minHeight: "35px",
                            maxHeight: "35px",
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

            <Dialog
                open={open}
                onClose={closePopup}
                maxWidth="lg"
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
                        ? 'Add Contract'
                        : 'Edit Contract'}

                    <IconButton
                        onClick={closePopup}
                    >
                        <CloseIcon />
                    </IconButton>

                </DialogTitle>
                <hr />
                {/* Content */}

                <DialogContent>

                    <AddContract
                        closePopup={closePopup}
                        mode={mode}
                    />
                </DialogContent>
            </Dialog>
            {/* ERROR MESSAGE */}

            <Snackbar
                open={openError}
                autoHideDuration={4000}
                onClose={() => setOpenError(false)}
                message="No meter associated with this company. Add meter before signing contract."
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: 'error.main',
                            color: '#fff',
                        },
                    },
                }}
            />


        </Box>
    );
}