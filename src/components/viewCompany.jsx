import React, { useEffect, useState } from 'react';

import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    CircularProgress,
    Table,
    TableBody,
    TableRow,
    TableCell,
    useTheme,
    useMediaQuery,
} from '@mui/material';

import { useParams } from 'react-router-dom';

import BusinessIcon from '@mui/icons-material/Business';

import CompanyMeterList from './CompanyMeterList.jsx';
import CompanyMemberList from './CompanyMemberList.jsx';
import CompanyContractList from './CompanyContractList.jsx';
import CFoldersFiles from './companyFoldersFiles.jsx';
import FoldersFilles from './viewContractFileList.jsx';
import Layout from '../components/Layout';

const API = import.meta.env.VITE_API_URL;

const ViewCompany = () => {

    const { id } = useParams();

    const [company, setCompany] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchCompany = async () => {

            try {

                setLoading(true);

                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${API}/api/auth/company/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                setCompany(data);

            } catch (err) {

                console.log(err);

                setError(err.message);

            } finally {

                setLoading(false);
            }
        };

        if (id) {
            fetchCompany();
        }

    }, [id]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error">
                Error loading company
            </Typography>
        );
    }

    if (!company) {
        return (
            <Typography>
                No company found
            </Typography>
        );
    }

    return (
        <ShowCompany company={company} />
    );
};

export default ViewCompany;

const NotesList = ({ company }) => {

    const [notes, setNotes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchNotes = async () => {

            try {

                setLoading(true);

                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${API}/api/auth/companyPosts/${company?.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                setNotes(data);

            } catch (err) {

                console.log(err);

                setError(err.message);

            } finally {

                setLoading(false);
            }
        };

        if (company?.id) {
            fetchNotes();
        }

    }, [company?.id]);

    if (loading) {
        return <Typography>Loading posts...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error loading posts</Typography>;
    }

    if (!notes || notes.length === 0) {
        return <Typography>No posts</Typography>;
    }

    return (

        <Box>

            {
                notes.map((note) => (

                    <Box
                        key={note.id}
                        sx={{
                            mb: 2,
                            p: 1.5,
                            borderBottom: '1px solid #ececec',
                            wordBreak: 'break-word',
                        }}
                    >

                        <Typography
                            fontWeight={700}
                            fontSize="14px"
                            mb={1}
                        >
                            {note.title}
                        </Typography>

                        <Typography
                            fontSize="12px"
                            color="#666"
                        >
                            {note.body}
                        </Typography>

                    </Box>
                ))
            }

        </Box>
    );
};

const InfoRow = ({ label, value }) => (

    <TableRow>

        <TableCell
            sx={{
                width: {
                    xs: '40%',
                    sm: '35%',
                },
                fontWeight: 700,
                fontSize: '12px',
                borderBottom: '1px solid #eee',
                verticalAlign: 'top',
                px: 1,
                py: 1.5,
                wordBreak: 'break-word',
            }}
        >
            {label}
        </TableCell>

        <TableCell
            sx={{
                backgroundColor: '#F7F7F7',
                fontSize: '12px',
                borderBottom: '1px solid #eee',
                borderRadius: '6px',
                px: 1,
                py: 1.5,
                wordBreak: 'break-word',
            }}
        >
            {value || '-'}
        </TableCell>

    </TableRow>
);

const SectionCard = ({ children, title }) => (

    <Box
        sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '16px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            width: '100%',
        }}
    >

        <Box
            sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid #ececec',
                backgroundColor: '#fafafa',
            }}
        >
            <Typography
                fontWeight={700}
                fontSize={{
                    xs: '14px',
                    sm: '15px',
                }}
            >
                {title}
            </Typography>
        </Box>

        <Box
            sx={{
                p: {
                    xs: 1.5,
                    sm: 2,
                },
            }}
        >
            {children}
        </Box>

    </Box>
);

