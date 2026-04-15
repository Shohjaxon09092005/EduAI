import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";

// Set PDF worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: "pdf" | "docx" | "doc";
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docxContent, setDocxContent] = useState<string | null>(null);

  const isPdf = fileType === "pdf";

  // Get auth header from localStorage
  const getAuthHeader = () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("auth_tokens") || "{}");
      return tokens.access ? { Authorization: `Bearer ${tokens.access}` } : {};
    } catch {
      return {};
    }
  };

  // Load DOCX file when modal opens
  useEffect(() => {
    if (!isOpen || isPdf) {
      setDocxContent(null);
      return;
    }

    const loadDocx = async () => {
      try {
        setLoading(true);
        setError(null);
        setDocxContent(null);

        const response = await fetch(fileUrl, {
          headers: getAuthHeader(),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setDocxContent(result.value);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Noma'lum xato";
        setError(message);
        console.error("DOCX loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDocx();
  }, [isOpen, fileUrl, isPdf]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setScale(1.0);
      setError(null);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl, {
        headers: getAuthHeader(),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/60 z-1000 flex items-center justify-center p-4"
          style={{ zIndex: 1000 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              maxHeight: "90vh",
              backgroundColor: "var(--color-background-primary, white)",
              border: "0.5px solid var(--color-border-tertiary, #e5e7eb)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b gap-4"
              style={{
                borderColor: "var(--color-border-tertiary, #e5e7eb)",
                backgroundColor: "var(--color-background-primary, white)",
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icon */}
                <div
                  className="flex-shrink-0 p-2 rounded-lg"
                  style={
                    isPdf
                      ? {
                          backgroundColor:
                            "var(--color-background-danger, #fee2e2)",
                        }
                      : {
                          backgroundColor:
                            "var(--color-background-info, #dbeafe)",
                        }
                  }
                >
                  <FileText
                    size={20}
                    style={
                      isPdf
                        ? { color: "var(--color-text-danger, #dc2626)" }
                        : { color: "var(--color-text-info, #0284c7)" }
                    }
                  />
                </div>

                {/* File info */}
                <div className="min-w-0 flex-1">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: "var(--color-text-primary, #1f2937)" }}
                  >
                    {fileName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary, #6b7280)" }}
                  >
                    {isPdf ? "PDF Hujjat" : "Word Hujjat"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:opacity-75 transition-opacity"
                  style={{
                    color: "var(--color-text-secondary, #6b7280)",
                  }}
                  title="Yuklab olish"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:opacity-75 transition-opacity"
                  style={{
                    color: "var(--color-text-secondary, #6b7280)",
                  }}
                  title="Yopish"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PDF Toolbar */}
            {isPdf && (
              <div
                className="flex items-center justify-center gap-3 p-3 border-b flex-wrap"
                style={{
                  borderColor: "var(--color-border-tertiary, #e5e7eb)",
                  backgroundColor: "var(--color-background-secondary, #f9fafb)",
                }}
              >
                {/* Navigation */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                  style={{
                    color: "var(--color-text-secondary, #6b7280)",
                  }}
                  title="Oldingi sahifa"
                >
                  <ChevronLeft size={20} />
                </button>

                <span
                  className="text-xs px-3 py-1 rounded-lg font-medium"
                  style={{
                    backgroundColor: "var(--color-background-primary, white)",
                    color: "var(--color-text-primary, #1f2937)",
                  }}
                >
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                  style={{
                    color: "var(--color-text-secondary, #6b7280)",
                  }}
                  title="Keyingi sahifa"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Divider */}
                <div
                  className="w-px h-6 opacity-20"
                  style={{
                    backgroundColor: "var(--color-border-tertiary, #d1d5db)",
                  }}
                />

                {/* Zoom */}
                <button
                  onClick={handleZoomOut}
                  disabled={scale === 0.5}
                  className="p-1.5 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                  style={{
                    color: "var(--color-text-secondary, #6b7280)",
                  }}
                  title="Kichrayish"
                >
                  <ZoomOut size={20} />
                </button>

                <span
                  className="text-xs px-2 py-1 rounded-lg min-w-12 text-center font-medium"
                  style={{
                    backgroundColor: "var(--color-background-primary, white)",
                    color: "var(--color-text-primary, #1f2937)",
                  }}
                >
                  {Math.round(scale * 100)}%
                </span>

                <button
                  onClick={handleZoomIn}
                  disabled={scale === 2.5}
                  className="p-1.5 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                  style={{
                    color: "var(--color-text-secondary, #6b7280)",
                  }}
                  title="Kattalashtirish"
                >
                  <ZoomIn size={20} />
                </button>
              </div>
            )}

            {/* Content Area */}
            <div
              className="flex-1 overflow-auto flex items-center justify-center p-4"
              style={{
                backgroundColor: "var(--color-background-secondary, #f9fafb)",
              }}
            >
              {/* Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className="w-8 h-8 border-4 rounded-full animate-spin"
                    style={{
                      borderColor: "var(--color-border-tertiary, #e5e7eb)",
                      borderTopColor: "var(--color-text-secondary, #6b7280)",
                    }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-secondary, #6b7280)" }}
                  >
                    Hujjat yuklanmoqda...
                  </p>
                </motion.div>
              )}

              {/* Error State */}
              {error && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 text-center max-w-xs"
                >
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor:
                        "var(--color-background-danger, #fee2e2)",
                    }}
                  >
                    <AlertCircle
                      size={24}
                      style={{ color: "var(--color-text-danger, #dc2626)" }}
                    />
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-danger, #dc2626)" }}
                  >
                    Hujjat yuklanmadi
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary, #6b7280)" }}
                  >
                    {error}
                  </p>
                </motion.div>
              )}

              {/* PDF Content */}
              {isPdf && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <Document
                    file={fileUrl}
                    options={{
                      httpHeaders: getAuthHeader() as Record<string, string>,
                    }}
                    onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
                    onError={(err) => {
                      console.error("PDF error:", err);
                      setError("PDF yuklanmadi");
                    }}
                    loading={
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 border-3 rounded-full animate-spin"
                          style={{
                            borderColor:
                              "var(--color-border-tertiary, #e5e7eb)",
                            borderTopColor:
                              "var(--color-text-secondary, #6b7280)",
                          }}
                        />
                        <span
                          className="text-sm"
                          style={{
                            color: "var(--color-text-secondary, #6b7280)",
                          }}
                        >
                          PDF yuklanmoqda...
                        </span>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </motion.div>
              )}

              {/* DOCX Content */}
              {!isPdf && docxContent && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-2xl"
                >
                  <div
                    className="p-6 rounded-lg prose prose-sm max-w-none"
                    style={{
                      backgroundColor: "var(--color-background-primary, white)",
                      color: "var(--color-text-primary, #1f2937)",
                      borderColor: "var(--color-border-tertiary, #e5e7eb)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: docxContent,
                    }}
                  />
                </motion.div>
              )}

              {/* Empty State */}
              {!isPdf && !loading && !error && !docxContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary, #6b7280)" }}
                  >
                    Hujjat nomalkundi
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewerModal;
