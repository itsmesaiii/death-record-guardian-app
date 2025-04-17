
import { useEffect, useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface HistoryItem {
  id: string;
  fullName: string;
  aadhaarNumber: string;
  dateOfDeath: string;
  pdfFilename?: string;
  isMatch: boolean;
  submissionDate: string;
}

export function SubmissionHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load history from localStorage
    const loadHistory = () => {
      const savedHistory = localStorage.getItem("vao_submissions");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      setIsLoading(false);
    };

    // Small delay to simulate loading from API
    const timer = setTimeout(() => {
      loadHistory();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (isMatch: boolean) => {
    if (isMatch) {
      return <Badge className="bg-green-500">Matched</Badge>;
    }
    return <Badge variant="outline" className="text-vao-gray border-vao-gray">Not Matched</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDownload = (item: HistoryItem) => {
    // In a real app, this would download the actual PDF file
    alert(`Downloading Form 2 for ${item.fullName}`);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading submission history...</p>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No submissions found</p>
        <p className="text-sm text-muted-foreground">Start by submitting a death record</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Aadhaar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Document</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{formatDate(item.dateOfDeath)}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>
                  {item.aadhaarNumber ? 
                    `${item.aadhaarNumber.slice(0, 4)}...${item.aadhaarNumber.slice(-4)}` : 
                    "Not provided"}
                </TableCell>
                <TableCell>{getStatusBadge(item.isMatch)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDownload(item)}
                    title="Download Form 2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
