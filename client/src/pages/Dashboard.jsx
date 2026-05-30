import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import Text from "../components/Text";
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";

const TOTAL_STEPS = 3;

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function StatusBadge({ status }) {
  const isCompleted = status === "completed";

  return (
    <Box
      className={`status-badge ${isCompleted ? "status-badge--completed" : "status-badge--draft"}`}
    >
      <Box className="status-badge__dot" />
      {isCompleted ? "Completed" : "Draft"}
    </Box>
  );
}

function SubmissionActionButton({ isCompleted, onClick, compact = false }) {
  return (
    <Button
      className="dashboard-button"
      variant={isCompleted ? "outlined" : "contained"}
      endIcon={
        isCompleted ? (
          <VisibilityOutlinedIcon sx={{ fontSize: compact ? 16 : 18 }} />
        ) : (
          <ArrowForwardIcon sx={{ fontSize: compact ? 16 : 18 }} />
        )
      }
      onClick={onClick}
      sx={{
        borderRadius: "12px",
        px: compact ? 2 : 2.5,
        py: compact ? 0.75 : 1.1,
        minWidth: compact ? 130 : 160,
        textTransform: "none",
        fontWeight: 600,
        fontSize: compact ? "0.8125rem" : "0.9375rem",
        whiteSpace: "nowrap",
        ...(isCompleted && {
          color: "#7C3AED",
          borderColor: "#C4B5FD",
          "&:hover": {
            borderColor: "#8B5CF6",
            bgcolor: "#F5F3FF",
          },
        }),
      }}
    >
      {isCompleted ? "View Results" : "Continue"}
    </Button>
  );
}

function SubmissionProgress({ progress, fullWidth = false }) {
  return (
    <Box className={`submission-card__progress ${fullWidth ? "submission-card__progress--full" : ""}`}>
      <Box className="submission-card__progress-labels">
        <Text className="progress-label">PROGRESS</Text>
        <Text className="progress-percent">{progress}%</Text>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        className="progress-bar"
      />
    </Box>
  );
}

function SubmissionMeta({ submission, layout = "row" }) {
  const dateItem = (
    <Box className="card-meta-item">
      <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />
      <Text className="card-meta">
        Last updated: {formatDate(submission.updatedAt)}
      </Text>
    </Box>
  );

  const stepItem = (
    <Box className="card-meta-item">
      <AccessTimeOutlinedIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />
      <Text className="card-meta">
        Step {submission.currentStep} of {TOTAL_STEPS}
      </Text>
    </Box>
  );

  if (layout === "column") {
    return (
      <Stack spacing={1}>
        {dateItem}
        {stepItem}
      </Stack>
    );
  }

  return (
    <Box className="submission-card__meta-inner">
      {dateItem}
      {stepItem}
    </Box>
  );
}

