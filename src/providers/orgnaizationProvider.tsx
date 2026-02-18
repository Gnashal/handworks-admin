"use client";

import { useEffect } from "react";
import { useAuth, useOrganization, useOrganizationList } from "@clerk/nextjs";

export function EnsureActiveOrg() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const {
    isLoaded: orgsLoaded,
    userMemberships,
    setActive,
  } = useOrganizationList({
    userMemberships: true,
  });
  const { isLoaded: currOrgLoaded, organization } = useOrganization();

  useEffect(() => {
    if (!authLoaded || !orgsLoaded || !currOrgLoaded) return;
    if (!isSignedIn) return;
    if (organization) return;

    const memberships = userMemberships.data ?? [];

    if (memberships.length === 0) {
      return;
    }

    const firstOrg = memberships[0].organization;

    setActive({ organization: firstOrg.slug }).catch((err) => {
      console.error("Failed to set active org:", err);
    });
  }, [
    authLoaded,
    orgsLoaded,
    currOrgLoaded,
    isSignedIn,
    organization,
    userMemberships,
    setActive,
  ]);

  return null;
}
