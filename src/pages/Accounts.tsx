
// src/pages/Accounts.tsx

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Account } from "@/data/accounts";

export default function Accounts() {
  const [list, setList] = useState<Account[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("vao_accounts");
    if (stored) setList(JSON.parse(stored));
  }, []);

  return (
    <Card className="overflow-auto p-4">
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((acc) => (
            <TableRow key={acc.username}>
              <TableCell>{acc.username}</TableCell>
              <TableCell className="font-mono whitespace-nowrap">
                {acc.password}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}