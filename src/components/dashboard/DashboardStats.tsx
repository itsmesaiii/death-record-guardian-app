
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, FileClock, FilePenLine, FileText } from "lucide-react";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  color: string;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function DashboardStats() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        title="This Month"
        value="12"
        description={`Reports in ${currentMonth}`}
        icon={FilePenLine}
        color="bg-vao-primary"
      />
      <StatCard
        title="Pending"
        value="3"
        description="Under review"
        icon={FileClock}
        color="bg-yellow-500"
      />
      <StatCard
        title="Matches"
        value="8"
        description="Beneficiary matches"
        icon={FileCheck}
        color="bg-green-500"
      />
      <StatCard
        title="Total"
        value="124"
        description="All time records"
        icon={FileText}
        color="bg-blue-500"
      />
    </div>
  );
}
