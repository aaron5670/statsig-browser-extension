export const experimentColumns = [
    {name: "ID", sortable: true, uid: "id"},
    {name: "NAME", sortable: true, uid: "name"},
    {name: "HYPOTHESIS", sortable: true, uid: "hypothesis"},
    {name: "ALLOCATION", sortable: true, uid: "allocation"},
    {name: "TAGS", sortable: true, uid: "tags"},
    {name: "STATUS", sortable: true, uid: "status"},
    {name: "ACTIONS", uid: "actions"},
];

export const dynamicConfigColumns = [
    {name: "ID", sortable: true, uid: "id"},
    {name: "NAME", sortable: true, uid: "name"},
    {name: "TAGS", sortable: true, uid: "tags"},
    {name: "ENABLED", sortable: true, uid: "isEnabled"},
    {name: "ACTIONS", uid: "actions"},
];

export const experimentStatusOptions = [
    {name: "Active", uid: "active"},
    {name: "Abandoned", uid: "abandoned"},
    {name: "Setup", uid: "setup"},
];

export const dynamicConfigStatusOptions = [
    {name: "Enabled", uid: 'true'},
    {name: "Disabled", uid: 'false'},
];
