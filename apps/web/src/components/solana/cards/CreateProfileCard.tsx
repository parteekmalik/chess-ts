"use client";

import { useInitializeProfileMutation, useConnectedWalletProfile } from "@acme/chess-queries";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { useState } from "react";

export function CreateProfileCard() {
  const createProfileMutation = useInitializeProfileMutation();
  const { data: userProfile, isLoading } = useConnectedWalletProfile();

  const [profileName, setProfileName] = useState("");

  const handleCreateProfile = async () => {
    if (!profileName.trim()) return;

    try {
      await createProfileMutation.mutateAsync({
        name: profileName.trim(),
      });
      // Clear form after successful creation
      setProfileName("");
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  // Don't show the card if user already has a profile or is loading
  if (isLoading || userProfile) {
    return null;
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Profile</CardTitle>
        <CardDescription>Set up your chess player profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="profile-name">Display Name</Label>
            <Input
              id="profile-name"
              type="text"
              placeholder="Enter your display name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreateProfile}
            disabled={!profileName.trim() || createProfileMutation.isPending}
            className="w-full"
          >
            {createProfileMutation.isPending ? "Creating Profile..." : "Create Profile"}
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}
