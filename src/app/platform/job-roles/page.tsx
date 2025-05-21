"use client";

import React from 'react';
import PlatformLayout from "@/components/platform/PlatformLayout";
import JobRoleManager from "@/components/platform/job-roles/JobRoleManager";

const JobRolesPage = () => {
  return (
    <PlatformLayout title="Job Roles & Recommendations">
      <JobRoleManager />
    </PlatformLayout>
  );
};

export default JobRolesPage;