const ShowCompany = ({ company }) => {

    const cid = company?.id?.toString();

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Layout title="Company Details">

            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: '#f5f7fb',
                    p: {
                        xs: 1,
                        sm: 2,
                        md: 3,
                    },
                    overflowX: 'hidden',
                }}
            >

                <Card
                    sx={{
                        width: '100%',
                        borderRadius: {
                            xs: '12px',
                            sm: '18px',
                        },
                        overflow: 'hidden',
                        boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
                    }}
                >

                    <CardContent
                        sx={{
                            p: {
                                xs: 1.5,
                                sm: 2,
                                md: 3,
                            },
                            '&:last-child': {
                                pb: {
                                    xs: 1.5,
                                    sm: 2,
                                    md: 3,
                                },
                            },
                        }}
                    >

                        {/* HEADER */}

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap',
                                gap: 1,
                                mb: 2,
                                width: '100%',
                                textAlign: 'left',
                            }}
                        >

                            <BusinessIcon
                                sx={{
                                    fontSize: {
                                        xs: 32,
                                        sm: 40,
                                    },
                                    color: '#1976d2',
                                }}
                            />

                            <Typography
                                variant={isMobile ? 'h5' : 'h4'}
                                fontWeight={700}
                                sx={{
                                    wordBreak: 'break-word',
                                    textAlign: 'left',
                                }}
                            >
                                {company['Company Name']}
                            </Typography>

                        </Box>

                        <Typography
                            sx={{
                                fontSize: '12px',
                                color: '#666',
                                mb: 3,
                                textAlign: 'left',
                            }}
                        >
                            Company &gt; Account
                        </Typography>

                        {/* ROW 1 */}

                        <Stack
                            direction={{ xs: 'column', xl: 'row' }}
                            spacing={2}
                            alignitems="stretch"
                        >

                            {/* ACCOUNT INFO */}

                            <Box
                                sx={{
                                    width: {
                                        xs: '100%',
                                        xl: '350px',
                                    },
                                    flexShrink: 0,
                                }}
                            >

                                <SectionCard title="Account Information">

                                    <Table size="small">

                                        <TableBody>

                                            <InfoRow
                                                label="Company ID"
                                                value={company['Customer ID']}
                                            />

                                            <InfoRow
                                                label="Company Name"
                                                value={company['Company Name']}
                                            />

                                            <InfoRow
                                                label="Legal Name"
                                                value={company['Legal Entity Name']}
                                            />

                                            <InfoRow
                                                label="Address"
                                                value={company['Mailing Address']}
                                            />

                                            <InfoRow
                                                label="Phone"
                                                value={company['Phone Number']}
                                            />

                                            <InfoRow
                                                label="Tax ID"
                                                value={company['Tax ID']}
                                            />

                                            <InfoRow
                                                label="Website"
                                                value={company['URL']}
                                            />

                                        </TableBody>

                                    </Table>

                                </SectionCard>

                            </Box>

                            {/* CONTRACTS */}

                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    width: '100%',
                                }}
                            >

                                <SectionCard title="Contracts">

                                    <Box
                                        sx={{
                                            width: '100%',
                                            overflowX: 'auto',
                                        }}
                                    >
                                        <CompanyContractList storeKey={cid} />
                                    </Box>

                                </SectionCard>

                            </Box>

                        </Stack>

                        {/* ROW 2 */}

                        <Stack
                            direction={{ xs: 'column', xl: 'row' }}
                            spacing={2}
                            mt={2}
                        >

                            {/* NOTES */}

                            <Box
                                sx={{
                                    width: {
                                        xs: '100%',
                                        xl: '350px',
                                    },
                                    flexShrink: 0,
                                }}
                            >

                                <SectionCard title="Notes">

                                    <Box
                                        sx={{
                                            maxHeight: {
                                                xs: '300px',
                                                md: '500px',
                                            },
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <NotesList company={company} />
                                    </Box>

                                </SectionCard>

                            </Box>

                            {/* METER GRID */}

                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    width: '100%',
                                }}
                            >

                                <SectionCard title="Meters">

                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: {
                                                xs: '400px',
                                                md: '500px',
                                            },
                                            overflow: 'auto',
                                        }}
                                    >
                                        <CompanyMeterList storeKey={cid} />
                                    </Box>

                                </SectionCard>

                            </Box>

                        </Stack>

                        {/* ROW 3 */}

                        <Stack
                            direction={{ xs: 'column', xl: 'row' }}
                            spacing={2}
                            mt={2}
                        >

                            {/* FILES */}

                            <Box
                                sx={{
                                    width: {
                                        xs: '100%',
                                        xl: '350px',
                                    },
                                    flexShrink: 0,
                                }}
                            >

                                <SectionCard title="Files & Bills">

                                    <Box
                                        sx={{
                                            overflowX: 'auto',
                                        }}
                                    >
                                        <FoldersFilles storeKey={cid} />
                                    </Box>

                                </SectionCard>

                            </Box>

                            {/* MEMBERS */}

                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    width: '100%',
                                }}
                            >

                                <SectionCard title="Members">

                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: {
                                                xs: '400px',
                                                md: '500px',
                                            },
                                            overflow: 'auto',
                                        }}
                                    >
                                        <CompanyMemberList storeKey={cid} />
                                    </Box>

                                </SectionCard>

                            </Box>

                        </Stack>

                    </CardContent>

                </Card>

            </Box>

        </Layout>
    );
};