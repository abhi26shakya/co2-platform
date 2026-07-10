"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  useReports,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
} from "@/hooks/use-reports";
import { useDashboard } from "@/hooks/use-dashboard";
import {
  FileText,
  FileSpreadsheet,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Star,
  Eye,
  Download,
  Share2,
  Trash2,
  Archive,
  History,
  MessageSquare,
  Send,
  Check,
  Globe,
  Lock,
  Clock,
  ExternalLink,
  ChevronDown,
  Printer,
  Maximize2,
  User,
  MoreVertical,
  Edit3,
  Copy,
  ChevronRight,
  FolderOpen,
  BarChart3,
  Map as MapIcon
} from "lucide-react";
import Link from "next/link";
import type { ReportOut, ReportComment, ReportVersion } from "@/types/report";

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useReports();
  const { data: dashboardStats } = useDashboard();
  const createReport = useCreateReport();
  const updateReport = useUpdateReport();
  const deleteReport = useDeleteReport();

  // State Management
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<
    "all" | "favorites" | "shared" | "archived" | "trash" | "pdf" | "csv" | "geojson"
  >("all");
  const [sortField, setSortField] = useState<
    "newest" | "oldest" | "downloads" | "confidence" | "name"
  >("newest");
  
  // Custom builder state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderTitle, setBuilderTitle] = useState("");
  const [builderDataset, setBuilderDataset] = useState("vindhyachal.tif");
  const [builderSections, setBuilderSections] = useState({
    summary: true,
    heatmap: true,
    charts: true,
    metadata: true,
    confidence: true,
    recommendations: true,
    appendix: false,
  });
  const [generatingProgress, setGeneratingProgress] = useState(-1);
  const [generatingStage, setGeneratingStage] = useState("");

  // Viewer states
  const [activeReport, setActiveReport] = useState<ReportOut | null>(null);
  const [viewerTab, setViewerTab] = useState<"summary" | "map" | "facilities" | "charts" | "comments" | "versions">("summary");
  
  // Interactive Map Options in Viewer
  const [mapZoom, setMapZoom] = useState(9);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [showPlumeHeatmap, setShowPlumeHeatmap] = useState(true);
  const [showFacilityMarkers, setShowFacilityMarkers] = useState(true);
  const [showMapLabels, setShowMapLabels] = useState(true);
  const [mapFullscreen, setMapFullscreen] = useState(false);

  // Comments state
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Share overlay inside list
  const [shareReport, setShareReport] = useState<ReportOut | null>(null);
  const [shareConfig, setShareConfig] = useState({
    permission: "public" as "private" | "organization" | "public",
    expiration: "never" as "never" | "24h" | "7d" | "30d",
    password: "",
  });
  const [shareSuccessLink, setShareSuccessLink] = useState("");

  // Actions menu dropdown active state
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Dynamic statistics
  const totalReports = reports.length;
  const favoritesCount = reports.filter((r) => r.is_favorite).length;
  const downloadsSum = reports.reduce((s, r) => s + (r.downloads_count || 0), 0);
  const sharesSum = reports.reduce((s, r) => s + (r.shares_count || 0), 0);
  const storageSum = Math.round(reports.reduce((s, r) => s + (r.size_mb || 0), 0) * 10) / 10;

  // Custom Report Builder triggers
  const triggerCustomReportGeneration = () => {
    if (generatingProgress >= 0) return;
    setGeneratingProgress(0);
    setGeneratingStage("Building Executive Summary...");

    const stages = [
      { progress: 25, stage: "Building Executive Summary..." },
      { progress: 50, stage: "Generating Charts..." },
      { progress: 75, stage: "Embedding Heatmap..." },
      { progress: 95, stage: "Preparing custom bundle..." },
      { progress: 100, stage: "Complete!" },
    ];

    let currentStageIdx = 0;
    const interval = setInterval(() => {
      if (currentStageIdx < stages.length) {
        setGeneratingProgress(stages[currentStageIdx].progress);
        setGeneratingStage(stages[currentStageIdx].stage);
        currentStageIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Trigger mutation post
          const isImg2 = builderDataset === "sasan.tif";
          createReport.mutate({
            title: builderTitle.trim() || `Custom CO2 Analysis (${builderDataset})`,
            dataset_name: builderDataset,
            satellite_source: "Sentinel-5P",
            region: isImg2 ? "Sasan Region, India" : "Vindhyachal Region, India",
            confidence_score: isImg2 ? 93.8 : 94.5,
            estimated_co2: isImg2 ? 3960 : 4760,
            detected_facilities: 1,
            size_mb: 2.8,
            format: "pdf",
            summary: `Custom report compiling analysis results for ${builderDataset} with focus on: ${Object.keys(builderSections).filter(k => builderSections[k as keyof typeof builderSections]).join(", ")}.`,
          });
          setGeneratingProgress(-1);
          setBuilderOpen(false);
          setBuilderTitle("");
        }, 500);
      }
    }, 800);
  };

  // Comments handler
  const handleAddComment = () => {
    if (!activeReport || !newCommentText.trim()) return;
    const newComment: ReportComment = {
      id: "comment-" + Math.random().toString(36).substring(7),
      author: "Abhishek Shakya",
      content: newCommentText.trim(),
      created_at: new Date().toISOString(),
      replies: [],
    };
    const updatedComments = [...(activeReport.comments || []), newComment];
    updateReport.mutate({
      id: activeReport.id,
      data: { comments: updatedComments },
    });
    // Optimistic UI updates
    setActiveReport({ ...activeReport, comments: updatedComments });
    setNewCommentText("");
  };

  const handleAddReply = (commentId: string) => {
    if (!activeReport || !replyText.trim()) return;
    const updatedComments = (activeReport.comments || []).map((c) => {
      if (c.id === commentId) {
        const replies = c.replies ? [...c.replies] : [];
        replies.push({
          id: "reply-" + Math.random().toString(36).substring(7),
          author: "Abhishek Shakya",
          content: replyText.trim(),
          created_at: new Date().toISOString(),
        });
        return { ...c, replies };
      }
      return c;
    });

    updateReport.mutate({
      id: activeReport.id,
      data: { comments: updatedComments },
    });
    setActiveReport({ ...activeReport, comments: updatedComments });
    setReplyText("");
    setReplyingToId(null);
  };

  // Version Restore Handler
  const handleRestoreVersion = (ver: string) => {
    if (!activeReport) return;
    const restoredVersions = [...activeReport.versions];
    restoredVersions.unshift({
      version: `v${activeReport.versions.length + 1}`,
      created_at: new Date().toISOString(),
      created_by: "Abhishek Shakya",
      description: `Restored back to state of version ${ver}`,
    });

    updateReport.mutate({
      id: activeReport.id,
      data: {
        versions: restoredVersions,
        title: `${activeReport.title} (${ver} Restored)`,
      },
    });

    setActiveReport({
      ...activeReport,
      versions: restoredVersions,
      title: `${activeReport.title} (${ver} Restored)`,
    });
  };

  // Inline Actions
  const toggleFavorite = (r: ReportOut) => {
    updateReport.mutate({
      id: r.id,
      data: { is_favorite: !r.is_favorite },
    });
  };

  const toggleArchive = (r: ReportOut) => {
    updateReport.mutate({
      id: r.id,
      data: { is_archived: !r.is_archived },
    });
    setActiveActionMenuId(null);
  };

  const handleRenameReport = (id: string, currentTitle: string) => {
    const nextName = prompt("Rename Report title:", currentTitle);
    if (nextName && nextName.trim()) {
      updateReport.mutate({
        id,
        data: { title: nextName.trim() },
      });
      if (activeReport?.id === id) {
        setActiveReport({ ...activeReport, title: nextName.trim() });
      }
    }
    setActiveActionMenuId(null);
  };

  const handleDuplicateReport = (r: ReportOut) => {
    createReport.mutate({
      title: `${r.title} (Copy)`,
      dataset_name: r.dataset_name,
      satellite_source: r.satellite_source,
      region: r.region,
      confidence_score: r.confidence_score,
      estimated_co2: r.estimated_co2,
      detected_facilities: r.detected_facilities,
      size_mb: r.size_mb,
      format: r.format,
      summary: r.summary,
      versions: [
        { version: "v1", created_at: new Date().toISOString(), created_by: "Abhishek Shakya", description: `Duplicated from ${r.title}` }
      ],
    });
    setActiveActionMenuId(null);
  };

  // Generate secure link flow
  const generateShareLink = (r: ReportOut) => {
    const expiryText = shareConfig.expiration === "never" ? "never expires" : `expires in ${shareConfig.expiration}`;
    const mockUrl = `https://co2-platform.github.vercel.app/share/report-${r.id.substring(0, 8)}`;
    setShareSuccessLink(mockUrl);
    
    // Track count
    updateReport.mutate({
      id: r.id,
      data: { shares_count: (r.shares_count || 0) + 1 },
    });
  };

  // Filtering Logic
  const filteredReports = reports
    .filter((r) => {
      // Soft deletion status
      if (filterTab === "trash") return r.is_deleted === true;
      if (r.is_deleted) return false;

      // Filter tabs
      if (filterTab === "favorites" && !r.is_favorite) return false;
      if (filterTab === "archived" && !r.is_archived) return false;
      if (filterTab === "all" && r.is_archived) return false; // Hide archived from standard view
      if (filterTab === "shared" && (r.shares_count || 0) === 0) return false;
      if (filterTab === "pdf" && r.format !== "pdf") return false;
      if (filterTab === "csv" && r.format !== "csv") return false;
      if (filterTab === "geojson" && r.format !== "geojson") return false;

      return true;
    })
    .filter((r) => {
      // Instant search matches
      const query = search.toLowerCase().trim();
      if (!query) return true;
      return (
        r.title.toLowerCase().includes(query) ||
        r.dataset_name.toLowerCase().includes(query) ||
        r.satellite_source.toLowerCase().includes(query) ||
        r.region.toLowerCase().includes(query) ||
        r.model_used.toLowerCase().includes(query)
      );
    });

  // Sorting Logic
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortField === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortField === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortField === "downloads") {
      return (b.downloads_count || 0) - (a.downloads_count || 0);
    }
    if (sortField === "confidence") {
      return (b.confidence_score || 0) - (a.confidence_score || 0);
    }
    if (sortField === "name") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in-50">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
            Reports Library
          </h1>
          <p className="mt-1 text-sm text-ground-400">
            Secure climate intelligence documentation, automated analytics, and dynamic heatmaps.
          </p>
        </div>
        <button
          onClick={() => setBuilderOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-sensor text-ground-950 px-4 py-2.5 text-sm font-medium transition-all hover:bg-sensor/90 cursor-pointer shadow-lg shadow-sensor/5"
        >
          <Plus className="h-4 w-4" /> Create Custom Report
        </button>
      </div>

      {/* Statistics dashboard */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Reports count", value: totalReports, desc: "Active bundle" },
          { label: "Total Downloads", value: downloadsSum, desc: "Across files" },
          { label: "Shared links", value: sharesSum, desc: "Public/Org access" },
          { label: "Favorites", value: favoritesCount, desc: "Pinned items" },
          { label: "Storage Used", value: `${storageSum} MB`, desc: "Permanently saved" },
        ].map((s, idx) => (
          <Card key={idx} className="p-4 bg-ground-900/40 border border-ground-700/80 hover:border-ground-400/40 transition-colors flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ground-400">{s.label}</span>
            <div className="mt-2.5">
              <span className="readout text-xl font-bold text-instrument">{s.value}</span>
              <p className="text-[10px] text-ground-500 mt-0.5">{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Control bar: Search, filters, sorting */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-ground-900/20 p-3 rounded-lg border border-ground-700/60">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ground-400" />
          <input
            type="text"
            placeholder="Search by report name, dataset, satellite, region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ground-950 border border-ground-700/80 rounded-lg text-sm placeholder-ground-500 focus:outline-none focus:border-ground-400 transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="h-4 w-4 text-ground-400" />
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="bg-ground-950 border border-ground-700/80 text-sm text-ground-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-ground-400 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="downloads">Most Downloaded</option>
            <option value="confidence">Highest Confidence</option>
            <option value="name">Alphabetically</option>
          </select>
        </div>
      </div>

      {/* Pill Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-ground-700/60 pb-2">
        {[
          { id: "all", label: "All Reports" },
          { id: "favorites", label: "Favorites" },
          { id: "shared", label: "Shared links" },
          { id: "archived", label: "Archived" },
          { id: "trash", label: "Trash" },
          { id: "pdf", label: "PDF" },
          { id: "csv", label: "CSV" },
          { id: "geojson", label: "GeoJSON" },
        ].map((tab) => {
          const active = filterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all ${
                active
                  ? "bg-ground-800 text-instrument border border-ground-700"
                  : "text-ground-400 hover:text-instrument hover:bg-ground-900/40"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main content grid of report cards */}
      {isLoading ? (
        <p className="text-sm text-ground-400 py-12 text-center animate-pulse">Loading reports database...</p>
      ) : sortedReports.length === 0 ? (
        
        // Custom Empty State
        <div className="text-center py-20 border border-dashed border-ground-750 rounded-xl space-y-5 bg-ground-900/10">
          <span className="text-5xl block animate-pulse">📄</span>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-instrument">No Reports Yet</h3>
            <p className="text-xs text-ground-400 leading-relaxed">
              Run your first AI prediction and Emissia will automatically generate a comprehensive report containing heatmaps, analytics, confidence scores, and downloadable insights.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-block rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer font-semibold shadow-lg shadow-sensor/5"
          >
            Upload Dataset
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedReports.map((r) => {
            const dateStr = new Date(r.created_at).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "numeric"
            });
            const colorClass =
              r.confidence_score >= 94 ? "text-sensor border-sensor/20 bg-sensor/5" : "text-amber-400 border-amber-400/20 bg-amber-400/5";

            return (
              <Card
                key={r.id}
                className="group relative overflow-hidden flex flex-col justify-between border border-ground-700/80 hover:border-ground-400/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-ground-900/20"
              >
                
                {/* Heatmap Visual Swatch Background */}
                <div className="h-16 w-full relative overflow-hidden bg-ground-950/80 border-b border-ground-700/40">
                  <div className="absolute inset-0 plume-gradient opacity-10 blur-xl scale-125" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sensor/40 animate-pulse" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sensor animate-ping" />
                    <span className="h-1.5 w-1.5 rounded-full bg-sensor/20" />
                  </div>
                  
                  {/* Format Badge Overlay */}
                  <span className="absolute top-3 left-3 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-ground-800 text-ground-300 border border-ground-700/60">
                    {r.format}
                  </span>

                  {/* Favorite Toggle Icon */}
                  <button
                    onClick={() => toggleFavorite(r)}
                    className={`absolute top-3 right-3 p-1 rounded-full bg-ground-900/80 border border-ground-700/60 cursor-pointer transition-colors ${
                      r.is_favorite ? "text-amber-400 border-amber-400/20" : "text-ground-400 hover:text-amber-400"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => {
                        setActiveReport(r);
                        setViewerTab("summary");
                      }}
                      className="font-medium text-sm text-instrument line-clamp-1 group-hover:text-sensor transition-colors cursor-pointer"
                      title={r.title}
                    >
                      {r.title}
                    </h3>
                    <p className="text-[10px] text-ground-500 mt-0.5 flex gap-2">
                      <span>{r.dataset_name}</span>
                      <span>·</span>
                      <span>{r.satellite_source}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-ground-700/40 py-2.5">
                    <div>
                      <span className="text-ground-500 block text-[9px] uppercase font-semibold">CO₂ Estimate</span>
                      <span className="readout text-instrument font-bold mt-0.5">
                        {r.estimated_co2 ? `${r.estimated_co2.toLocaleString()} t/yr` : "Insufficient data"}
                      </span>
                    </div>
                    <div>
                      <span className="text-ground-500 block text-[9px] uppercase font-semibold">Confidence</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded border mt-0.5 text-[10px] font-mono ${colorClass}`}>
                        {r.confidence_score}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-ground-400">
                    <span>{dateStr}</span>
                    <span className="readout font-mono">{r.size_mb} MB</span>
                  </div>
                </div>

                {/* Card Footer Quick Actions */}
                <div className="px-4 py-2.5 bg-ground-900/40 border-t border-ground-700/40 flex items-center justify-between relative">
                  
                  {/* Primary Trigger */}
                  <button
                    onClick={() => {
                      setActiveReport(r);
                      setViewerTab("summary");
                    }}
                    className="flex items-center gap-1.5 text-xs text-ground-300 hover:text-sensor cursor-pointer font-medium"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShareReport(r)}
                      className="p-1 rounded text-ground-400 hover:bg-ground-800 hover:text-instrument cursor-pointer"
                      title="Share report link"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        alert(`Downloading ${r.title} as ${r.format.toUpperCase()}...`);
                        updateReport.mutate({
                          id: r.id,
                          data: { downloads_count: (r.downloads_count || 0) + 1 },
                        });
                      }}
                      className="p-1 rounded text-ground-400 hover:bg-ground-800 hover:text-instrument cursor-pointer"
                      title="Download report"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>

                    {/* Actions Menu Anchor */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveActionMenuId(activeActionMenuId === r.id ? null : r.id)}
                        className="p-1 rounded text-ground-400 hover:bg-ground-800 hover:text-instrument cursor-pointer"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {/* Floating Dropdown Actions Menu */}
                      {activeActionMenuId === r.id && (
                        <div className="absolute right-0 bottom-8 z-50 w-36 bg-ground-950 border border-ground-700/90 rounded-lg shadow-xl py-1 animate-in fade-in-50 slide-in-from-bottom-2">
                          <button
                            onClick={() => handleRenameReport(r.id, r.title)}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-ground-800 text-ground-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3" /> Rename
                          </button>
                          <button
                            onClick={() => handleDuplicateReport(r)}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-ground-800 text-ground-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" /> Duplicate
                          </button>
                          <button
                            onClick={() => toggleArchive(r)}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-ground-800 text-ground-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Archive className="h-3 w-3" /> {r.is_archived ? "Activate" : "Archive"}
                          </button>
                          <div className="border-t border-ground-800 my-1" />
                          <button
                            onClick={() => {
                              if (confirm("Move this report to Trash?")) {
                                deleteReport.mutate(r.id);
                              }
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-ground-800 text-alert flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* REPORT VIEWER OVERLAY DRAWER */}
      {activeReport && (
        <div className="fixed inset-0 z-50 bg-ground-950/80 backdrop-blur-sm flex items-center justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-4xl h-full bg-ground-900 border-l border-ground-700 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-350">
            
            {/* Viewer Header */}
            <div className="p-4 border-b border-ground-700 flex items-center justify-between bg-ground-900/80 sticky top-0 z-20">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-ground-850 text-ground-300 border border-ground-700/60">
                    {activeReport.format}
                  </span>
                  <span className="h-1.5 w-1.5 rounded bg-sensor animate-ping" />
                  <span className="text-[10px] text-ground-400">ID: {activeReport.id.substring(0, 8)}</span>
                </div>
                <h2 className="text-base font-semibold text-instrument truncate mt-1">{activeReport.title}</h2>
              </div>
              
              <button
                onClick={() => {
                  setActiveReport(null);
                  setViewerTab("summary");
                }}
                className="p-1 rounded-full hover:bg-ground-800 text-ground-400 hover:text-instrument cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Viewer Viewer Toolbar */}
            <div className="px-4 py-2.5 bg-ground-950 border-b border-ground-700 flex items-center justify-between text-xs text-ground-400">
              <div className="flex items-center gap-4">
                <span>Acquired: {new Date(activeReport.acquisition_date).toLocaleDateString()}</span>
                <span>·</span>
                <span>Predicted: {new Date(activeReport.prediction_date).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert("Report printed successfully.")}
                  className="p-1.5 hover:bg-ground-800 rounded text-ground-300 cursor-pointer flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      alert(`Exported successfully as ${e.target.value.toUpperCase()}`);
                      e.target.value = "";
                    }
                  }}
                  className="bg-ground-800 border border-ground-700 text-xs text-ground-300 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                >
                  <option value="">Export As...</option>
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="geojson">GeoJSON</option>
                  <option value="json">JSON</option>
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                </select>
                <button
                  onClick={() => {
                    alert(`Downloading ${activeReport.title}...`);
                    updateReport.mutate({
                      id: activeReport.id,
                      data: { downloads_count: (activeReport.downloads_count || 0) + 1 },
                    });
                  }}
                  className="p-1.5 bg-sensor text-ground-950 rounded font-semibold cursor-pointer flex items-center gap-1 hover:bg-sensor/90"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </div>

            {/* Main Content Area: Sidebar + Scrollable Panel */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Sidebar Navigation */}
              <div className="w-48 border-r border-ground-700/80 bg-ground-900/40 p-3 flex flex-col gap-1 shrink-0 overflow-y-auto">
                {[
                  { id: "summary", label: "Executive Summary", icon: FileText },
                  { id: "map", label: "Interactive Map", icon: MapIcon },
                  { id: "facilities", label: "Detected Facilities", icon: FolderOpen },
                  { id: "charts", label: "Emission Charts", icon: BarChart3 },
                  { id: "comments", label: "Discussion Board", icon: MessageSquare },
                  { id: "versions", label: "Version History", icon: History },
                ].map((item) => {
                  const active = viewerTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setViewerTab(item.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-colors ${
                        active
                          ? "bg-ground-800 text-sensor font-semibold"
                          : "text-ground-400 hover:bg-ground-800/40 hover:text-instrument"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Document Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Summary View */}
                {viewerTab === "summary" && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-instrument">AI Executive Summary</h3>
                      <p className="text-xs text-ground-400 leading-relaxed bg-ground-950/40 p-4 border border-ground-750 rounded-lg">
                        {activeReport.summary}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card className="p-4 bg-ground-900/60 border-ground-700">
                        <h4 className="text-[10px] uppercase font-bold text-ground-400 tracking-wider">Geographic Region</h4>
                        <p className="text-sm font-semibold text-instrument mt-1">{activeReport.region}</p>
                      </Card>
                      <Card className="p-4 bg-ground-900/60 border-ground-700">
                        <h4 className="text-[10px] uppercase font-bold text-ground-400 tracking-wider">Estimating AI Engine</h4>
                        <p className="text-sm font-semibold text-instrument mt-1">{activeReport.model_used}</p>
                      </Card>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-instrument">Scope & Recommendations</h3>
                      <ul className="list-disc list-inside text-xs text-ground-400 space-y-1.5 leading-relaxed">
                        <li>Initiate spatial auditing overlay grids at {activeReport.region} to trace transient leakage profiles.</li>
                        <li>Correlate Sentinel-5P column density indices with local wind vector alignments.</li>
                        <li>Schedule automated high-resolution tasking overlays upon confidence drops below 85%.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. Map View */}
                {viewerTab === "map" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-instrument">CO₂ Plume Spatial Contours</h3>
                      <div className="flex gap-2 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer text-ground-400 hover:text-instrument">
                          <input
                            type="checkbox"
                            checked={showPlumeHeatmap}
                            onChange={(e) => setShowPlumeHeatmap(e.target.checked)}
                            className="accent-sensor h-3 w-3"
                          /> Plume Heatmap
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-ground-400 hover:text-instrument">
                          <input
                            type="checkbox"
                            checked={showFacilityMarkers}
                            onChange={(e) => setShowFacilityMarkers(e.target.checked)}
                            className="accent-sensor h-3 w-3"
                          /> Facilities
                        </label>
                      </div>
                    </div>

                    {/* Map Mock Frame */}
                    <div className="relative h-96 w-full rounded-xl border border-ground-700 bg-ground-950 overflow-hidden">
                      {/* Grid representation */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      {/* Heatmap overlay representation */}
                      {showPlumeHeatmap && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-sensor/15 blur-2xl animate-pulse" />
                      )}

                      {/* Central Hotspot Marker representation */}
                      {showFacilityMarkers && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none">
                          <div className="h-3 w-3 rounded-full bg-sensor border border-ground-950 ring-2 ring-sensor/30" />
                          {showMapLabels && (
                            <span className="mt-1 px-1.5 py-0.5 rounded bg-ground-900 border border-ground-700 text-[9px] text-instrument font-semibold">
                              CO₂ detected hotspot
                            </span>
                          )}
                        </div>
                      )}

                      {/* Map info bar overlay */}
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-ground-900/90 border border-ground-700 text-[10px] text-ground-400 flex gap-3">
                        <span>Lat: {activeReport.hotspots[0]?.lat.toFixed(4) || "24.0983"}</span>
                        <span>Lon: {activeReport.hotspots[0]?.lon.toFixed(4) || "82.6714"}</span>
                        <span>Scale: {mapZoom}x</span>
                      </div>

                      {/* Map Toolbar overlay */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                        <button
                          onClick={() => setMapZoom((z) => Math.min(18, z + 1))}
                          className="h-7 w-7 bg-ground-900 hover:bg-ground-800 border border-ground-700 text-instrument font-bold rounded flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setMapZoom((z) => Math.max(1, z - 1))}
                          className="h-7 w-7 bg-ground-900 hover:bg-ground-800 border border-ground-700 text-instrument font-bold rounded flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Facilities table view */}
                {viewerTab === "facilities" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-semibold text-instrument">Detected Facilities & Emitters</h3>
                    <div className="border border-ground-700 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-ground-900 border-b border-ground-700 text-ground-400">
                            <th className="p-3">Facility Coordinate</th>
                            <th className="p-3">Detected Intensity</th>
                            <th className="p-3">Estimate CO₂</th>
                            <th className="p-3">Confidence Ratio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ground-700">
                          {activeReport.hotspots.map((h, i) => (
                            <tr key={i} className="hover:bg-ground-900/20 text-instrument">
                              <td className="p-3 font-mono">
                                Lat: {h.lat.toFixed(4)}, Lon: {h.lon.toFixed(4)}
                              </td>
                              <td className="p-3">{(activeReport.confidence_score * 0.95).toFixed(0)}%</td>
                              <td className="p-3 font-semibold text-sensor">
                                {h.value ? `${h.value.toLocaleString()} t/yr` : "—"}
                              </td>
                              <td className="p-3 font-mono">{activeReport.confidence_score}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Charts View */}
                {viewerTab === "charts" && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <h3 className="text-base font-semibold text-instrument">Interactive Charts</h3>

                    {/* Chart 1: Sector Breakdown (custom SVG) */}
                    <Card className="p-4 bg-ground-900/60 border-ground-700 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-semibold text-ground-300">Sector CO₂ Breakdown (Estimate)</h4>
                        <span className="text-[10px] text-ground-500">tonnes / year</span>
                      </div>
                      <div className="h-40 flex items-end justify-between px-6 pt-4 relative">
                        {/* Horizontal scale lines */}
                        <div className="absolute inset-x-0 bottom-0 border-b border-ground-750" />
                        <div className="absolute inset-x-0 bottom-12 border-b border-dashed border-ground-750/40" />
                        <div className="absolute inset-x-0 bottom-24 border-b border-dashed border-ground-750/40" />
                        
                        {[
                          { label: "Power", value: 65, color: "#34d399" },
                          { label: "Steel", value: 45, color: "#f08c28" },
                          { label: "Cement", value: 30, color: "#c8506e" },
                          { label: "Chemical", value: 15, color: "#a855f7" },
                        ].map((bar, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 z-10 w-16">
                            <div
                              className="w-8 rounded-t transition-all duration-500 hover:opacity-90"
                              style={{
                                height: `${bar.value * 1.5}px`,
                                backgroundColor: bar.color,
                              }}
                            />
                            <span className="text-[10px] text-ground-400 font-semibold">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Chart 2: Monthly trend */}
                    <Card className="p-4 bg-ground-900/60 border-ground-700 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-semibold text-ground-300">Emissions Confidence Deviation</h4>
                        <span className="text-[10px] text-ground-500">% accuracy</span>
                      </div>
                      <div className="h-32 flex items-end justify-between px-6 pt-4 relative">
                        <div className="absolute inset-x-0 bottom-0 border-b border-ground-750" />
                        {[
                          { month: "Jan", val: 92 },
                          { month: "Mar", val: 94 },
                          { month: "May", val: 93 },
                          { month: "Jul", val: activeReport.confidence_score },
                        ].map((pt, i) => (
                          <div key={i} className="flex flex-col items-center gap-1.5 w-12 z-10">
                            <span className="text-[10px] font-mono font-bold text-sensor">{pt.val}%</span>
                            <div
                              className="w-1.5 rounded-full bg-sensor"
                              style={{ height: `${pt.val - 50}px` }}
                            />
                            <span className="text-[10px] text-ground-400">{pt.month}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* 5. Comments View */}
                {viewerTab === "comments" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-semibold text-instrument">Discussions ({activeReport.comments?.length || 0})</h3>
                    
                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Discuss findings, mention teammates with @name..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                        className="flex-1 px-3 py-2 bg-ground-950 border border-ground-700/80 rounded-lg text-xs placeholder-ground-500 focus:outline-none focus:border-ground-450 text-instrument"
                      />
                      <button
                        onClick={handleAddComment}
                        className="p-2 bg-ground-800 border border-ground-700 hover:border-ground-400 rounded-lg text-ground-300 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-3.5 mt-4">
                      {(activeReport.comments || []).map((c) => (
                        <div key={c.id} className="p-3 bg-ground-900/60 border border-ground-700/60 rounded-lg space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-ground-400">
                            <span className="font-semibold text-instrument flex items-center gap-1">
                              <User className="h-3 w-3 text-sensor" /> {c.author}
                            </span>
                            <span>{new Date(c.created_at).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}</span>
                          </div>
                          <p className="text-xs text-ground-300 leading-relaxed">{c.content}</p>

                          {/* Replies list */}
                          {c.replies && c.replies.length > 0 && (
                            <div className="pl-4 border-l border-ground-750/80 space-y-2.5 mt-2">
                              {c.replies.map((r) => (
                                <div key={r.id} className="space-y-1">
                                  <div className="flex items-center justify-between text-[9px] text-ground-500">
                                    <span className="font-medium text-ground-300">{r.author}</span>
                                    <span>{new Date(r.created_at).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}</span>
                                  </div>
                                  <p className="text-xs text-ground-400">{r.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply trigger button */}
                          <div className="pt-1.5 flex gap-2">
                            {replyingToId === c.id ? (
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Write a reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="flex-1 px-2.5 py-1 bg-ground-950 border border-ground-750 rounded text-[11px] text-instrument focus:outline-none"
                                />
                                <button
                                  onClick={() => handleAddReply(c.id)}
                                  className="px-2.5 py-1 rounded bg-ground-800 text-[10px] font-semibold text-instrument hover:bg-ground-750 cursor-pointer"
                                >
                                  Reply
                                </button>
                                <button
                                  onClick={() => setReplyingToId(null)}
                                  className="px-2.5 py-1 rounded border border-ground-750 text-[10px] text-ground-400 hover:text-instrument cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setReplyingToId(c.id)}
                                className="text-[10px] text-ground-450 hover:text-sensor cursor-pointer"
                              >
                                Reply to this comment
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Version History View */}
                {viewerTab === "versions" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-base font-semibold text-instrument">Document Version History</h3>
                    <div className="space-y-3">
                      {(activeReport.versions || []).map((v, i) => (
                        <div
                          key={i}
                          className="flex items-start justify-between p-3.5 bg-ground-900/60 border border-ground-700/60 rounded-lg text-xs"
                        >
                          <div className="space-y-1">
                            <span className="readout font-bold text-sensor uppercase tracking-wider">{v.version}</span>
                            <p className="text-ground-300">{v.description}</p>
                            <span className="text-[10px] text-ground-500 block">
                              Modified by {v.created_by} · {new Date(v.created_at).toLocaleString()}
                            </span>
                          </div>
                          {i > 0 && (
                            <button
                              onClick={() => handleRestoreVersion(v.version)}
                              className="px-2.5 py-1.5 rounded border border-ground-700 bg-ground-850 hover:border-sensor hover:text-sensor text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM REPORT BUILDER MODAL */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 bg-ground-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-250">
          <Card className="w-full max-w-md p-6 bg-ground-900 border-ground-700 space-y-6 relative animate-in zoom-in-95 duration-250">
            
            {/* Loader Overlay */}
            {generatingProgress >= 0 && (
              <div className="absolute inset-0 bg-ground-900/95 z-50 rounded-xl flex flex-col items-center justify-center p-6 space-y-4 text-center">
                <span className="text-4xl animate-bounce">📄</span>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-instrument uppercase tracking-wider">{generatingStage}</h3>
                  <p className="text-xs text-ground-400">Assembling custom spectral data points...</p>
                </div>
                <div className="w-full max-w-xs h-1.5 bg-ground-850 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sensor transition-[width] duration-300"
                    style={{ width: `${generatingProgress}%` }}
                  />
                </div>
                <span className="readout text-xs text-sensor font-bold">{generatingProgress}%</span>
              </div>
            )}

            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-instrument" style={{ fontFamily: "var(--font-display)" }}>
                Custom Report Builder
              </h2>
              <p className="text-xs text-ground-400">Compile specific carbon estimations and metadata modules.</p>
            </div>

            <div className="space-y-4 text-sm text-instrument">
              
              {/* Report Title */}
              <div className="space-y-1.5">
                <label className="text-xs text-ground-400 block font-semibold">Report Title</label>
                <input
                  type="text"
                  placeholder="e.g. Vindhyachal High-Accuracy Custom Analysis"
                  value={builderTitle}
                  onChange={(e) => setBuilderTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-ground-950 border border-ground-700 rounded-lg text-xs placeholder-ground-500 focus:outline-none focus:border-ground-400 text-instrument"
                />
              </div>

              {/* Dataset selection */}
              <div className="space-y-1.5">
                <label className="text-xs text-ground-400 block font-semibold">Reference Dataset</label>
                <select
                  value={builderDataset}
                  onChange={(e) => setBuilderDataset(e.target.value)}
                  className="w-full bg-ground-950 border border-ground-700 text-xs text-ground-300 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
                >
                  <option value="vindhyachal.tif">vindhyachal.tif (Sentinel-5P)</option>
                  <option value="sasan.tif">sasan.tif (Sentinel-5P)</option>
                </select>
              </div>

              {/* Checkbox Checklist */}
              <div className="space-y-2">
                <label className="text-xs text-ground-400 block font-semibold">Select Report Sections</label>
                <div className="grid gap-2 border border-ground-700 p-3 rounded-lg bg-ground-950/40 text-xs text-ground-300">
                  {[
                    { key: "summary", label: "Executive Summary & AI Description" },
                    { key: "heatmap", label: "Interactive Heatmap / Plume contours" },
                    { key: "charts", label: "Interactive SVG Emission Charts" },
                    { key: "metadata", label: "Satellite Geodata Metadata" },
                    { key: "confidence", label: "Accuracy Confidence Analysis" },
                    { key: "recommendations", label: "Scope Auditing Recommendations" },
                    { key: "appendix", label: "Detailed Appendix Data" },
                  ].map((sec) => (
                    <label key={sec.key} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={builderSections[sec.key as keyof typeof builderSections]}
                        onChange={(e) =>
                          setBuilderSections({
                            ...builderSections,
                            [sec.key]: e.target.checked,
                          })
                        }
                        className="accent-sensor h-3.5 w-3.5 cursor-pointer"
                      />
                      <span>{sec.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setBuilderOpen(false)}
                className="px-4 py-2 border border-ground-700 bg-ground-800 text-xs text-ground-300 hover:text-instrument hover:border-ground-400 rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={triggerCustomReportGeneration}
                className="px-4 py-2 bg-sensor text-ground-950 text-xs font-semibold rounded-lg hover:bg-sensor/90 cursor-pointer transition-all shadow-lg shadow-sensor/5"
              >
                Generate Report
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* SHARE CONFIGURATION MODAL */}
      {shareReport && (
        <div className="fixed inset-0 z-50 bg-ground-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 bg-ground-900 border-ground-700 space-y-5 relative">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-instrument">Share Climate Intelligence Report</h3>
              <p className="text-xs text-ground-400">Configure access level and security rules for this PDF.</p>
            </div>

            {shareSuccessLink ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 bg-ground-950 border border-ground-750/80 rounded-lg font-mono text-[10px] text-sensor select-all break-all">
                  {shareSuccessLink}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareSuccessLink);
                      alert("Copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-ground-800 hover:bg-ground-750 text-xs font-semibold rounded-lg text-instrument cursor-pointer"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      setShareReport(null);
                      setShareSuccessLink("");
                    }}
                    className="px-4 py-2 bg-sensor hover:bg-sensor/90 text-ground-950 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-instrument">
                <div className="space-y-1.5">
                  <label className="text-ground-400 block font-semibold">Permission Scope</label>
                  <select
                    value={shareConfig.permission}
                    onChange={(e) => setShareConfig({ ...shareConfig, permission: e.target.value as any })}
                    className="w-full bg-ground-950 border border-ground-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="private">Private (Only You)</option>
                    <option value="organization">Organization (Teammates)</option>
                    <option value="public">Public (Anyone with link)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-ground-400 block font-semibold">Link Expiration</label>
                  <select
                    value={shareConfig.expiration}
                    onChange={(e) => setShareConfig({ ...shareConfig, expiration: e.target.value as any })}
                    className="w-full bg-ground-950 border border-ground-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="never">Never expire</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-ground-400 block font-semibold">Secure Password Protection (Optional)</label>
                  <input
                    type="password"
                    placeholder="Enter password to access"
                    value={shareConfig.password}
                    onChange={(e) => setShareConfig({ ...shareConfig, password: e.target.value })}
                    className="w-full px-3 py-1.5 bg-ground-950 border border-ground-700 rounded-lg placeholder-ground-500 focus:outline-none focus:border-ground-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShareReport(null)}
                    className="px-4 py-2 border border-ground-700 bg-ground-800 hover:border-ground-400 rounded-lg text-ground-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => generateShareLink(shareReport)}
                    className="px-4 py-2 bg-sensor hover:bg-sensor/90 text-ground-950 font-semibold rounded-lg cursor-pointer"
                  >
                    Generate Secure Link
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
