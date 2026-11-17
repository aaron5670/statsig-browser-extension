import ResourceTable, { type ResourceListProps } from "./tables/ResourceTable";

export default function DynamicConfigs(props: ResourceListProps) {
  return <ResourceTable {...props} type="dynamicConfigs" />;
}
