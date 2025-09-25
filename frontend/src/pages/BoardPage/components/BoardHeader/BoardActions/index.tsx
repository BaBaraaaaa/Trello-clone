import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Chip,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterListIcon,
  MoreHoriz as MoreHorizIcon,
  Person as PersonIcon,
  Palette as PaletteIcon,
  Archive as ArchiveIcon,
  ContentCopy as ContentCopyIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export interface FilterOptions {
  labels: string[];
  members: string[];
  dueDate: 'overdue' | 'today' | 'week' | 'none';
}

interface BoardActionsProps {
  isStarred: boolean;
  onToggleStar: () => void;
  onInvite?: () => void;
  onFilter?: (filters: FilterOptions) => void;
  onBoardAction?: (action: 'settings' | 'copy' | 'archive' | 'background') => void;
  currentFilters?: FilterOptions;
  availableLabels?: { id: string; name: string; color: string }[];
  availableMembers?: { id: string; name: string }[];
}

const BoardActions: React.FC<BoardActionsProps> = ({
  isStarred,
  onToggleStar,
  onInvite,
  onFilter,
  onBoardAction,
  currentFilters,
  availableLabels = [],
  availableMembers = [],
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(
    currentFilters || {
      labels: [],
      members: [],
      dueDate: 'none',
    }
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleBoardAction = (action: 'settings' | 'copy' | 'archive' | 'background') => {
    handleMenuClose();
    if (onBoardAction) {
      onBoardAction(action);
    }
  };

  const handleApplyFilters = () => {
    if (onFilter) {
      onFilter(tempFilters);
    }
    setIsFilterDialogOpen(false);
    handleFilterClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
      labels: [],
      members: [],
      dueDate: 'none',
    };
    setTempFilters(emptyFilters);
    if (onFilter) {
      onFilter(emptyFilters);
    }
  };

  const hasActiveFilters = currentFilters && (
    currentFilters.labels.length > 0 ||
    currentFilters.members.length > 0 ||
    currentFilters.dueDate !== 'none'
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Star Button */}
      <IconButton
        onClick={onToggleStar}
        sx={{
          color: isStarred ? '#ffd700' : 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            color: '#ffd700',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {isStarred ? <StarIcon /> : <StarBorderIcon />}
      </IconButton>

      {/* Invite Button */}
      {onInvite && (
        <Button
          startIcon={<PersonIcon />}
          variant="outlined"
          size="small"
          onClick={onInvite}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Invite
        </Button>
      )}

      {/* Filter Button */}
      <Button
        startIcon={<FilterListIcon />}
        variant="outlined"
        size="small"
        onClick={handleFilterOpen}
        sx={{
          color: hasActiveFilters ? '#ffd700' : 'white',
          borderColor: hasActiveFilters ? '#ffd700' : 'rgba(255, 255, 255, 0.3)',
          '&:hover': {
            borderColor: hasActiveFilters ? '#ffd700' : 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        Filter {hasActiveFilters && '●'}
      </Button>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 200, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={() => setIsFilterDialogOpen(true)}>
          <FilterListIcon sx={{ mr: 1 }} />
          Advanced Filters
        </MenuItem>
        {hasActiveFilters && (
          <MenuItem onClick={handleClearFilters}>
            <CloseIcon sx={{ mr: 1 }} />
            Clear All Filters
          </MenuItem>
        )}
      </Menu>

      {/* Board Menu Button */}
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <MoreHorizIcon />
      </IconButton>

      {/* Board Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 200, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={() => handleBoardAction('settings')}>
          <SettingsIcon sx={{ mr: 1 }} />
          Board Settings
        </MenuItem>
        <MenuItem onClick={() => handleBoardAction('background')}>
          <PaletteIcon sx={{ mr: 1 }} />
          Change Background
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleBoardAction('copy')}>
          <ContentCopyIcon sx={{ mr: 1 }} />
          Copy Board
        </MenuItem>
        <MenuItem onClick={() => handleBoardAction('archive')}>
          <ArchiveIcon sx={{ mr: 1 }} />
          Archive Board
        </MenuItem>
      </Menu>

      {/* Advanced Filter Dialog */}
      <Dialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>Filter Cards</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Labels Filter */}
            <FormControl fullWidth>
              <InputLabel>Labels</InputLabel>
              <Select
                multiple
                value={tempFilters.labels}
                onChange={(e) => setTempFilters({
                  ...tempFilters,
                  labels: typeof e.target.value === 'string' ? [e.target.value] : e.target.value
                })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const label = availableLabels.find(l => l.id === value);
                      return (
                        <Chip
                          key={value}
                          label={label?.name || value}
                          size="small"
                          sx={{ bgcolor: label?.color || 'primary.main', color: 'white' }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableLabels.map((label) => (
                  <MenuItem key={label.id} value={label.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          backgroundColor: label.color,
                          borderRadius: 0.5,
                        }}
                      />
                      {label.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Members Filter */}
            <FormControl fullWidth>
              <InputLabel>Members</InputLabel>
              <Select
                multiple
                value={tempFilters.members}
                onChange={(e) => setTempFilters({
                  ...tempFilters,
                  members: typeof e.target.value === 'string' ? [e.target.value] : e.target.value
                })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const member = availableMembers.find(m => m.id === value);
                      return (
                        <Chip
                          key={value}
                          label={member?.name || value}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Due Date Filter */}
            <FormControl fullWidth>
              <InputLabel>Due Date</InputLabel>
              <Select
                value={tempFilters.dueDate}
                onChange={(e) => setTempFilters({
                  ...tempFilters,
                  dueDate: e.target.value as FilterOptions['dueDate']
                })}
              >
                <MenuItem value="none">All cards</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="today">Due today</MenuItem>
                <MenuItem value="week">Due this week</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFilterDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleClearFilters} color="warning">
            Clear All
          </Button>
          <Button onClick={handleApplyFilters} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BoardActions;