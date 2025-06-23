import { Button, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { RxReload } from "react-icons/rx";

import { getUserDetails } from "~/handlers/getUserDetails";

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

  const renderValue = (value: any) => {
    if (typeof value === 'boolean') {
      return <span className={value ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{String(value)}</span>;
    }
    if (value === null || value === undefined) {
      return <span className="text-gray-500">null</span>;
    }
    if (typeof value === 'object') {
      return (
        <pre className="text-xs bg-gray-100 p-2 rounded-md mt-1">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return `"${String(value)}"`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Current User</h3>
        <Button
          isIconOnly
          onPress={fetchUserDetails}
          size="sm"
          variant="flat"
        >
          <RxReload />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner label="Loading user details..." />
        </div>
      ) : userDetails && Object.keys(userDetails).length > 0 ? (
        <div className="space-y-3">
          {Object.entries(userDetails).map(([key, value]) => (
            <div key={key} className="flex justify-between items-start text-sm border-b border-gray-100 pb-2">
              <span className="font-mono text-gray-600 font-medium">{key}</span>
              <span className="font-mono text-right max-w-md">{renderValue(value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No Statsig user details found on this page.</p>
          <p className="text-xs mt-2">Make sure the Statsig SDK is initialized.</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails; 