function SubmissionListCard({ submission, onNavigate }) {
  const isCompleted = submission.status === "completed";
  const progress = Math.min(
    Math.round((submission.currentStep / TOTAL_STEPS) * 100),
    100
  );

  return (
    <Card elevation={0} className="submission-card submission-card--list">
      <CardContent className="submission-card__content">
        <Box className="submission-card__list-layout">
          <Box className="submission-card__list-body">
            <Box className="submission-card__title-row">
              <StatusBadge status={submission.status} />
              <Text className="card-title card-title--inline">
                Wellness Intake Form
              </Text>
            </Box>

            <Box className="submission-card__meta-row">
              <SubmissionMeta submission={submission} layout="row" />
            </Box>

            <SubmissionProgress progress={progress} />
          </Box>

          <Box className="submission-card__list-action">
            <SubmissionActionButton
              isCompleted={isCompleted}
              onClick={() => onNavigate(submission._id)}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SubmissionGridCard({ submission, onNavigate }) {
  const isCompleted = submission.status === "completed";
  const progress = Math.min(
    Math.round((submission.currentStep / TOTAL_STEPS) * 100),
    100
  );

  return (
    <Card elevation={0} className="submission-card submission-card--grid">
      <CardContent className="submission-card__content">
        <Box className="submission-card__grid-header">
          <StatusBadge status={submission.status} />
          <SubmissionActionButton
            isCompleted={isCompleted}
            onClick={() => onNavigate(submission._id)}
            compact
          />
        </Box>

        <Text className="card-title card-title--grid">
          Wellness Intake Form
        </Text>

        <Stack spacing={1} className="card-meta-stack" mb={2.5}>
          <SubmissionMeta submission={submission} layout="column" />
        </Stack>

        <SubmissionProgress progress={progress} fullWidth />
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const response = await api.get("/submissions");
    setSubmissions(response.data);
  };

  const createSubmission = async () => {
    try {
      const response = await api.post("/submissions");
      navigate(`/submit/${response.data._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch = "Wellness Intake Form"
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const statusFilterLabel =
    statusFilter === "all"
      ? "All Statuses"
      : statusFilter === "completed"
        ? "Completed"
        : "Draft";

  return (
    <>
      <Navbar />

      <Box className="dashboard-wrapper">
        <Box className="page-container">
          <Box className="dashboard-header">
            <Box>
              <Text component="h1" className="page-title">
                My Submissions
              </Text>
              <Text className="page-subtitle">
                Manage your wellness intake forms and track your progress through
                each assessment.
              </Text>
            </Box>

            <Button
              variant="contained"
              className="primary-btn"
              onClick={createSubmission}
              sx={{
                height: 44,
                px: 2.75,
                borderRadius: "14px",
                textTransform: "none",
                fontSize: "0.9375rem",
                fontWeight: 600,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              + New Submission
            </Button>
          </Box>

          <Card className="search-card" elevation={0}>
            <CardContent sx={{ py: "20px !important", px: "24px !important" }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                className="search-toolbar"
              >
                <TextField
                  placeholder="Search forms by title..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-field"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#9CA3AF", fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: "#F9FAFB",
                      borderRadius: "12px",
                      height: 48,
                      "& fieldset": { borderColor: "#E5E7EB" },
                    },
                  }}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  className="search-toolbar__controls"
                >
                  <Button
                    className="filter-btn"
                    endIcon={<FilterListIcon sx={{ fontSize: 18, color: "#6B7280" }} />}
                    onClick={(e) => setFilterAnchor(e.currentTarget)}
                  >
                    {statusFilterLabel}
                  </Button>

                  <Menu
                    anchorEl={filterAnchor}
                    open={Boolean(filterAnchor)}
                    onClose={() => setFilterAnchor(null)}
                    slotProps={{
                      paper: {
                        className: "filter-menu",
                        style: {
                          width: filterAnchor
                            ? filterAnchor.getBoundingClientRect().width
                            : undefined,
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setStatusFilter("all");
                        setFilterAnchor(null);
                      }}
                    >
                      All Statuses
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setStatusFilter("draft");
                        setFilterAnchor(null);
                      }}
                    >
                      Draft
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setStatusFilter("completed");
                        setFilterAnchor(null);
                      }}
                    >
                      Completed
                    </MenuItem>
                  </Menu>

                  <Divider
                    orientation="vertical"
                    flexItem
                    className="search-toolbar__divider"
                  />

                  <Box className="view-toggle-group">
                    <IconButton
                      className={`view-toggle-btn ${viewMode === "list" ? "view-toggle-btn--active" : ""}`}
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                    >
                      <ViewListIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    <IconButton
                      className={`view-toggle-btn ${viewMode === "grid" ? "view-toggle-btn--active" : ""}`}
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                    >
                      <GridViewIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {submissions.length === 0 ? (
            <Card className="empty-state-card" elevation={0}>
              <CardContent>
                <Text component="h2" className="empty-state-title">
                  No submissions yet
                </Text>
                <Text className="empty-state-text">
                  Create your first submission to get started.
                </Text>
              </CardContent>
            </Card>
          ) : (
            <>
              <Text className="submissions-count">
                Showing{" "}
                <span className="submissions-count__number">
                  {filteredSubmissions.length}
                </span>{" "}
                submission{filteredSubmissions.length !== 1 ? "s" : ""}
              </Text>

              <Box
                className={
                  viewMode === "grid" ? "submissions-grid" : "submissions-list"
                }
              >
                {filteredSubmissions.map((submission) =>
                  viewMode === "grid" ? (
                    <SubmissionGridCard
                      key={submission._id}
                      submission={submission}
                      onNavigate={(id) => navigate(`/submit/${id}`)}
                    />
                  ) : (
                    <SubmissionListCard
                      key={submission._id}
                      submission={submission}
                      onNavigate={(id) => navigate(`/submit/${id}`)}
                    />
                  )
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
