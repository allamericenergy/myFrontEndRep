import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Link,
    Paper,
    Divider,
} from '@mui/material';
import axios from 'axios';
import { data } from 'react-router-dom';
import {
    SimpleTreeView,
    TreeItem,
} from '@mui/x-tree-view';
import FolderIcon from '@mui/icons-material/Folder';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
const ViewContractFileList = ({ storeKey,
    companyName,
    onFileClick,
    isViewerMode,
    hideViewMore,
}) => {

    const [contracts, setContracts] = useState([]);
    const [bills, setBills] = useState([]);

    console.log("Storekey : ", storeKey);

    useEffect(() => {

        if (storeKey) {
            fetchFiles();
        }

    }, [companyName]);

    const fetchFiles = async () => {

        try {

            const token = localStorage.getItem('token');

            console.log("Company...:", storeKey);

            const responseFolder = await fetch(
                `${API}/api/auth/companyFolder/${storeKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const dataFolder = await responseFolder.json();
            console.log("folders: ", dataFolder);

            const response = await fetch(
                `${API}/api/auth/company-files/${dataFolder.contractsFolderId}/${dataFolder.UtilityBillsfolderId}`,
                {

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                }
            );
            const data = await response.json();

            console.log("Files & Folders", data);
            setContracts(data.contracts || []);
            setBills(data.bills || []);

        } catch (error) {

            console.error('Error fetching files:', error);

        }
    };

    const navigate = useNavigate();

    const truncateFileName = (name) => {

        if (name.length > 15) {
            return name.substring(0, 15) + '...';
        }

        return name;
    };

    return (

        <Paper sx={{ p: 2, mt: 2 }}>

            {/* Contracts Tree Section */}

            <Box sx={{ mt: 1 }}>

                <Typography
                    variant="h6"
                    sx={{
                        mb: 1,
                        fontSize: '15px',
                        fontWeight: 600,
                    }}
                >
                    Contracts
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                {contracts.length > 0 ? (

                    <SimpleTreeView
                        sx={{

                            '& .MuiTreeItem-content': {
                                py: 0.2,
                                px: 0.4,
                                borderRadius: 1,
                                minHeight: 26,
                            },

                            '& .MuiTreeItem-label': {
                                fontSize: '12px',
                            },

                            '& .MuiTreeItem-iconContainer': {
                                width: 20,
                            },

                            '& .MuiTreeItem-groupTransition': {
                                ml: 1,
                                pl: 1,
                                borderLeft:
                                    '1px dashed #d1d1d1',
                            },

                        }}
                    >

                        <TreeItem
                            itemId="contracts-root"
                            label={

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.8,
                                        py: 0.2,
                                    }}
                                >

                                    <FolderIcon
                                        color="primary"
                                        sx={{
                                            fontSize: 18,
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '13px',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Contracts
                                    </Typography>

                                </Box>

                            }
                        >

                            {contracts.map((file, index) => (

                                <TreeItem
                                    key={`contract-${index}`}
                                    itemId={`contract-${index}`}
                                    label={

                                        <Box
                                            onClick={() => {

                                                if (isViewerMode) {

                                                    onFileClick(
                                                        file.webUrl || file.webURL
                                                    );

                                                } else {

                                                    navigate('/pdf-viewer', {
                                                        state: {
                                                            file,
                                                            contracts,
                                                            storeKey,
                                                            companyName,
                                                        },
                                                    });

                                                }

                                            }}
                                            sx={{
                                                display: 'flex',
                                                alignItems:
                                                    'center',
                                                gap: 0.8,
                                                cursor:
                                                    'pointer',
                                                py: 0.2,
                                                width:
                                                    'fit-content',
                                            }}
                                        >

                                            <PictureAsPdfIcon
                                                color="error"
                                                sx={{
                                                    fontSize: 16,
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        '12px',
                                                    lineHeight:
                                                        1.2,
                                                    maxWidth:
                                                        220,
                                                    overflow:
                                                        'hidden',
                                                    textOverflow:
                                                        'ellipsis',
                                                    whiteSpace:
                                                        'nowrap',
                                                }}
                                            >
                                                {truncateFileName(
                                                    file.name
                                                )}
                                            </Typography>

                                        </Box>

                                    }
                                />

                            ))}

                        </TreeItem>

                    </SimpleTreeView>

                ) : (

                    <Typography
                        sx={{
                            fontSize: '12px',
                            color:
                                'text.secondary',
                        }}
                    >
                        No contract files found.
                    </Typography>

                )}

            </Box>

            {/* Bills Tree Section */}

            <Box sx={{ mt: 3 }}>

                <Typography
                    variant="h6"
                    sx={{
                        mb: 1,
                        fontSize: '15px',
                        fontWeight: 600,
                    }}
                >
                    Bills
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                {bills.length > 0 ? (

                    <SimpleTreeView
                        sx={{

                            '& .MuiTreeItem-content': {
                                py: 0.2,
                                px: 0.4,
                                borderRadius: 1,
                                minHeight: 26,
                            },

                            '& .MuiTreeItem-label': {
                                fontSize: '12px',
                            },

                            '& .MuiTreeItem-iconContainer': {
                                width: 20,
                            },

                            '& .MuiTreeItem-groupTransition': {
                                ml: 1,
                                pl: 1,
                                borderLeft:
                                    '1px dashed #d1d1d1',
                            },

                        }}
                    >

                        {bills.map((folder, folderIndex) => (

                            <TreeItem
                                key={`folder-${folderIndex}`}
                                itemId={`folder-${folder.folderId || folderIndex}`}
                                label={

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems:
                                                'center',
                                            gap: 0.8,
                                            py: 0.2,
                                        }}
                                    >

                                        <FolderIcon
                                            color="primary"
                                            sx={{
                                                fontSize:
                                                    18,
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    500,
                                                fontSize:
                                                    '13px',
                                                lineHeight:
                                                    1.2,
                                            }}
                                        >
                                            {folder.folderName}
                                        </Typography>

                                    </Box>

                                }
                            >

                                {folder.files &&
                                    folder.files.length >
                                    0 ? (

                                    folder.files.map(
                                        (
                                            file,
                                            fileIndex
                                        ) => (

                                            <TreeItem
                                                key={`file-${fileIndex}`}
                                                itemId={`file-${folderIndex}-${fileIndex}`}
                                                label={

                                                    <Box
                                                        onClick={() => {

                                                            if (isViewerMode) {

                                                                onFileClick(
                                                                    file.webUrl || file.webURL
                                                                );

                                                            } else {

                                                                navigate('/pdf-viewer', {
                                                                    state: {
                                                                        file,
                                                                        folder,
                                                                        bills,
                                                                        storeKey,
                                                                        companyName,
                                                                    },
                                                                });

                                                            }

                                                        }}
                                                        sx={{
                                                            display:
                                                                'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 0.8,
                                                            cursor:
                                                                'pointer',
                                                            py: 0.2,
                                                            width:
                                                                'fit-content',
                                                        }}
                                                    >

                                                        <PictureAsPdfIcon
                                                            color="error"
                                                            sx={{
                                                                fontSize:
                                                                    16,
                                                            }}
                                                        />

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    '12px',
                                                                lineHeight:
                                                                    1.2,
                                                                maxWidth:
                                                                    220,
                                                                overflow:
                                                                    'hidden',
                                                                textOverflow:
                                                                    'ellipsis',
                                                                whiteSpace:
                                                                    'nowrap',
                                                            }}
                                                        >

                                                            {truncateFileName(
                                                                file.name
                                                            )}

                                                        </Typography>

                                                    </Box>

                                                }
                                            />

                                        )
                                    )

                                ) : (

                                    <TreeItem
                                        itemId={`empty-${folderIndex}`}
                                        label={

                                            <Typography
                                                sx={{
                                                    color:
                                                        'text.secondary',
                                                    fontStyle:
                                                        'italic',
                                                    fontSize:
                                                        '12px',
                                                }}
                                            >
                                                Empty Folder
                                            </Typography>

                                        }
                                    />

                                )}

                            </TreeItem>

                        ))}

                    </SimpleTreeView>

                ) : (

                    <Typography
                        sx={{
                            fontSize: '12px',
                            color:
                                'text.secondary',
                        }}
                    >
                        No bill folders found.
                    </Typography>

                )}

            </Box>
            {!hideViewMore && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 2,
                    }}
                >

                    <Typography
                        onClick={() =>
                            navigate(
                                '/pdf-viewer',
                                {
                                    state: {
                                        contracts,
                                        bills,
                                        storeKey,
                                        companyName,
                                    },
                                }
                            )
                        }
                        sx={{
                            fontSize: '12px',
                            color: 'primary.main',
                            cursor: 'pointer',
                            textDecoration: 'underline',

                            '&:hover': {
                                opacity: 0.8,
                            },
                        }}
                    >
                        View More
                    </Typography>

                </Box>
            )}
        </Paper>

    );
};

export default ViewContractFileList;