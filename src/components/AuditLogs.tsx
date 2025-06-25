import React, { useMemo, useState, useCallback } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useStore } from "~store/useStore";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import { VerticalDotsIcon } from "~components/icons/VerticalDotsIcon";
import { SearchIcon } from "~components/icons/SearchIcon";
import { useAuditLogs } from "~hooks/useAuditLogs";
import Fuse from 'fuse.js';
import TimeAgo from 'react-timeago';

export default function AuditLogs() {
  const [filterValue, setFilterValue] = useState("");
  const {
    auditLogs = [],
    isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    refresh
  } = useAuditLogs();

  const {
    setCurrentAuditLogId,
    setAuditLogDetailSheetOpen,
  } = useStore((state) => state);

  const setCurrentAuditLog = (auditLogId: string) => {
    setCurrentAuditLogId(auditLogId);
    setAuditLogDetailSheetOpen(true);
  };

  const getActionTypeColor = (actionType: string): "success" | "primary" | "warning" | "secondary" | "danger" | "default" => {
    const action = actionType.toLowerCase();

    // Handle exact matches first
    switch (action) {
      case 'experiment_start':
        return 'success';
      case 'experiment_edit':
      case 'experiment_update':
        return 'primary';
      case 'experiment_restart':
        return 'warning';
      case 'experiment_overrides_edit':
        return 'secondary';
      case 'experiment_abandon':
        return 'danger';
      case 'config_conditions_update':
        return 'primary';
      case 'config_add_tag':
        return 'success';
      case 'config_state_toggle':
        return 'danger';
      case 'experiment_decision_make':
        return 'warning';
      case 'update_experiment_enabled_non_prod_environments':
        return 'secondary';
      case 'create':
        return 'success';
      case 'delete':
      case 'archive':
        return 'danger';
      case 'update':
      case 'edit':
        return 'primary';
      default:
        // Handle partial matches for flexibility
        if (action.includes('start') || action.includes('create')) {
          return 'success';
        } else if (action.includes('delete') || action.includes('archive') || action.includes('toggle')) {
          return 'danger';
        } else if (action.includes('restart') || action.includes('warning')) {
          return 'warning';
        } else if (action.includes('override') || action.includes('environment')) {
          return 'secondary';
        } else if (action.includes('edit') || action.includes('update') || action.includes('condition')) {
          return 'primary';
        }
        return 'default';
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    return actionType.charAt(0).toUpperCase() + actionType.slice(1);
  };

  const getTagColor = (tag: string): "success" | "primary" | "warning" | "secondary" | "danger" | "default" => {
    const tagLower = tag.toLowerCase();

    // Assign colors based on tag content/meaning
    if (tagLower.includes('nexus') || tagLower.includes('platform')) {
      return 'warning';
    } else if (tagLower.includes('prod') || tagLower.includes('production')) {
      return 'danger';
    } else if (tagLower.includes('test') || tagLower.includes('dev') || tagLower.includes('staging')) {
      return 'secondary';
    } else if (tagLower.includes('beta') || tagLower.includes('alpha') || tagLower.includes('preview')) {
      return 'primary';
    } else if (tagLower.includes('feature') || tagLower.includes('experiment')) {
      return 'success';
    } else {
      // Create a deterministic color based on tag content for consistency
      const colors: Array<"success" | "primary" | "warning" | "secondary" | "danger" | "default"> = ['default', 'primary', 'secondary', 'success', 'warning'];
      const colorIndex = tag.length % colors.length;
      return colors[colorIndex];
    }
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

  const fuse = useMemo(() => {
    return new Fuse(auditLogs, {
      keys: ['name', 'actionType', 'changeLog', 'updatedBy', 'modifierEmail', 'tags'],
      threshold: 0.3,
    });
  }, [auditLogs]);

  const filteredItems = useMemo(() => {
    if (!filterValue) return auditLogs;
    return fuse.search(filterValue).map(result => result.item);
  }, [auditLogs, filterValue, fuse]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 p-4 border-b border-divider">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              color="primary"
              size="sm"
              variant="flat"
              onPress={refresh}
              isLoading={isLoading}
            >
              Refresh
            </Button>
          </div>
          <Button
            as={'a'}
            className="bg-foreground text-background"
            endContent={<ExternalLinkIcon color={'white'} />}
            href={"https://console.statsig.com/"}
            size="sm"
            target="_blank"
          >
            Open Statsig
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search audit logs..."
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <p>No audit logs found</p>
            {filterValue && (
              <p className="text-sm mt-1">Try adjusting your search terms</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-divider">
            {filteredItems.map((auditLog) => (
              <div
                key={auditLog.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setCurrentAuditLog(auditLog.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Action and Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <Chip
                        color={getActionTypeColor(auditLog.actionType)}
                        size="sm"
                        variant="flat"
                        className="text-xs font-medium"
                      >
                        {getActionTypeLabel(auditLog.actionType)}
                      </Chip>
                      <h3 className="font-medium text-gray-900 truncate flex-1">
                        {auditLog.name}
                      </h3>
                    </div>

                    {/* Change Description */}
                    {auditLog.changeLog && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {auditLog.changeLog}
                      </p>
                    )}

                    {/* User and Date */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <span>By {auditLog.updatedBy}</span>
                      {auditLog.modifierEmail && auditLog.modifierEmail !== auditLog.updatedBy && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{auditLog.modifierEmail}</span>
                        </>
                      )}
                      <span>•</span>
                      <TimeAgo date={getDateFromAuditLog(auditLog.date, auditLog.time)} />
                    </div>

                    {/* Tags */}
                    {auditLog.tags && auditLog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {auditLog.tags.map((tag: string, index: number) => (
                          <Chip
                            key={`${tag}-${index}`}
                            color={getTagColor(tag)}
                            size="sm"
                            variant="dot"
                            className="text-xs"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <div className="flex-shrink-0">
                    <Dropdown backdrop="opaque" className="bg-background border-1 border-default-200">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <VerticalDotsIcon height={16} width={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="view"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentAuditLog(auditLog.id);
                          }}
                        >
                          View Details
                        </DropdownItem>
                        <DropdownItem
                          key="open"
                          as={'a'}
                          endContent={<ExternalLinkIcon />}
                          href={`https://console.statsig.com`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open on Statsig
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isReachingEnd && filteredItems.length > 0 && (
          <div className="p-4 text-center border-t border-divider">
            <Button
              color="primary"
              variant="flat"
              onPress={loadMore}
              isLoading={isLoadingMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}

        {/* End of Results */}
        {isReachingEnd && filteredItems.length > 0 && (
          <div className="p-4 text-center text-gray-500 text-sm border-t border-divider">
            You've reached the end of the audit logs
          </div>
        )}
      </div>
    </div>
  );
} 