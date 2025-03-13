import { useState } from "react";
import PdfToHtmlConverter from "./PdfToHtmlConverter";
import PdfToHtmlDisplayer from "./PdfToHtmlDisplayer";

export default function App() {
  const [section, setSection] = useState<string | null>(null);
  return (
    <div>
      <button onClick={() => setSection("converter")}>USING PDF.CO API</button>
      <span>{"  "}</span>
      <button onClick={() => setSection("displayer")}>USING REACT-PDF</button>
      {section === "converter" && <PdfToHtmlConverter />}
      {section === "displayer" && <PdfToHtmlDisplayer />}
    </div>
  );
}

// use react-pdf or react-pdf-html to display the pdf file from html input
// use pdf.js to convert the pdf file to html file with canvas
// learn more about pdftohtml
