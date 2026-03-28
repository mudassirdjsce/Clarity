import React, { useRef, useState } from 'react';
import { Paperclip, Loader2, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { decryptSecureFile } from '../../lib/securePdf';

// Vite-compatible worker URL for pdfjs-dist v5
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (secure files can be larger due to base64+encryption)

// ── PDF text extractor (shared by plain PDF and decrypted secure) ─────────────
async function extractTextFromPdfBlob(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  const numPages = Math.min(pdf.numPages, 8); // up to 8 pages for portfolio reports
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item) => item.str).join(' ') + '\n';
  }
  return fullText.trim();
}

// ── Legacy: parse a normal PDF File object ────────────────────────────────────
async function parsePDF(file) {
  const blob = new Blob([await file.arrayBuffer()], { type: 'application/pdf' });
  return extractTextFromPdfBlob(blob);
}

// ── Parse a .secure encrypted portfolio file ──────────────────────────────────
async function parseSecureFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const { blob, meta } = decryptSecureFile(e.target.result);
        const text = await extractTextFromPdfBlob(blob);
        resolve({ text, meta });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read .secure file'));
    reader.readAsText(file);
  });
}

// ── Generate an auto-summary prompt from portfolio text ───────────────────────
function buildPortfolioPrompt(text, meta, fileName) {
  const who = meta?.userName ? ` for ${meta.userName}` : '';
  const when = meta?.created
    ? ` (generated ${new Date(meta.created).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})`
    : '';
  return (
    `You are analyzing a secure, encrypted Clarity portfolio report${who}${when}.\n\n` +
    `Extracted portfolio data from "${fileName}":\n\n` +
    `${text.substring(0, 5000)}${text.length > 5000 ? '\n[...truncated]' : ''}\n\n` +
    `Please provide:\n` +
    `1. A clear summary of this portfolio (total value, P&L, top holdings)\n` +
    `2. Risk assessment based on the data\n` +
    `3. 2–3 actionable recommendations\n\n` +
    `Answer in clear, financial-advisor style English.`
  );
}

function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      preview: 30,
      skipEmptyLines: true,
      complete: (results) => resolve(results),
      error:    (err)     => reject(err),
    });
  });
}

/**
 * onFileParsed is called with:
 *   {
 *     displayText:    string  — short label shown in the chat bubble
 *     backendContent: string  — full content sent to the AI backend
 *   }
 */
export function FileUploadButton({ onFileParsed, disabled }) {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [secureBanner, setSecureBanner] = useState(null); // { fileName, userName }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    if (file.size > MAX_FILE_SIZE) {
      alert(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 10 MB.`);
      return;
    }

    const isPDF    = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isCSV    = file.type === 'text/csv'         || file.name.toLowerCase().endsWith('.csv');
    const isSecure = file.name.toLowerCase().endsWith('.secure');

    if (!isPDF && !isCSV && !isSecure) {
      alert('Unsupported file type. Please upload a .pdf, .csv, or .secure file.');
      return;
    }

    setIsProcessing(true);

    try {
      if (isSecure) {
        // ── Secure encrypted portfolio ────────────────────────────────────
        const { text, meta } = await parseSecureFile(file);
        if (!text) throw new Error('No readable content found after decrypting the secure file.');

        // Show the success banner inside the chatbot
        setSecureBanner({ fileName: file.name, userName: meta?.userName || null });

        onFileParsed({
          displayText:    `🔐 ${file.name} — Secure Portfolio${meta?.userName ? ` · ${meta.userName}` : ''}`,
          backendContent: buildPortfolioPrompt(text, meta, file.name),
        });

      } else if (isPDF) {
        // ── Plain PDF ─────────────────────────────────────────────────────
        const text = await parsePDF(file);
        if (!text) throw new Error('No readable text found in PDF.');

        onFileParsed({
          displayText:    `📄 ${file.name}`,
          backendContent: `Analyze this document:\n\n📄 **${file.name}**\n\n${text.substring(0, 4000)}${text.length > 4000 ? '…' : ''}`,
        });

      } else {
        // ── CSV ───────────────────────────────────────────────────────────
        const results = await parseCSV(file);
        const rows    = results.data.length;
        const cols    = results.meta.fields?.length ?? 0;
        const csvText = Papa.unparse(results.data);

        onFileParsed({
          displayText:    `📊 ${file.name} — ${rows} rows, ${cols} columns`,
          backendContent: `Analyze this dataset:\n\n📊 **${file.name}** (${rows} rows, ${cols} columns)\n\n${csvText}`,
        });
      }
    } catch (err) {
      console.error('File processing error:', err);
      alert(`Error processing file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf,.csv,.secure,application/pdf,text/csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* ── Secure file success banner ── */}
      <AnimatePresence>
        {secureBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="absolute bottom-full left-0 right-0 mb-2 mx-0 z-50 pointer-events-auto"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0b1f0b] border border-[#39ff14]/30 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
              <div className="w-6 h-6 rounded-lg bg-[#39ff14]/15 border border-[#39ff14]/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#39ff14]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#39ff14]">
                  Secure file loaded successfully ✅
                </p>
                <p className="text-[10px] text-white/40 truncate font-mono">
                  {secureBanner.fileName}
                  {secureBanner.userName ? ` · ${secureBanner.userName}` : ''}
                  {' · Decrypted in-memory only'}
                </p>
              </div>
              <button
                onClick={() => setSecureBanner(null)}
                className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
        disabled={disabled || isProcessing}
        title="Upload PDF, CSV, or .secure portfolio file"
        className={cn(
          'p-2 rounded-xl transition-all duration-200 shrink-0 border',
          secureBanner
            ? 'border-[#39ff14]/40 bg-[#39ff14]/10 text-[#39ff14]'
            : 'border-transparent bg-white/5 text-white/40 hover:text-white hover:bg-white/10',
          (disabled || isProcessing) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isProcessing
          ? <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
          : secureBanner
            ? <ShieldCheck className="w-4 h-4" />
            : <Paperclip className="w-4 h-4" />
        }
      </motion.button>
    </>
  );
}
