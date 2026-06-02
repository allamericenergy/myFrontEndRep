import React from "react";

import {
    Drawer,
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Divider,
    Paper,
    Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
//import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function MemberViewDrawer({
    open,
    onClose,
    member,
}) {
    if (!member) return null;

    const InfoItem = ({
        icon,
        label,
        value,
    }) => (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 0.5,
                }}
            >
                {icon}

                <Typography
                    sx={{
                        fontWeight: 600,
                        color: "#374151",
                        fontSize: "15px",
                    }}
                >
                    {label}
                </Typography>
            </Box>

            <Typography
                sx={{
                    ml: 4.5,
                    color: "#6b7280",
                    fontSize: "15px",
                }}
            >
                {value || "-"}
            </Typography>
        </Box>
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 450,
                    maxWidth: "95vw",

                    display: "flex",
                    flexDirection: "column",

                    overflow: "hidden",

                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,

                    background:
                        "linear-gradient(135deg,#eff6ff 0%,#f8fafc 40%,#ffffff 100%)",

                    boxShadow:
                        "-10px 0 40px rgba(0,0,0,0.15)",
                },
            }}
        >
            {/* Header */}

            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#ffffff",
                    borderBottom:
                        "1px solid #e5e7eb",
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: "22px",
                        color: "#374151",
                    }}
                >
                    Member Information
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Chip
                        label="Active"
                        color="success"
                        size="small"
                    />

                    <IconButton
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Profile */}

            <Box
                sx={{
                    textAlign: "center",
                    py: 4,
                }}
            >
                <Avatar
                    sx={{
                        width: 150,
                        height: 150,
                        mx: "auto",
                        mb: 2,
                        bgcolor: "#2563eb",
                        fontSize: 60,
                        fontWeight: 700,
                    }}
                >
                    {member?.Name?.charAt(0)}
                </Avatar>

                <Typography
                    sx={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#374151",
                    }}
                >
                    {member?.Name}
                </Typography>
            </Box>

            <Divider />

            {/* Details */}

            <Box sx={{ p: 3 }}>
                <InfoItem
                    icon={
                        <EmailOutlinedIcon
                            color="action"
                        />
                    }
                    label="Email"
                    value={member?.Email}
                />

                <InfoItem
                    icon={
                        <PhoneOutlinedIcon
                            color="action"
                        />
                    }
                    label="Phone"
                    value={member?.Phone}
                />

                <InfoItem
                    icon={
                        <CakeOutlinedIcon
                            color="action"
                        />
                    }
                    label="Birthday"
                    value={member?.Birthday}
                />

                <InfoItem
                    icon={
                        <LocationOnOutlinedIcon
                            color="action"
                        />
                    }
                    label="Address"
                    value={`${member?.Address || ""}
                    ${member?.City || ""}
                    ${member?.State || ""}
                    ${member?.Zip || ""}`}
                />

                <Divider sx={{ my: 3 }} />

                {/* Member Details */}

                <Typography
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: "18px",
                        color: "#374151",
                    }}
                >
                    Member Details
                </Typography>

                <Stack spacing={1.5}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            bgcolor: "#ffffff",
                        }}
                    >
                        <Typography
                            color="primary"
                        >
                            Member ID :{" "}
                            {member?.id}
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            bgcolor: "#ffffff",
                        }}
                    >
                        <Typography
                            color="primary"
                        >
                            State :{" "}
                            {member?.State}
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            bgcolor: "#ffffff",
                        }}
                    >
                        <Typography
                            color="primary"
                        >
                            City :{" "}
                            {member?.City}
                        </Typography>
                    </Paper>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Roles Section */}

                <Typography
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: "18px",
                    }}
                >
                    Companies
                </Typography>

                <Paper
                    sx={{
                        p: 1.5,
                        bgcolor: "#ffffff",
                        color: "#0284c7",
                        mb: 1,
                    }}
                >
                    Company Name Here
                </Paper>

                <Paper
                    sx={{
                        p: 1.5,
                        bgcolor: "#ffffff",
                        color: "#0284c7",
                    }}
                >
                    Additional Company
                </Paper>
            </Box>
        </Drawer>
    );
}

export default MemberViewDrawer;