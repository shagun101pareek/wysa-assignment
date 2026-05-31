import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const getStepInfo = (submission) => {
  const total = submission.totalSteps || 0;
  const completed = submission.completedSteps?.length || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, progress };
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function StatusBadge({ status }) {
  const isCompleted = status === "completed";

  return (
    <span
      className={`status-badge ${
        isCompleted ? "status-badge--completed" : "status-badge--draft"
      }`}
    >
      <span className="status-badge__dot" />
      {isCompleted ? "Completed" : "Draft"}
    </span>
  );
}

function SubmissionActionButton({ isCompleted, onClick, compact = false }) {
  return (
    <button
      className={`action-btn ${isCompleted ? "action-btn--outline" : ""} ${
        compact ? "action-btn--compact" : ""
      }`}
      onClick={onClick}
    >
      {isCompleted ? "View Results" : "Continue"}
      {isCompleted ? <VisibilityOutlinedIcon /> : <ArrowForwardIcon />}
    </button>
  );
}

function SubmissionProgress({ progress, fullWidth = false }) {
  return (
    <div
      className={`submission-card__progress ${
        fullWidth ? "submission-card__progress--full" : ""
      }`}
    >
      <div className="submission-card__progress-labels">
        <span className="progress-label">PROGRESS</span>
        <span className="progress-percent">{progress}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function SubmissionMeta({ submission, layout = "row" }) {
  const { total, completed } = getStepInfo(submission);

  const dateItem = (
    <div className="card-meta-item">
      <CalendarTodayOutlinedIcon />
      <span className="card-meta">
        Last updated: {formatDate(submission.updatedAt)}
      </span>
    </div>
  );

  const stepItem = (
    <div className="card-meta-item">
      <AccessTimeOutlinedIcon />
      <span className="card-meta">
        {completed} of {total} steps completed
      </span>
    </div>
  );

  if (layout === "column") {
    return (
      <div className="card-meta-stack">
        {dateItem}
        {stepItem}
      </div>
    );
  }

  return (
    <div className="submission-card__meta-inner">
      {dateItem}
      {stepItem}
    </div>
  );
}

function SubmissionListCard({ submission, onNavigate }) {
  const isCompleted = submission.status === "completed";
  const { progress } = getStepInfo(submission);

  return (
    <div className="submission-card submission-card--list">
      <div className="submission-card__content">
        <div className="submission-card__list-layout">
          <div className="submission-card__list-body">
            <div className="submission-card__title-row">
              <StatusBadge status={submission.status} />
              <span className="card-title card-title--inline">
                {submission.title}
              </span>
            </div>

            <div className="submission-card__meta-row">
              <SubmissionMeta submission={submission} layout="row" />
            </div>

            <SubmissionProgress progress={progress} />
          </div>

          <div className="submission-card__list-action">
            <SubmissionActionButton
              isCompleted={isCompleted}
              onClick={() => onNavigate(submission._id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionGridCard({ submission, onNavigate }) {
  const isCompleted = submission.status === "completed";
  const { progress } = getStepInfo(submission);

  return (
    <div className="submission-card submission-card--grid">
      <div className="submission-card__content">
        <div className="submission-card__grid-header">
          <StatusBadge status={submission.status} />
          <SubmissionActionButton
            isCompleted={isCompleted}
            onClick={() => onNavigate(submission._id)}
            compact
          />
        </div>

        <span className="card-title card-title--grid">
          {submission.title}
        </span>

        <div className="card-meta-stack card-meta-stack--grid">
          <SubmissionMeta submission={submission} layout="column" />
        </div>

        <SubmissionProgress progress={progress} fullWidth />
      </div>
    </div>
  );
}

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchSubmissions = async () => {
    const response = await api.get("/submissions");
    setSubmissions(response.data);
  };

  const openCreateModal = () => {
    setNewTitle("");
    setCreateOpen(true);
  };

  const createSubmission = () => {
    setCreateOpen(false);
    navigate("/submit/new", { state: { title: newTitle.trim() } });
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch = (submission.title || "")
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

  const selectFilter = (value) => {
    setStatusFilter(value);
    setFilterOpen(false);
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-wrapper">
        <div className="page-container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">My Submissions</h1>
              <p className="page-subtitle">
                Manage your wellness intake forms and track your progress through
                each assessment.
              </p>
            </div>

            <button className="primary-btn" onClick={openCreateModal}>
              + New Submission
            </button>
          </div>

          <div className="search-card">
            <div className="search-card__body">
              <div className="search-toolbar">
                <div className="search-input-wrap">
                  <SearchIcon />
                  <input
                    className="search-input"
                    placeholder="Search forms by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="search-toolbar__controls">
                  <div className="filter-dropdown">
                    <button
                      className="filter-btn"
                      onClick={() => setFilterOpen((open) => !open)}
                    >
                      {statusFilterLabel}
                      <FilterListIcon />
                    </button>

                    {filterOpen && (
                      <>
                        <div
                          className="filter-backdrop"
                          onClick={() => setFilterOpen(false)}
                        />
                        <div className="filter-menu">
                          <button
                            className="filter-menu__item"
                            onClick={() => selectFilter("all")}
                          >
                            All Statuses
                          </button>
                          <button
                            className="filter-menu__item"
                            onClick={() => selectFilter("draft")}
                          >
                            Draft
                          </button>
                          <button
                            className="filter-menu__item"
                            onClick={() => selectFilter("completed")}
                          >
                            Completed
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <span className="divider-vertical" />

                  <div className="view-toggle-group">
                    <button
                      className={`view-toggle-btn ${
                        viewMode === "list" ? "view-toggle-btn--active" : ""
                      }`}
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                    >
                      <ViewListIcon />
                    </button>

                    <button
                      className={`view-toggle-btn ${
                        viewMode === "grid" ? "view-toggle-btn--active" : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                    >
                      <GridViewIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="empty-state-card">
              <h2 className="empty-state-title">No submissions yet</h2>
              <p className="empty-state-text">
                Create your first submission to get started.
              </p>
            </div>
          ) : (
            <>
              <p className="submissions-count">
                Showing{" "}
                <span className="submissions-count__number">
                  {filteredSubmissions.length}
                </span>{" "}
                submission{filteredSubmissions.length !== 1 ? "s" : ""}
              </p>

              <div
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
              </div>
            </>
          )}
        </div>
      </div>

      {createOpen && (
        <div className="modal-overlay" onClick={() => setCreateOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Create new submission</h2>
            <p className="modal__subtitle">
              Give this form a name so you can find it later. Leave it blank to
              use a default name.
            </p>

            <label className="form-label" htmlFor="new-submission-title">
              Submission title
            </label>
            <input
              id="new-submission-title"
              className="form-input"
              type="text"
              maxLength={80}
              autoFocus
              placeholder="e.g. My Wellness Check-in"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createSubmission();
              }}
            />

            <div className="modal__actions">
              <button
                className="btn btn--ghost"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn--primary" onClick={createSubmission}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast toast--success" role="status">
          <CheckCircleOutlinedIcon />
          {toast}
        </div>
      )}
    </>
  );
}

export default Dashboard;
