import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatRelativeTime } from "@/lib/utils";

// MUI Components
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";

// MUI Icons
import {
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  ErrorOutline as ErrorIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

// Define interfaces
interface Conversion {
  id: number;
  userId: number | null;
  originalText: string;
  transliteratedText: string;
  createdAt: string;
}

export function AndroidHistory() {
  const theme = useTheme();
  const [copySnackbar, setCopySnackbar] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [deleteSnackbar, setDeleteSnackbar] = useState(false);

  // Fetch history data
  const { 
    data: conversions = [],
    isLoading, 
    isError,
    refetch,
  } = useQuery({
    queryKey: ['/api/conversions'],
    select: (data) => data || []
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/api/conversions/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Close the dialog and show success message
      setDeleteDialog(null);
      setDeleteSnackbar(true);
      
      // Refetch the list to update UI
      refetch();
    },
    onError: (err) => {
      console.error('Error deleting conversion:', err);
      setDeleteDialog(null);
    },
  });

  // Handler for copying text
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySnackbar(true);
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };

  // Handler for deleting a conversion
  const handleDeleteConversion = (id: number) => {
    setDeleteDialog(id);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (deleteDialog) {
      deleteMutation.mutate(deleteDialog);
    }
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      pt: 6,
      pb: 4,
    }}>
      <HistoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No translation history yet
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ maxWidth: 300, mt: 1 }}
      >
        Your translation history will appear here once you start translating.
      </Typography>
    </Box>
  );

  // Render error state
  const renderErrorState = () => (
    <Box sx={{ p: 3 }}>
      <Alert 
        severity="error"
        icon={<ErrorIcon />}
        sx={{ borderRadius: 2 }}
      >
        Failed to load history. Please try again later.
      </Alert>
    </Box>
  );

  // Render loading state
  const renderLoadingState = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      py: 8
    }}>
      <CircularProgress size={40} />
    </Box>
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatRelativeTime(new Date(dateString));
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
    }}>
      {/* History Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Translation History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your recent translations
        </Typography>
      </Paper>
      
      {/* History List */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoading ? (
          renderLoadingState()
        ) : isError ? (
          renderErrorState()
        ) : conversions && conversions.length > 0 ? (
          <List disablePadding sx={{ overflow: 'auto' }}>
            {conversions.map((conversion: Conversion, index: number) => (
              <React.Fragment key={conversion.id}>
                <ListItem
                  sx={{ 
                    py: 2,
                    px: 2.5,
                    '&:active': {
                      backgroundColor: theme.palette.action.selected,
                    },
                    transition: 'background-color 0.2s',
                  }}
                  secondaryAction={
                    <Box>
                      <Tooltip title="Copy translation" placement="left">
                        <IconButton 
                          edge="end" 
                          onClick={() => handleCopyText(conversion.transliteratedText)}
                          sx={{
                            mr: 1,
                            transition: 'all 0.2s',
                            '&:active': {
                              transform: 'scale(0.95)',
                              backgroundColor: theme.palette.primary.main + '20',
                            },
                          }}
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="right">
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteConversion(conversion.id)}
                          color="error"
                          sx={{
                            transition: 'all 0.2s',
                            '&:active': {
                              transform: 'scale(0.95)',
                              backgroundColor: theme.palette.error.main + '20',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ mb: 1 }}>
                        <Typography 
                          variant="body1" 
                          component="span" 
                          sx={{ 
                            fontWeight: 500,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {conversion.originalText}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          color="primary" 
                          component="span"
                          sx={{ 
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 0.5,
                          }}
                        >
                          {conversion.transliteratedText}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          component="span"
                        >
                          {formatDate(conversion.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < conversions.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          renderEmptyState()
        )}
      </Paper>
      
      {/* Confirmation dialog */}
      <Dialog
        open={deleteDialog !== null}
        onClose={() => setDeleteDialog(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: '90%',
          }
        }}
      >
        <DialogTitle>Delete Translation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this translation from your history?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialog(null)}
            disabled={deleteMutation.isPending}
            sx={{
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            startIcon={deleteMutation.isPending && <CircularProgress size={18} color="inherit" />}
            sx={{
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Copy success notification */}
      <Snackbar
        open={copySnackbar}
        autoHideDuration={2000}
        onClose={() => setCopySnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setCopySnackbar(false)} 
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
      
      {/* Delete success notification */}
      <Snackbar
        open={deleteSnackbar}
        autoHideDuration={2000}
        onClose={() => setDeleteSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setDeleteSnackbar(false)} 
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          Translation deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}