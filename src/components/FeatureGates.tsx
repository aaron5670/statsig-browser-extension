import ResourceTable, { type ResourceListProps } from "./tables/ResourceTable";

export default function FeatureGates(props: ResourceListProps) {
  return <ResourceTable {...props} type="featureGates" />;
}
