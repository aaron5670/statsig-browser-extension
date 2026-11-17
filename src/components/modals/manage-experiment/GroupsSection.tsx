import GroupsTable from "~/components/tables/GroupsTable";
import type { Group } from "~/types/statsig";
import { useState } from "react";
import { UpdateGroupSection } from "./UpdateGroupSection";

export function GroupsSection() {
  const [currentGroup, setCurrentGroup] = useState<Group>();

  return currentGroup ? (
    <UpdateGroupSection
      group={currentGroup}
      onBack={() => setCurrentGroup(undefined)}
    />
  ) : (
    <GroupsTable onEdit={setCurrentGroup} />
  );
}
