import ResourceTable, { type ResourceListProps } from "./tables/ResourceTable";

export default function Experiments(props: ResourceListProps) {
  return <ResourceTable {...props} type="experiments" />;
}
