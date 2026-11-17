import { Chip, Progress } from "@heroui/react";
import { DetailState } from "~/components/sheets/DetailContent";
import { keyListItems } from "~/helpers/keyListItems";
import { useFeatureGateRules } from "~/hooks/useFeatureGateRules";

function conditionLabel(type: string) {
  if (type === "user_id") return "User ID";
  const words = type.replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default function FeatureGateRules({
  featureGateId
}: {
  featureGateId: string;
}) {
  const { rules, isLoading, error, retry } = useFeatureGateRules(featureGateId);

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">
        Rules{" "}
        {!isLoading && !error && (
          <span className="ms-1 font-normal tabular-nums text-default-600">
            ({rules.length})
          </span>
        )}
      </h3>
      {isLoading ? (
        <DetailState loading="Loading feature gate rules…" />
      ) : error ? (
        <DetailState error={error} onRetry={retry} />
      ) : rules.length ? (
        <ol className="divide-y divide-divider rounded-xl border border-divider">
          {rules.map((rule) => (
            <li key={rule.id} className="grid gap-2.5 px-4 py-3">
              <div>
                <h4 className="wrap-anywhere text-sm font-semibold">
                  {rule.name}
                </h4>
                <p className="wrap-anywhere text-xs leading-relaxed text-default-600">
                  Rule ID <span className="font-mono">{rule.id}</span>
                </p>
              </div>
              <Progress
                classNames={{
                  indicator:
                    rule.passPercentage === 100
                      ? "bg-success-700"
                      : "bg-primary",
                  label: "text-xs font-medium text-default-600",
                  value: "text-xs tabular-nums"
                }}
                color={rule.passPercentage === 100 ? "success" : "primary"}
                disableAnimation
                label="Pass rate"
                showValueLabel
                size="sm"
                value={rule.passPercentage}
              />
              <dl className="grid gap-2 text-xs">
                {!!rule.environments?.length && (
                  <div className="space-y-1">
                    <dt className="font-medium text-default-600">
                      Environments
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {[...new Set(rule.environments)].map((environment) => (
                        <Chip
                          key={environment}
                          classNames={{
                            content: "whitespace-normal wrap-anywhere"
                          }}
                          size="sm"
                          variant="flat">
                          {environment}
                        </Chip>
                      ))}
                    </dd>
                  </div>
                )}
                {!!rule.conditions?.length && (
                  <div className="space-y-1">
                    <dt className="font-medium text-default-600">Conditions</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {keyListItems(rule.conditions, (condition) =>
                        JSON.stringify(condition)
                      ).map(({ item: condition, key }) => (
                        <Chip
                          key={key}
                          classNames={{
                            content: "whitespace-normal wrap-anywhere"
                          }}
                          size="sm"
                          variant="flat">
                          {conditionLabel(condition.type)}
                        </Chip>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-default-600">
          No rules are configured for this feature gate.
        </p>
      )}
    </section>
  );
}
