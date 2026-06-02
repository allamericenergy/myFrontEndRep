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
import CustomToolbar from '../CustomToolbar.jsx';
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import MemberViewDialog from "./ViewMember.jsx";
import EditMemberDrawer from "./EditMemberDrawer.jsx";

const API = import.meta.env.VITE_API_URL;

function CustomToolbar1({ exportExcel, onAdd }) {
    return (
        <GridToolbarContainer
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
            }}
        >
            <Typography
                sx={{
                    fontSize: "14px",
                    fontWeight: 600,
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
                        onClick={onAdd}
                    >
                        Add
                    </Button>
                </Tooltip>

                <Tooltip title="Export Excel">
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={exportExcel}
                    >
                        Excel
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

function MemberGrid({

    pageSize = 10,
    height = 300,
    showToolbar = true,

}) {
    const navigate = useNavigate();

    const gridRef = useRef(null);

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(false);

    const [openView, setOpenView] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const [selectedMemberId, setSelectedMemberId] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API}/api/auth/member`,
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

    const handleViewMember = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${API}/api/auth/memberview/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setSelectedMember(
                Array.isArray(data) ? data[0] : data
            );

            setOpenView(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteMember = async (id) => {
        const result = await Swal.fire({
            title: "Delete Member?",
            text: "This record cannot be recovered.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API}/api/auth/memberdelete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setRows((prev) =>
                    prev.filter((row) => row.id !== id)
                );

                Swal.fire(
                    "Deleted!",
                    "Member deleted successfully.",
                    "success"
                );
            } else {
                Swal.fire(
                    "Error",
                    data.message || "Delete failed",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);

            Swal.fire(
                "Error",
                "Something went wrong",
                "error"
            );
        }
    };

    const exportExcel = () => {
        const worksheet =
            XLSX.utils.json_to_sheet(rows);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Members"
        );

        const excelBuffer = XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array",
            }
        );

        const fileData = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            }
        );

        saveAs(fileData, "Members.xlsx");
    };

    const handleAddMember = () => {
        navigate("/AddMember");
    };

    const renderWithTooltip = (params) => (
        <Tooltip
            title={params.value || ""}
            arrow
        >
            <span
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                    display: "block",
                }}
            >
                {params.value}
            </span>
        </Tooltip>
    );

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
                renderCell: renderWithTooltip,
            },

            {
                field: "Address",
                headerName: "Address",
                width: 220,
                renderCell: renderWithTooltip,
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
                width: 170,
                sortable: true,
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
                                onClick={() =>{
                                    handleViewMember(params.row.id)
                                }
                                }
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setSelectedMemberId(params.row.id);
                                    setOpenEdit(true);
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                    handleDeleteMember(
                                        params.row.id
                                    )
                                }
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
            }
        ],
        []
    );

    return (
        <Box
            sx={{
                background: "#fff",
                padding: "25px",
                borderRadius: "20px",
                marginTop: "40px",
                boxShadow:
                    "0 10px 30px rgba(0,0,0,0.05)",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "calc(100vh - 120px)",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                }}
            >
                <DataGrid
                    ref={gridRef}
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    getRowId={(rows) => rows.id}
                    pageSizeOptions={[5, 10, 20]}

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}

                    slots={
                        showToolbar
                            ? {
                                toolbar: () => (
                                    <CustomToolbar
                                        exportExcel={exportExcel}
                                        onAdd={handleAddMember}
                                        entityName='Members' // dynamic prop
                                    />
                                ),
                            }
                            : {}
                    }

                    slotProps={{
                        toolbar: {
                            exportExcel: exportExcel,
                            onAdd: handleAddMember,
                        },
                    }}

                    showToolbar={showToolbar}

                    sx={{
                        border: 0,
                        width: "100%",

                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f3f4f6",
                            fontSize: "14px",
                            fontWeight: "bold",
                        },

                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#f9fafb",
                        },

                        "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid #f1f1f1",
                            fontSize: "13px",
                            alignItems: "center",
                        },

                        "& .MuiDataGrid-row": {
                            minHeight: "42px !important",
                            maxHeight: "42px !important",
                        },
                    }}
                />
            </Box>
            <MemberViewDialog
                open={openView}
                onClose={() => setOpenView(false)}
                member={selectedMember}
            />
            <EditMemberDrawer
                open={openEdit}
                memberId={selectedMemberId}
                onClose={() =>
                    setOpenEdit(false)
                }
                onSaveSuccess={() =>
                    fetchMembers()
                }
            />
        </Box>
    );
}

export default MemberGrid;