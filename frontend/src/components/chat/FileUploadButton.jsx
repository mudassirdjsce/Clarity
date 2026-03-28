import React, { useRef, useState } from 'react';
import { Paperclip, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';

// Vite-compatible worker URL for pdfjs-dist v5
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  const numPages = Math.min(pdf.numPages, 4);
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item) => item.str).join(' ') + '\n';
  }
  return fullText.trim();
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

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset so the same file can be re-selected immediately
    event.target.value = '';

    if (file.size > MAX_FILE_SIZE) {
      alert(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 5 MB.`);
      return;
    }

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isCSV = file.type === 'text/csv'         || file.name.toLowerCase().endsWith('.csv');

    if (!isPDF && !isCSV) {
      alert('Unsupported file type. Please upload a .pdf or .csv file.');
      return;
    }

    setIsProcessing(true);

    try {
      if (isPDF) {
        const text = await parsePDF(file);
        if (!text) throw new Error('No readable text found in PDF.');

        onFileParsed({
          // Short label shown to the user in the chat
          displayText:    `📄 ${file.name}`,
          // Full content sent to the AI — invisible in the chat bubble
          backendContent: `Analyze this document:\n\n📄 **${file.name}**\n\n${text.substring(0, 4000)}${text.length > 4000 ? '…' : ''}`,
        });

      } else {
        const results = await parseCSV(file);
        const rows    = results.data.length;
        const cols    = results.meta.fields?.length ?? 0;
        const csvText = Papa.unparse(results.data);

        onFileParsed({
          // Short label shown to the user in the chat
          displayText:    `📊 ${file.name} — ${rows} rows, ${cols} columns`,
          // Full content sent to the AI — invisible in the chat bubble
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
        accept=".pdf,.csv,application/pdf,text/csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
        disabled={disabled || isProcessing}
        title="Upload PDF or CSV for analysis"
        className={cn(
          'p-2 rounded-xl transition-all duration-200 shrink-0 border border-transparent',
          'bg-white/5 text-white/40 hover:text-white hover:bg-white/10',
          (disabled || isProcessing) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isProcessing
          ? <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
          : <Paperclip className="w-4 h-4" />
        }
      </motion.button>
    </>
  );
}
