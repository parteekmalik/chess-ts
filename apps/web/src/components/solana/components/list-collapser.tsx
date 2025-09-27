"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";

interface ProfilesListProps {
  title: string;
  discription?: ReactNode;
  children: ReactNode;
}

export function ListCollapser({ children, title, discription }: ProfilesListProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{discription}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={toggleCollapse} className="flex items-center gap-2">
            {isCollapsed ? (
              <>
                <span>Show</span>
                <span className="text-lg">▼</span>
              </>
            ) : (
              <>
                <span>Hide</span>
                <span className="text-lg">▲</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {!isCollapsed && <CardContent>{children}</CardContent>}
    </Card>
  );
}
