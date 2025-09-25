"use client";

import { useCreateChessMatchMutation } from "@acme/chess-queries";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { useState } from "react";

export function CreateMatchCard() {
  const createMatchMutation = useCreateChessMatchMutation();

  const [baseTime, setBaseTime] = useState("300");
  const [increment, setIncrement] = useState("5");

  const handleCreateMatch = () => {
    if (!baseTime || !increment) return;

    try {
      createMatchMutation.mutate({
        baseTimeSeconds: parseInt(baseTime),
        incrementSeconds: parseInt(increment),
      });
      // Clear form after successful creation
      setBaseTime("300");
      setIncrement("5");
    } catch (error) {
      console.error("Failed to create match:", error);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Match</CardTitle>
        <CardDescription>Start a new chess game on Solana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="base-time">Base Time (seconds)</Label>
            <Input
              id="base-time"
              type="number"
              placeholder="300"
              value={baseTime}
              onChange={(e) => setBaseTime(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="increment">Increment (seconds)</Label>
            <Input
              id="increment"
              type="number"
              placeholder="5"
              value={increment}
              onChange={(e) => setIncrement(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreateMatch}
            disabled={!baseTime || !increment || createMatchMutation.isPending}
            className="w-full"
          >
            {createMatchMutation.isPending ? "Creating Match..." : "Create Match"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
