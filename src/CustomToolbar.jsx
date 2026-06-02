import React from 'react';

import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import {
    Typography,
    Tooltip,
    IconButton,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';

function CustomToolbar({
    exportExcel,
    onAdd,
    entityName = 'Company', // dynamic prop
}) {

    return (
        
        <GridToolbarContainer
            sx={{
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                width: '100%',
            }}
        >

            {/* Left Side Title */}
            <Typography
                variant="h6"
                fontWeight="medium"
                sx={{
                    color: 'primary.main',
                    textUnderlineOffset: '4px',
                    whiteSpace: 'nowrap',
                    marginRight: '20px',
                }}
            >
              {entityName} List
            </Typography>

            {/* Right Side */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginLeft: 'auto',
                }}
            >

                {/* Search */}
                <div
                    style={{
                        marginLeft: '12px',
                    }}
                >
                    <GridToolbarQuickFilter />
                </div>

                {/* Add */}
                <Tooltip title={`Add ${entityName}`}>
                    <IconButton
                        onClick={onAdd}
                    >
                        <AddIcon
                            sx={{
                                color: '#2563eb',
                            }}
                        />
                    </IconButton>
                </Tooltip>

                {/* Columns */}
                <GridToolbarColumnsButton />

                {/* Filters */}
                <GridToolbarFilterButton />

                {/* Export */}
                <Tooltip title="Export Excel">
                    <IconButton
                        onClick={exportExcel}
                    >
                        <FileDownloadIcon
                            sx={{
                                color: '#2563eb',
                            }}
                        />
                    </IconButton>
                </Tooltip>

                {/* Refresh */}
                <Tooltip title="Refresh">
                    <IconButton
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        <RefreshIcon
                            sx={{
                                color: '#2563eb',
                            }}
                        />
                    </IconButton>
                </Tooltip>



            </div>

        </GridToolbarContainer>
    );
}

export default CustomToolbar;