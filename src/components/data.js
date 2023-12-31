const columns = [
    {name: "ID", sortable: true, uid: "id"},
    {name: "NAME", sortable: true, uid: "name"},
    {name: "HYPOTHESIS", sortable: true, uid: "hypothesis"},
    {name: "ALLOCATION", sortable: true, uid: "allocation"},
    {name: "TAGS", sortable: true, uid: "tags"},
    {name: "STATUS", sortable: true, uid: "status"},
    {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
    {name: "Active", uid: "active"},
    {name: "Abandoned", uid: "abandoned"},
    {name: "Setup", uid: "setup"},
];

export {columns, statusOptions};
