import {
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Avatar,
  Badge,
  Tabs,
  Tab
} from "@nextui-org/react";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import { useStore } from "~store/useStore";
import React, { Suspense, lazy } from 'react';
import { Sheet } from 'react-modal-sheet';
import TimeAgo from 'react-timeago';
import { useAuditLogs } from "~hooks/useAuditLogs";

const ReactJson = lazy(() => import('@vahagn13/react-json-view'));

const AuditLogDetailSheet = () => {
  const {
    currentAuditLogId,
    isAuditLogDetailSheetOpen,
    setAuditLogDetailSheetOpen,
    setAuditLogSheetOpen,
  } = useStore((state) => state);

  const { auditLogs, isLoading } = useAuditLogs();
  const auditLog = auditLogs.find(log => log.id === currentAuditLogId);

  const handleCloseSheet = () => {
    setAuditLogDetailSheetOpen(false);
    setAuditLogSheetOpen(true);
  };

  const getActionTypeColor = (actionType: string) => {
    if (actionType.includes('create')) return 'success';
    if (actionType.includes('delete')) return 'danger';
    if (actionType.includes('update')) return 'primary';
    return 'default';
  };

  const getActionTypeLabel = (actionType: string) => {
    return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getDateFromAuditLog = (date: string, time: string) => {
    try {
      // Try different date formats to handle the date parsing
      const dateTime = new Date(`${date} ${time}`);
      if (!isNaN(dateTime.getTime())) {
        return dateTime;
      }
      // Try ISO format
      const isoDateTime = new Date(`${date}T${time}`);
      if (!isNaN(isoDateTime.getTime())) {
        return isoDateTime;
      }
      // Fallback to current date if parsing fails
      return new Date();
    } catch {
      return new Date();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const hasChanges = auditLog?.changes?.rules?.new && auditLog?.changes?.rules?.old;

  if (isLoading || !auditLog) {
    return (
      <Sheet
        isOpen={isAuditLogDetailSheetOpen}
        onClose={handleCloseSheet}
        snapPoints={[400]}
        className="audit-log-detail-sheet"
      >
        <Sheet.Container>
          <Sheet.Header className="px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full max-w-xs mb-2" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-full max-w-sm" />
              </div>
              <div className="ml-4">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </Sheet.Header>
          <Sheet.Content>
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" />
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={handleCloseSheet} />
      </Sheet>
    );
  }

  const auditLogDate = getDateFromAuditLog(auditLog.date, auditLog.time);

  return (
    <Sheet
      isOpen={isAuditLogDetailSheetOpen}
      onClose={handleCloseSheet}
      snapPoints={[400]}
      className="audit-log-detail-sheet"
    >
      <Sheet.Container>
        <Sheet.Header className="px-4 py-2 border-b bg-white">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Chip
                  color={getActionTypeColor(auditLog.actionType)}
                  variant="flat"
                  size="sm"
                  className="font-medium h-5 text-[10px]"
                >
                  {getActionTypeLabel(auditLog.actionType)}
                </Chip>
                <span className="text-[10px] text-gray-400 font-medium">
                  <TimeAgo date={auditLogDate} />
                </span>
              </div>
              <h1 className="text-base font-bold text-gray-900 leading-tight truncate">
                {auditLog.name}
              </h1>
            </div>
            <Button
              as="a"
              color="primary"
              endContent={<ExternalLinkIcon color="white" />}
              href={`https://console.statsig.com`}
              size="sm"
              target="_blank"
              variant="solid"
              className="shrink-0 h-8"
            >
              Open
            </Button>
          </div>
        </Sheet.Header>

        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col" draggableAt="both">
            <div className="px-4 py-3 space-y-3">
              {/* User & Date Info Card */}
              <Card className="shadow-sm border-none bg-gray-50/50">
                <CardBody className="p-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Avatar
                        name={getInitials(auditLog.updatedBy)}
                        size="sm"
                        className="bg-primary text-white shrink-0 w-8 h-8 text-[10px]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                          {auditLog.updatedBy}
                        </p>
                        {auditLog.modifierEmail && (
                          <p className="text-xs text-gray-500 truncate">
                            {auditLog.modifierEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    {auditLog.tags.length > 0 && (
                      <div className="shrink-0">
                        <div className="flex flex-wrap gap-1 justify-end max-w-32">
                          {auditLog.tags.slice(0, 2).map((tag) => (
                            <Chip key={tag} size="sm" variant="flat" color="warning" className="h-5 text-[10px]">
                              {tag}
                            </Chip>
                          ))}
                          {auditLog.tags.length > 2 && (
                            <Chip size="sm" variant="flat" color="default" className="h-5 text-[10px]">
                              +{auditLog.tags.length - 2}
                            </Chip>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Changes Section */}
              {hasChanges ? (
                <Card className="shadow-sm border-none">
                  <CardHeader className="pb-0 px-3 pt-3 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900">Changes</h3>
                    <Chip size="sm" variant="flat" color="primary" className="h-5 text-[10px]">
                      {auditLog.changes.rules.new.length} rules
                    </Chip>
                  </CardHeader>
                  <CardBody className="pt-0 px-3 pb-3">
                    <Tabs
                      aria-label="Changes"
                      variant="underlined"
                      classNames={{
                        tabList: "gap-4 w-full border-b border-divider",
                        cursor: "w-full bg-primary",
                        tab: "max-w-fit px-0 h-8",
                        tabContent: "group-data-[selected=true]:text-primary text-xs"
                      }}
                    >
                      <Tab
                        key="before"
                        title={
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            <span>Before</span>
                          </div>
                        }
                      >
                        <div className="mt-2">
                          <div className="bg-red-50/50 border border-red-100 rounded-lg p-2 max-h-60 overflow-auto">
                            <Suspense fallback={
                              <div className="flex justify-center p-2">
                                <Spinner size="sm" />
                              </div>
                            }>
                              <ReactJson
                                displayDataTypes={false}
                                displayObjectSize={false}
                                enableClipboard={true}
                                iconStyle="triangle"
                                indentWidth={2}
                                name={false}
                                onAdd={false}
                                onDelete={false}
                                onEdit={false}
                                src={auditLog.changes.rules.old}
                                theme="bright:inverted"
                                collapsed={1}
                                style={{
                                  fontSize: '11px',
                                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                  backgroundColor: 'transparent'
                                }}
                              />
                            </Suspense>
                          </div>
                        </div>
                      </Tab>

                      <Tab
                        key="after"
                        title={
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <span>After</span>
                          </div>
                        }
                      >
                        <div className="mt-2">
                          <div className="bg-green-50/50 border border-green-100 rounded-lg p-2 max-h-60 overflow-auto">
                            <Suspense fallback={
                              <div className="flex justify-center p-2">
                                <Spinner size="sm" />
                              </div>
                            }>
                              <ReactJson
                                displayDataTypes={false}
                                displayObjectSize={false}
                                enableClipboard={true}
                                iconStyle="triangle"
                                indentWidth={2}
                                name={false}
                                onAdd={false}
                                onDelete={false}
                                onEdit={false}
                                src={auditLog.changes.rules.new}
                                theme="bright:inverted"
                                collapsed={1}
                                style={{
                                  fontSize: '11px',
                                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                  backgroundColor: 'transparent'
                                }}
                              />
                            </Suspense>
                          </div>
                        </div>
                      </Tab>

                      <Tab
                        key="summary"
                        title={
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span>Summary</span>
                          </div>
                        }
                      >
                        <div className="mt-2">
                          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Fields Changed</span>
                                <p className="text-gray-900 mt-0.5 font-medium">
                                  {Object.keys(auditLog.changes.rules.new).length} fields
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Change Type</span>
                                <p className="text-gray-900 mt-0.5 font-medium truncate">
                                  {getActionTypeLabel(auditLog.actionType)}
                                </p>
                              </div>
                            </div>
                            {auditLog.changeLog && (
                              <div className="mt-2 pt-2 border-t border-blue-100">
                                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Description</span>
                                <p className="text-gray-700 mt-0.5 leading-normal text-xs">
                                  {auditLog.changeLog}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-sm border-none bg-gray-50/50">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">No Detailed Changes</h3>
                      <p className="text-xs text-gray-500">
                        This action doesn't include detailed rule changes.
                      </p>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Additional Tags (if many) */}
              {auditLog.tags.length > 2 && (
                <Card className="shadow-sm border-none">
                  <CardHeader className="pb-1 px-3 pt-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">All Tags</h3>
                  </CardHeader>
                  <CardBody className="pt-0 px-3 pb-3">
                    <div className="flex flex-wrap gap-1">
                      {auditLog.tags.map((tag) => (
                        <Chip key={tag} size="sm" variant="flat" color="warning" className="h-5 text-[10px]">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleCloseSheet} />
    </Sheet>
  );
};

export default AuditLogDetailSheet; 