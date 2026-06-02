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

/*function CustomToolbar({
    company,
    hasMeter,
}) { 


    const navigate = useNavigate();

    const [openError, setOpenError] = useState(false);

    const [exportMenuOpen, setExportMenuOpen] = useState(false);

    const exportMenuTriggerRef = useRef(null);

    return (

        <Toolbar>

            <Typography
                fontWeight="medium"
                sx={{
                    flex: 1,
                    mx: 0.5,
                }}
            >
                Contract List
            </Typography>

            

            <Tooltip title="Add New">

                <ToolbarButton
                    onClick={() => {

                        if (hasMeter.length > 0) {

                            navigate(`/addContract/${company}`, {
                                state: {
                                    record: {
                                        company: company?.id,
                                        companyName: company?.['Company Name'],
                                    },
                                },
                            });

                        } else {

                            setOpenError(true);
                        }
                    }}
                >
                    <AddIcon fontSize="small" />
                </ToolbarButton>

            </Tooltip>

            }

            <Snackbar
                open={openError}
                autoHideDuration={4000}
                onClose={() => setOpenError(false)}
                message="Please create a meter before adding a contract."
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: 'error.main',
                            color: '#fff',
                        },
                    },
                }}
            />

            

            <Tooltip title="Columns">

                <ColumnsPanelTrigger render={<ToolbarButton />}>

                    <ViewColumnIcon fontSize="small" />

                </ColumnsPanelTrigger>

            </Tooltip>

            }

            <Tooltip title="Filters">

                <FilterPanelTrigger
                    render={(props, state) => (

                        <ToolbarButton
                            {...props}
                            color="default"
                        >

                            <Badge
                                badgeContent={state.filterCount}
                                color="primary"
                                variant="dot"
                            >
                                <FilterListIcon fontSize="small" />
                            </Badge>

                        </ToolbarButton>
                    )}
                />

            </Tooltip>

            <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ mx: 0.5 }}
            />

            }

            <Tooltip title="Export">

                <ToolbarButton
                    ref={exportMenuTriggerRef}
                    onClick={() => setExportMenuOpen(true)}
                >
                    <FileDownloadIcon fontSize="small" />
                </ToolbarButton>

            </Tooltip>

            <Menu
                anchorEl={exportMenuTriggerRef.current}
                open={exportMenuOpen}
                onClose={() => setExportMenuOpen(false)}
            >

                <ExportPrint
                    render={<MenuItem />}
                    onClick={() => setExportMenuOpen(false)}
                >
                    Print
                </ExportPrint>

                <ExportCsv
                    render={<MenuItem />}
                    onClick={() => setExportMenuOpen(false)}
                >
                    Download CSV
                </ExportCsv>

            </Menu>

           }

            <StyledQuickFilter>

                <QuickFilterTrigger
                    render={(triggerProps, state) => (

                        <Tooltip title="Search">

                            <StyledToolbarButton
                                {...triggerProps}
                                ownerState={{
                                    expanded: state.expanded,
                                }}
                            >
                                <SearchIcon fontSize="small" />
                            </StyledToolbarButton>

                        </Tooltip>
                    )}
                />

                <QuickFilterControl
                    render={({ ref, ...controlProps }, state) => (

                        <StyledTextField
                            {...controlProps}
                            ownerState={{
                                expanded: state.expanded,
                            }}
                            inputRef={ref}
                            placeholder="Search..."
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),

                                    endAdornment: state.value ? (
                                        <InputAdornment position="end">

                                            <QuickFilterClear>

                                                <CancelIcon fontSize="small" />

                                            </QuickFilterClear>

                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                        />
                    )}
                />

            </StyledQuickFilter>

            }

            <Tooltip title="Refresh">

                <ToolbarButton
                    onClick={() => window.location.reload()}
                >
                    ↻
                </ToolbarButton>

            </Tooltip>

        </Toolbar>
    );
}*/

export default function CompanyContractList({
    storeKey,
    company,
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

                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${API}/api/auth/Contract/${storeKey}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
               // console.log(data);
                setRows(data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

        if (storeKey) {
            fetchContracts();
        }

    }, [storeKey]);

    /* FETCH METERS */

    useEffect(() => {

        const fetchMeters = async () => {

            try {

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

                setHasMeter(data);

            } catch (error) {

                console.log(error);
            }
        };

        if (storeKey) {
            fetchMeters();
        }

    }, [storeKey]);


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

        <Box sx={{ width: '100%' }}>

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

                    pageSizeOptions={[5]}

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
                        storeKey={storeKey}
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