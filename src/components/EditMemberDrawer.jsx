import React, { useEffect, useState } from "react";

import {
    Drawer,
    Box,
    Typography,
    Avatar,
    IconButton,
    Divider,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";

const API = import.meta.env.VITE_API_URL;

function EditMemberDrawer({
    open,
    onClose,
    memberId,
    onSaveSuccess,
}) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        Phone: "",
        Address: "",
        City: "",
        State: "",
        Zip: "",
        Birthday: "",
    });

    useEffect(() => {
        if (open && memberId) {
            fetchMember();
        }
    }, [open, memberId]);

    const fetchMember = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API}/api/auth/memberview/${memberId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            const member =
                Array.isArray(data)
                    ? data[0]
                    : data;
            //console.log(member);
            setFormData({
                FName:
                    member?.["First Name"] || "",
                LName:
                    member?.["Last Name"] || "",
                Email:
                    member?.Email || "",
                Phone:
                    member?.Phone || "",
                Address:
                    member?.["Mailing Address"] || "",
                City:
                    member?.City || "",
                State:
                    member?.State || "",
                Zip:
                    member?.Zip || "",
                Birthday:
                    member?.Birthday
                        ? member.Birthday.substring(
                            0,
                            10
                        )
                        : "",
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API}/api/auth/memberedit/${memberId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                        formData
                    ),
                }
            );
            console.log(formData);
            console.log(response);
            if (!response.ok) {
                throw new Error(
                    "Update failed"
                );
            }

            if (onSaveSuccess) {
                onSaveSuccess();
            }

            onClose();
        } catch (err) {
            console.log(err);
            alert(
                "Failed to update member"
            );
        } finally {
            setLoading(false);
        }
    };

    const glassInput = {
        mb: 2,
        "& .MuiOutlinedInput-root": {
            borderRadius: "18px",
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",

            "&:hover": {
                background: "rgba(255,255,255,0.9)",
            },

            "&.Mui-focused": {
                background: "#fff",
                boxShadow:
                    "0 0 0 4px rgba(37,99,235,0.15)",
            },
        },
    };

    const drawerStyle = {
        width: {
            xs: "100%",
            sm: "60%",
            md: "35%",
            lg: "25%",
        },

        minWidth: 380,
        maxWidth: 450,

        background:
            "linear-gradient(135deg,#eff6ff 0%,#f8fafc 40%,#ffffff 100%)",

        backdropFilter: "blur(30px)",

        boxShadow:
            "-20px 0 60px rgba(0,0,0,0.15)",

        overflow: "hidden",

        display: "flex",
        flexDirection: "column",
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        width: 450,
                        maxWidth: "95vw",

                        display: "flex",
                        flexDirection: "column",

                        overflow: "hidden",

                       

                        background:
                            "linear-gradient(135deg,#eff6ff 0%,#f8fafc 40%,#ffffff 100%)",

                        boxShadow:
                            "-10px 0 40px rgba(0,0,0,0.15)",
                    },
                },
            }}
        >
            {loading ? (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress size={50} />
                </Box>
            ) : (
                <>
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",
                            color: "#fff",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Edit Member
                            </Typography>

                            <IconButton
                                onClick={onClose}
                                sx={{
                                    color: "#fff",
                                    bgcolor:
                                        "rgba(255,255,255,0.15)",
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Scroll Area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                        }}
                    >
                        {/* Profile Card */}
                        <Box
                            sx={{
                                px: 4,
                                mt: -4,
                                position: "relative",
                                zIndex: 10,
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: "24px",
                                    background:
                                        "rgba(255,255,255,0.75)",
                                    backdropFilter:
                                        "blur(25px)",
                                    border:
                                        "1px solid rgba(255,255,255,0.5)",
                                    textAlign:
                                        "center",
                                    boxShadow:
                                        "0 15px 40px rgba(0,0,0,0.08)",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mx: "auto",
                                        mb: 3,
                                        background:
                                            "linear-gradient(135deg,#2563eb,#60a5fa)",
                                        boxShadow:
                                            "0 10px 25px rgba(37,99,235,0.35)",
                                    }}
                                >
                                    <PersonIcon
                                        sx={{
                                            fontSize: 55,
                                        }}
                                    />
                                </Avatar>

                                <Typography
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                    }}
                                >
                                    {formData.FName}{" "}
                                    {formData.LName}
                                </Typography>

                                <Typography
                                    sx={{
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    Member Profile
                                </Typography>
                            </Box>
                        </Box>

                        {/* Form */}
                        <Box sx={{ p: 4 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="FName"
                                value={
                                    formData.FName
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                label="Last Name"
                                name="LName"
                                value={
                                    formData.LName
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                name="Email"
                                value={
                                    formData.Email
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="Phone"
                                value={
                                    formData.Phone
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                label="Mailing Address"
                                name="Address"
                                value={
                                    formData.Address
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                label="City"
                                name="City"
                                value={
                                    formData.City
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                label="State"
                                name="State"
                                value={
                                    formData.State
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                label="Zip Code"
                                name="Zip"
                                value={
                                    formData.Zip
                                }
                                onChange={
                                    handleChange
                                }
                                sx={glassInput}
                            />

                            <TextField
                                fullWidth
                                type="date"
                                label="Birthday"
                                name="Birthday"
                                value={
                                    formData.Birthday
                                }
                                onChange={
                                    handleChange
                                }
                                inputlabelprops={{
                                    shrink: true,
                                }}
                                sx={glassInput}
                            />
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box
                        sx={{
                            p: 3,
                            backdropFilter:
                                "blur(20px)",
                            background:
                                "rgba(255,255,255,0.85)",
                            borderTop:
                                "1px solid rgba(0,0,0,0.08)",
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                borderRadius:
                                    "14px",
                                px: 4,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={
                                <SaveIcon />
                            }
                            onClick={
                                handleSave
                            }
                            sx={{
                                borderRadius:
                                    "14px",
                                px: 4,
                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",
                                boxShadow:
                                    "0 8px 20px rgba(37,99,235,0.35)",

                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg,#1d4ed8,#2563eb)",
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </>
            )}
        </Drawer>
    );
}

export default EditMemberDrawer;