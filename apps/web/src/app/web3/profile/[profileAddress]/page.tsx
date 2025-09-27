"use client";

import { useParams } from "next/navigation";
import { address } from "gill";

import { ProfilePage } from "~/components/solana/components/app/ProfilePage";

function Page() {
  const param = useParams();

  if (typeof param.profileAddress !== "string") return <div>Profile not found</div>;
  else return <ProfilePage profileAddress={address(param.profileAddress)} />;
}

export default Page;
