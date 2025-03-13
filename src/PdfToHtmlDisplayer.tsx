import { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
export default function PdfToHtmlDisplayer() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      // setPageNumber(1); // Reset to the first page when a new file is uploaded
    } else {
      alert("Please select a valid PDF file.");
    }
  }

  return (
    <div>
      <h3>
        PDF to HTML Converter using React-pdf{" "}
        <span role="img" aria-label="PDF">
          📄
        </span>
      </h3>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pdfFile && (
        <>
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button onClick={() => setPageNumber((prev) => prev - 1)}>
            Previous
          </button>
          <button onClick={() => setPageNumber((prev) => prev + 1)}>
            Next
          </button>
        </>
      )}
    </div>
  );
}
