import React, { useEffect, useMemo, useRef, useState } from "react";

import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import {
    Box,
    Typography,
    Tooltip,
    IconButton,
    Button,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function CustomToolbar({ companyId, companyName }) {

    const navigate = useNavigate();

    return (

        <GridToolbarContainer
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 0.5,
            }}
        >

            <Typography
                sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    pl: 1,
                }}
            >
                Member List
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >

                <Tooltip title="Add Member">

                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate("/AddMember", {
                                state: {
                                    company: companyId,
                                    companyName: companyName,
                                },
                            })
                        }
                    >
                        Add
                    </Button>

                </Tooltip>

                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />

                <GridToolbarQuickFilter />

                <Tooltip title="Refresh">

                    <IconButton
                        size="small"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshIcon fontSize="small" />
                    </IconButton>

                </Tooltip>

            </Box>

        </GridToolbarContainer>
    );
}

export default function CompanyMemberList({
    storeKey,
    company,
}) {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(false);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const gridRef = useRef(null);

    useEffect(() => {

        fetchMembers();

    }, [storeKey]);

    const fetchMembers = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API}/api/auth/member/${storeKey}`,
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

    const columns = useMemo(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 70,
            },

            {
                field: "Name",
                headerName: "Name",
                width: 180,
            },

            {
                field: "Address",
                headerName: "Address",
                width: 220,
            },

            {
                field: "City",
                headerName: "City",
                width: 140,
            },

            {
                field: "State",
                headerName: "State",
                width: 100,
            },

            {
                field: "Zip",
                headerName: "Zip",
                width: 100,
            },

            {
                field: "Phone",
                headerName: "Phone",
                width: 150,
            },

            {
                field: "Birthday",
                headerName: "Birthday",
                width: 150,
            },

            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                sortable: false,
                filterable: false,

                renderCell: (params) => (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            height: "100%",
                        }}
                    >

                        <Tooltip title="View">

                            <IconButton
                                size="small"
                                onClick={() =>
                                    navigate(`/member/${params.row.id}/show`)
                                }
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>

                        </Tooltip>

                        <Tooltip title="Edit">

                            <IconButton
                                size="small"
                                onClick={() =>
                                    navigate(`/member/${params.row.id}`)
                                }
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>

                        </Tooltip>

                    </Box>
                ),
            },
        ],
        []
    );

    return (

        <Box
            sx={{
                width: "100%",
                height: 350,
                overflow: "hidden",
            }}
        >

            <DataGrid
                ref={gridRef}
                rows={rows}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}

                checkboxSelection
                disableRowSelectionOnClick

                pagination
                pageSizeOptions={[5, 10, 20]}

                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}

                filterModel={filterModel}
                onFilterModelChange={setFilterModel}

                slots={{
                    toolbar: () => (
                        <CustomToolbar
                            companyId={company?.id}
                            companyName={company?.["Company Name"]}
                        />
                    ),
                }}

                rowHeight={32}
                columnHeaderHeight={36}

                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0
                        ? "Mui-even"
                        : "Mui-odd"
                }

                sx={{
                    border: 0,
                    fontSize: 12,

                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f5f5f5",
                        fontWeight: 600,
                    },

                    "& .MuiDataGrid-toolbarContainer": {
                        minHeight: "36px",
                        borderBottom: "1px solid #e0e0e0",
                    },

                    "& .MuiDataGrid-row.Mui-even": {
                        backgroundColor: "#fafafa",
                    },

                    "& .MuiDataGrid-row.Mui-odd": {
                        backgroundColor: "#ffffff",
                    },

                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #f0f0f0",
                    },

                    "& .MuiSvgIcon-root": {
                        fontSize: "18px",
                    },

                    "& .MuiDataGrid-footerContainer": {
                        minHeight: "36px",
                    },
                }}
            />

        </Box>
    );
}