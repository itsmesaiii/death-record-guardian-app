// src/components/history/SubmissionHistory.tsx

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { api } from "@/lib/api";

interface HistoryItem {
  id: string;
  name: string;
  aadhaarNumber: string;
  dateOfDeath: string;
  createdAt: string;
  proofFilePath: string;
  isMatch: boolean;
  source: string;
}

export function SubmissionHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("vao_user");
    if (!saved) {
      setIsLoading(false);
      return;
    }
    const { username } = JSON.parse(saved) as { username: string };

    api
      .get<HistoryItem[]>("/death-records")
      .then((res) =>
        setHistory(
          res.data.filter((item) => item.source === `VAO - ${username}`)
        )
      )
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB");

  // ← NEW: anchor‑based download
  const handleDownload = (fullPath: string) => {
    // Extract the actual filename from whatever was stored
    const filename = fullPath.split(/[\\/]/).pop();
    if (!filename) return;
  
    // Construct the URL to your static uploads route
    const url = `http://localhost:3001/uploads/${filename}`;
  
    // Trigger an "a.download" to force download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Loading submission history… / சமர்ப்பிப்பு வரலாற்றை ஏற்றுகிறது…
        </p>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No submissions found / எந்த சமர்ப்பிப்பும் இல்லை
        </p>
        <p className="text-sm text-muted-foreground">
          Start by submitting a death record / முதலில் ஒரு மரண பதிவை சமர்ப்பிக்கவும்
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full table-auto min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Date of Death / இறப்பு தேதி</TableHead>
              <TableHead>Date Uploaded / பதிவேற்றம்</TableHead>
              <TableHead>Name / பெயர்</TableHead>
              <TableHead>Aadhaar / ஆதார் எண்</TableHead>
              <TableHead>Status / நிலை</TableHead>
              <TableHead className="text-right">Document / ஆவணம்</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.dateOfDeath)}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.aadhaarNumber}
                </TableCell>
                <TableCell>
                  {item.isMatch ? (
                    <Badge className="bg-green-500">Matched</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-vao-gray border-vao-gray"
                    >
                      Not Matched
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDownload(item.proofFilePath)}
                    title="Download proof PDF / PDF பதிவிறக்கவும்"
                    className="p-2"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
