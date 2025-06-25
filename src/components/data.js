export const experimentColumns = [
    { name: "ID", sortable: false, uid: "id" },
    { name: "NAME", sortable: false, uid: "name" },
    { name: "HYPOTHESIS", sortable: false, uid: "hypothesis" },
    { name: "ALLOCATION", sortable: false, uid: "allocation" },
    { name: "TAGS", sortable: false, uid: "tags" },
    { name: "STATUS", sortable: false, uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

export const dynamicConfigColumns = [
    { name: "ID", sortable: false, uid: "id" },
    { name: "NAME", sortable: false, uid: "name" },
    { name: "TAGS", sortable: false, uid: "tags" },
    { name: "ENABLED", sortable: false, uid: "isEnabled" },
    { name: "ACTIONS", uid: "actions" },
];

export const featureGateColumns = [
    { name: "ID", sortable: false, uid: "id" },
    { name: "NAME", sortable: false, uid: "name" },
    { name: "TAGS", sortable: false, uid: "tags" },
    { name: "STATUS", sortable: false, uid: "status" },
    { name: "ENABLED", sortable: false, uid: "isEnabled" },
    { name: "ACTIONS", uid: "actions" },
];

export const auditLogColumns = [
    { name: "NAME", sortable: false, uid: "name" },
    { name: "ACTION", sortable: false, uid: "actionType" },
    { name: "CHANGE LOG", sortable: false, uid: "changeLog" },
    { name: "UPDATED BY", sortable: false, uid: "updatedBy" },
    { name: "DATE", sortable: false, uid: "date" },
    { name: "TAGS", sortable: false, uid: "tags" },
    { name: "ACTIONS", uid: "actions" },
];

export const experimentStatusOptions = [
    { name: "Active", uid: "active" },
    { name: "Abandoned", uid: "abandoned" },
    { name: "Setup", uid: "setup" },
];
