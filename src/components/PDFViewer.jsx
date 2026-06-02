import React, { useState } from 'react';

import {
    Box,
    Stack,
    Typography,
    Divider,
    Paper,
} from '@mui/material';

import { useLocation } from 'react-router-dom';

import {
    Viewer,
    Worker,
    TextDirection,
} from '@react-pdf-viewer/core';

import {
    defaultLayoutPlugin,
} from '@react-pdf-viewer/default-layout';

import {
    toolbarPlugin,
} from '@react-pdf-viewer/toolbar';

import {
    pageNavigationPlugin,
} from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/core/lib/styles/index.css';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import '@react-pdf-viewer/toolbar/lib/styles/index.css';

import ViewContractFileList from './viewContractFileList';

import Layout from '../components/Layout';

const PdfViewer = () => {

    const location = useLocation();

    const {
        file,
        storeKey,
        companyName,
    } = location.state || {};

    const [selectedFileUrl, setSelectedFileUrl] =
        useState(
            file?.webUrl ||
            file?.webURL ||
            null
        );

    const [selectedFileName, setSelectedFileName] =
        useState(
            file?.name || ''
        );

    const toolbarOptions = {

        getFilePlugin: {

            fileNameGenerator:
                () => 'document.pdf',

        },

    };

    const toolbarPluginInstance =
        toolbarPlugin(toolbarOptions);

    const pageNavigationPluginInstance =
        pageNavigationPlugin();

    const defaultLayoutPluginInstance =
        defaultLayoutPlugin({

            sidebarTabs: () => [],

            toolbarPlugin:
                toolbarPluginInstance,

            renderToolbar:
                (Toolbar) => (

                    <Toolbar>

                        {(slots) => {

                            const {

                                Download,

                                Print,

                                ZoomIn,

                                ZoomOut,

                                CurrentPageInput,

                                NumberOfPages,

                            } = slots;

                            return (

                                <Box
                                    sx={{

                                        display:
                                            'flex',

                                        alignItems:
                                            'center',

                                        width:
                                            '100%',

                                        px: 1,

                                    }}
                                >

                                    <ZoomOut />

                                    <ZoomIn />

                                    <Box
                                        sx={{

                                            display:
                                                'flex',

                                            alignItems:
                                                'center',

                                            bgcolor:
                                                '#f4f4f4',

                                            px: 1,

                                            py: 0.3,

                                            borderRadius:
                                                1,

                                            mx: 1,

                                            fontSize:
                                                '12px',

                                        }}
                                    >

                                        <CurrentPageInput />

                                        <Typography
                                            sx={{
                                                mx: 0.5,
                                            }}
                                        >
                                            /
                                        </Typography>

                                        <NumberOfPages />

                                    </Box>

                                    <Box
                                        sx={{
                                            ml: 'auto',
                                            display:
                                                'flex',
                                        }}
                                    >

                                        <Download />

                                        <Print />

                                    </Box>

                                </Box>

                            );

                        }}

                    </Toolbar>

                ),

        });

    const handleFileClick = (
        webUrl,
        fileName
    ) => {

        setSelectedFileUrl(
            webUrl
        );

        setSelectedFileName(
            fileName
        );

    };

    return (

        <Layout title="PDF Viewer">

            <Stack
                direction="row"
                spacing={0}
                sx={{

                    height:
                        'calc(100vh - 64px)',

                    overflow:
                        'hidden',

                    bgcolor:
                        '#fafafa',

                }}
            >

                {/* LEFT SIDEBAR */}

                <Paper
                    elevation={1}
                    sx={{

                        width: 320,

                        minWidth: 320,

                        overflowY:
                            'auto',

                        borderRadius:
                            0,

                        borderRight:
                            '1px solid #ddd',

                        bgcolor:
                            '#fff',

                    }}
                >

                    <Box
                        sx={{
                            p: 1.5,
                        }}
                    >

                        <Typography
                            sx={{

                                fontSize:
                                    '15px',

                                fontWeight:
                                    600,

                                mb: 1,

                            }}
                        >

                            {companyName ||
                                'Documents'}

                        </Typography>

                        <Divider
                            sx={{
                                mb: 1.5,
                            }}
                        />

                        <ViewContractFileList
                            storeKey={
                                storeKey
                            }
                            companyName={
                                companyName
                            }
                            onFileClick={
                                handleFileClick
                            }
                            isViewerMode={
                                true
                            }
                            hideViewMore={true}
                        />

                    </Box>

                </Paper>

                {/* PDF VIEWER */}

                <Box
                    sx={{

                        flexGrow: 1,

                        minWidth: 0,

                        display:
                            'flex',

                        flexDirection:
                            'column',

                        bgcolor:
                            '#f5f5f5',

                    }}
                >

                    {/* HEADER */}

                    <Box
                        sx={{

                            px: 2,

                            py: 1.2,

                            borderBottom:
                                '1px solid #ddd',

                            bgcolor:
                                '#fff',

                        }}
                    >

                        <Typography
                            sx={{

                                fontSize:
                                    '14px',

                                fontWeight:
                                    500,

                                overflow:
                                    'hidden',

                                textOverflow:
                                    'ellipsis',

                                whiteSpace:
                                    'nowrap',

                            }}
                        >

                            {selectedFileName ||
                                'Select a file'}

                        </Typography>

                    </Box>

                    {/* PDF VIEWER */}

                    <Box
                        sx={{

                            flexGrow: 1,

                            overflow:
                                'hidden',

                        }}
                    >

                        {selectedFileUrl ? (

                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">

                                <Viewer
                                    fileUrl={
                                        selectedFileUrl
                                    }
                                    plugins={[

                                        defaultLayoutPluginInstance,

                                        toolbarPluginInstance,

                                        pageNavigationPluginInstance,

                                    ]}
                                    theme={{

                                        theme:
                                            'light',

                                        direction:
                                            TextDirection.LeftToRight,

                                    }}
                                    defaultScale={
                                        1.1
                                    }
                                />

                            </Worker>

                        ) : (

                            <Box
                                sx={{

                                    height:
                                        '100%',

                                    display:
                                        'flex',

                                    justifyContent:
                                        'center',

                                    alignItems:
                                        'center',

                                }}
                            >

                                <Typography
                                    sx={{

                                        color:
                                            'text.secondary',

                                        fontSize:
                                            '14px',

                                    }}
                                >

                                    Select a PDF
                                    file to preview

                                </Typography>

                            </Box>

                        )}

                    </Box>

                </Box>

            </Stack>

        </Layout>

    );

};

export default PdfViewer;