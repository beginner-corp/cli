module.exports = function () {
  return `export const Role = {
  "id": "Role",
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "key": {
      "type": "string"
    },
    "rules": {
      "type": "object",
      "properties": {
        "action_1": {
          "type": "string",
          "enum": [
            "",
            "create",
            "read",
            "update",
            "delete",
            "change_permissions"
          ]
        },
        "target_1": {
          "type": "string",
          "enum": [
            "",
            "posts",
            "users",
            "roles"
          ]
        },
        "owner_1": {
          "type": "string",
          "enum": [
            "",
            "SELF",
            "ALL",
            "user"
          ]
        },
        "id_1": {
          "type": "string"
        },
        "action_2": {
          "type": "string",
          "enum": [
            "",
            "create",
            "read",
            "update",
            "delete",
            "change_permissions"
          ]
        },
        "target_2": {
          "type": "string",
          "enum": [
            "",
            "posts",
            "users",
            "roles"
          ]
        },
        "owner_2": {
          "type": "string",
          "enum": [
            "",
            "SELF",
            "ALL",
            "user"
          ]
        },
        "id_2": {
          "type": "string"
        },
        "action_3": {
          "type": "string",
          "enum": [
            "",
            "create",
            "read",
            "update",
            "delete",
            "change_permissions"
          ]
        },
        "target_3": {
          "type": "string",
          "enum": [
            "",
            "posts",
            "users",
            "roles"
          ]
        },
        "owner_3": {
          "type": "string",
          "enum": [
            "",
            "SELF",
            "ALL",
            "user"
          ]
        },
        "id_3": {
          "type": "string"
        },
        "action_4": {
          "type": "string",
          "enum": [
            "",
            "create",
            "read",
            "update",
            "delete",
            "change_permissions"
          ]
        },
        "target_4": {
          "type": "string",
          "enum": [
            "",
            "posts",
            "users",
            "roles"
          ]
        },
        "owner_4": {
          "type": "string",
          "enum": [
            "",
            "SELF",
            "ALL",
            "user"
          ]
        },
        "id_4": {
          "type": "string"
        }
      }
    }
  }
}
`
}
