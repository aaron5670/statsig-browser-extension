import {
  Button,
  Spinner,
  Card,
  CardBody,
  Divider,
  Chip,
  Tooltip,
  Avatar,
} from "@nextui-org/react";
import React, { useEffect, useState, Suspense, lazy } from "react";
import { RxReload, RxCopy } from "react-icons/rx";
import { getUserDetails } from "~/handlers/getUserDetails";

const ReactJson = lazy(() => import("@vahagn13/react-json-view"));

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState<Record<string, any>>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const details = await getUserDetails(tabs[0].id);
      setUserDetails(details?.user || {});
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderValue = (value: any) => {
    if (typeof value === "boolean") {
      return (
        <Chip
          size="sm"
          variant="flat"
          color={value ? "success" : "danger"}
          className="font-semibold"
        >
          {String(value)}
        </Chip>
      );
    }
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }
    if (typeof value === "object") {
      return (
        <div className="w-full mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100 overflow-hidden">
          <Suspense
            fallback={
              <div className="flex justify-center p-2">
                <Spinner size="sm" />
              </div>
            }
          >
            <ReactJson
              src={value}
              theme="bright:inverted"
              name={false}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={true}
              collapsed={1}
              style={{
                fontSize: "12px",
                backgroundColor: "transparent",
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            />
          </Suspense>
        </div>
      );
    }

    const stringValue = String(value);
    const isLong = stringValue.length > 30;

    return (
      <div className="flex items-center gap-2 max-w-full">
        <span className={`text-gray-800 break-all ${isLong ? "text-xs" : "text-sm"}`}>
          {stringValue}
        </span>
        {stringValue && (
          <Tooltip content="Copy" closeDelay={0}>
            <button
              onClick={() => copyToClipboard(stringValue)}
              className="text-gray-400 hover:text-primary transition-colors shrink-0"
            >
              <RxCopy size={14} />
            </button>
          </Tooltip>
        )}
      </div>
    );
  };

  const UserProperty = ({ label, value, isLast = false }: { label: string; value: any; isLast?: boolean }) => (
    <div className={`py-3 ${!isLast ? "border-b border-gray-50" : ""}`}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 min-w-0">
          {renderValue(value)}
        </div>
      </div>
    </div>
  );

  const getInitials = (details: any) => {
    if (details?.name) {
      return details.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return details?.userID?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">User Details</h3>
          <p className="text-xs text-gray-500 mt-1">Statsig SDK identity on this page</p>
        </div>
        <Button
          isIconOnly
          onPress={fetchUserDetails}
          size="sm"
          variant="flat"
          radius="full"
          className="bg-gray-100 hover:bg-gray-200"
        >
          <RxReload className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-3">
          <Spinner size="lg" color="primary" />
          <p className="text-sm text-gray-500 animate-pulse">Fetching user identity...</p>
        </div>
      ) : userDetails && Object.keys(userDetails).length > 0 ? (
        <div className="space-y-6">
          {/* Main Identity Card */}
          <Card shadow="sm" className="border-none bg-white">
            <CardBody className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  name={getInitials(userDetails)}
                  className="w-12 h-12 text-large bg-primary-100 text-primary-600 font-bold"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {userDetails.name || "Anonymous User"}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{userDetails.userID || "No User ID"}</p>
                </div>
                {userDetails.statsigEnvironment && (
                  <Chip size="sm" color="warning" variant="flat" className="capitalize">
                    {userDetails.statsigEnvironment.tier || "unknown"}
                  </Chip>
                )}
              </div>

              <Divider className="bg-gray-100" />

              <div className="mt-2">
                {['userID', 'email', 'ip', 'userAgent', 'country', 'locale'].map((key, idx, arr) => (
                  userDetails[key] && (
                    <UserProperty
                      key={key}
                      label={key === 'userID' ? 'User ID' : key}
                      value={userDetails[key]}
                      isLast={idx === arr.length - 1}
                    />
                  )
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Custom Properties */}
          {userDetails.custom && Object.keys(userDetails.custom).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-700 px-1">Custom Properties</h4>
              <Card shadow="sm" className="border-none bg-white">
                <CardBody className="p-4">
                  {Object.entries(userDetails.custom).map(([key, value], idx, arr) => (
                    <UserProperty
                      key={key}
                      label={key}
                      value={value}
                      isLast={idx === arr.length - 1}
                    />
                  ))}
                </CardBody>
              </Card>
            </div>
          )}

          {/* Private Properties */}
          {userDetails.privateAttributes && Object.keys(userDetails.privateAttributes).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-700 px-1">Private Attributes</h4>
              <Card shadow="sm" className="border-none bg-white">
                <CardBody className="p-4">
                  {Object.entries(userDetails.privateAttributes).map(([key, value], idx, arr) => (
                    <UserProperty
                      key={key}
                      label={key}
                      value={value}
                      isLast={idx === arr.length - 1}
                    />
                  ))}
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <Card shadow="none" className="bg-gray-50 border-2 border-dashed border-gray-200">
          <CardBody className="py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No User Found</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              We couldn't detect a Statsig user on this page. Make sure the SDK is initialized.
            </p>
            <Button
              onPress={fetchUserDetails}
              variant="flat"
              color="primary"
              size="sm"
              className="mt-6"
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default UserDetails; 