import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Stack
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar
} from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { cachedApiService } from '../../services/api/CachedApiService';
import LoadingButton from '@mui/lab/LoadingButton';
import SyncIcon from '@mui/icons-material/Sync';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

interface FirebaseOrder {
  firebaseId: string;
  name: string;
  createdAt: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  totalPriceSet?: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
}

export const OpenOrders: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<FirebaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const columns: GridColDef<FirebaseOrder>[] = [
    { 
      field: 'name', 
      headerName: 'Order #', 
      width: 130,
      filterable: true 
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At', 
      width: 200,
      valueFormatter: (params: { value: any }) => {
        if (!params.value) return '';
        return new Date(params.value as string).toLocaleString();
      },
      sortable: true
    },
    { 
      field: 'customer',
      headerName: 'Customer',
      width: 200,
      renderCell: (params: GridRenderCellParams<FirebaseOrder>) => {
        const customer = params.row.customer;
        if (!customer) return 'N/A';
        return `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A';
      },
      filterable: true,
      sortable: true
    },
    { 
      field: 'displayFulfillmentStatus', 
      headerName: 'Fulfillment', 
      width: 130,
      filterable: true 
    },
    { 
      field: 'displayFinancialStatus', 
      headerName: 'Payment', 
      width: 130,
      filterable: true 
    },
    {
      field: 'totalPrice',
      headerName: 'Total',
      width: 130,
      renderCell: (params: GridRenderCellParams<FirebaseOrder>) => {
        const money = params.row.totalPriceSet?.shopMoney;
        if (!money) return 'N/A';
        return `${money.amount} ${money.currencyCode}`;
      },
      sortable: true
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: GridRenderCellParams<FirebaseOrder>) => {
        return (
          <IconButton onClick={() => setSelectedOrder(params.row)}>
            <VisibilityIcon />
          </IconButton>
        );
      }
    }
  ];

  // Fetch all orders at once
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const response = await cachedApiService.getAllFirebaseOrders();
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!data?.orders || !searchTerm) return data?.orders || [];

    return data.orders.filter((order: FirebaseOrder) => {
      const searchString = searchTerm.toLowerCase();
      const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase();
      
      return (
        order.name.toLowerCase().includes(searchString) ||
        customerName.includes(searchString) ||
        order.displayFulfillmentStatus.toLowerCase().includes(searchString) ||
        order.displayFinancialStatus.toLowerCase().includes(searchString)
      );
    });
  }, [data?.orders, searchTerm]);

  // Add sync handlers
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await cachedApiService.syncOrders();
      const response = await cachedApiService.getAllFirebaseOrders();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync orders');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setIsSyncingAll(true);
      await cachedApiService.syncAllOrders();
      const response = await cachedApiService.getAllFirebaseOrders();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync all orders');
    } finally {
      setIsSyncingAll(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">
            Orders ({filteredOrders.length})
          </Typography>
          <Button
            disabled={isSyncing}
            startIcon={<SyncIcon />}
            variant="contained"
            onClick={handleSync}
            size="small"
          >
            {isSyncing ? 'Syncing...' : 'Sync Recent'}
          </Button>
          <Button
            disabled={isSyncingAll}
            startIcon={<CloudSyncIcon />}
            variant="contained"
            onClick={handleSyncAll}
            size="small"
          >
            {isSyncingAll ? 'Syncing...' : 'Sync All'}
          </Button>
        </Stack>
        
        <TextField
          label="Search orders"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        <Box sx={{ height: 'calc(100vh - 250px)', width: '100%' }}>
          <DataGrid<FirebaseOrder>
            rows={filteredOrders}
            columns={columns}
            getRowId={(row) => row.firebaseId}
            disableRowSelectionOnClick
            loading={loading}
            autoHeight={false}
            slots={{
              toolbar: GridToolbar
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'createdAt', sort: 'desc' }]
              }
            }}
            density="compact"
          />
        </Box>
      </Stack>

      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details
          <IconButton
            onClick={() => setSelectedOrder(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <pre style={{ overflow: 'auto', maxHeight: '70vh' }}>
                {JSON.stringify(selectedOrder, null, 2)}
              </pre>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setSelectedOrder(null)}>Close</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 