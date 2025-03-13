import { useState } from "react";

const PdfToHtmlConverter = () => {
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState("");

  const handleConvert = async (file: File) => {
    const apiKey =
      "abdoubendaia7@gmail.com_sSz1eTukrvOLjxDnZZIRNC1baXNrIWyhe5fogDnQVA7FhQon98HyodDkJpdpXBDy";
    setLoading(true);
    setError(null);

    try {
      // Get Presigned URL
      const presignedResponse = await fetch(
        `https://api.pdf.co/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${encodeURIComponent(
          file.name
        )}`,
        { headers: { "x-api-key": apiKey } }
      );
      const presignedData = await presignedResponse.json();
      if (presignedData.error) throw new Error(presignedData.message);

      // Upload PDF
      await fetch(presignedData.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "application/octet-stream" },
      });

      // Convert PDF to HTML
      const convertResponse = await fetch(
        "https://api.pdf.co/v1/pdf/convert/to/html",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: presignedData.url,
            name: file.name.replace(".pdf", ".html"),
            simple: false,
            columns: false,
          }),
        }
      );
      const convertData = await convertResponse.json();
      if (convertData.error) throw new Error(convertData.message);

      // Download the HTML file
      const htmlResponse = await fetch(convertData.url);
      const htmlText = await htmlResponse.text();
      setHtmlContent(htmlText);
      // const htmlBlob = await htmlResponse.blob();
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(htmlBlob);
      // link.download = "converted.html";
      // link.click();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      setError("No file selected.");
      return;
    }
    const file = files[0];
    if (file.type === "application/pdf") {
      handleConvert(file);
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">PDF to HTML Converter</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      {loading && <p>Converting...</p>}
      {htmlContent && (
        <div
          className="border p-4 mt-4"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      )}
    </div>
  );
};

export default PdfToHtmlConverter;
