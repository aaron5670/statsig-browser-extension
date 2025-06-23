import { Card, CardBody, CardHeader, Chip, Progress, Spinner } from "@nextui-org/react";
import { useFeatureGateRules, type FeatureGateRule } from "~hooks/useFeatureGateRules";
import React from "react";

interface Props {
  featureGateId: string;
}

const FeatureGateRules = ({ featureGateId }: Props) => {
  const { rules, isLoading, error } = useFeatureGateRules(featureGateId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 text-center py-4">
        Failed to load rules
      </div>
    );
  }

  if (!rules || rules.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No rules configured for this feature gate
      </div>
    );
  }

  const getPassPercentageColor = (percentage: number) => {
    if (percentage === 0) return "danger";
    if (percentage === 100) return "success";
    return "warning";
  };

  const getConditionLabel = (type: string) => {
    switch (type) {
      case "public":
        return "Public";
      case "user_id":
        return "User ID";
      case "custom":
        return "Custom";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-md font-medium">Rules ({rules.length})</h3>
      <div className="space-y-3">
        {rules.map((rule: FeatureGateRule) => (
          <Card key={rule.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start w-full">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{rule.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">Rule ID: {rule.id}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Chip
                    color={getPassPercentageColor(rule.passPercentage)}
                    size="sm"
                    variant="flat"
                  >
                    {rule.passPercentage}% Pass
                  </Chip>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                {/* Pass Percentage Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Pass Rate</span>
                    <span>{rule.passPercentage}%</span>
                  </div>
                  <Progress
                    color={getPassPercentageColor(rule.passPercentage)}
                    size="sm"
                    value={rule.passPercentage}
                    className="w-full"
                  />
                </div>

                {/* Environments */}
                {rule.environments && rule.environments.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">Environments</p>
                    <div className="flex flex-wrap gap-1">
                      {rule.environments.map((env) => (
                        <Chip
                          key={env}
                          color="primary"
                          size="sm"
                          variant="bordered"
                          className="text-xs"
                        >
                          {env}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditions */}
                {rule.conditions && rule.conditions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-1">
                      {rule.conditions.map((condition, index) => (
                        <Chip
                          key={index}
                          color="secondary"
                          size="sm"
                          variant="flat"
                          className="text-xs"
                        >
                          {getConditionLabel(condition.type)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureGateRules; 