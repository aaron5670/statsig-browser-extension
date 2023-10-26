import {UpdateGroupSection} from "~components/modals/manage-experiment/UpdateGroupSection";
import GroupsTable from "~components/tables/GroupsTable";
import {type Group} from "~types/statsig";
import React, {useState} from "react";

type View = 'form' | 'table';

export const GroupsSection = () => {
  const [view, setView] = useState<View>('table');
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const changeView = () => {
    setView((state) => state === 'table' ? 'form' : 'table');
  };

  return (
    <div className="flex flex-col justify-between gap-4">
      {view === 'table' ? (
        <GroupsTable changeView={changeView} setCurrentGroup={setCurrentGroup}/>
      ) : (
        <UpdateGroupSection changeView={changeView} group={currentGroup}/>
      )}
    </div>
  );
};
