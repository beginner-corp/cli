module.exports = function (){
  return `{
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
          "action1": {
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
          "target1": {
            "type": "string",
            "enum": [
              "",
              "posts",
              "users",
              "roles"
            ]
          },
          "owner1": {
            "type": "string",
            "enum": [
              "",
              "SELF",
              "ALL",
              "user"
            ]
          },
          "id1": {
            "type": "string"
          },
          "action2": {
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
          "target2": {
            "type": "string",
            "enum": [
              "",
              "posts",
              "users",
              "roles"
            ]
          },
          "owner2": {
            "type": "string",
            "enum": [
              "",
              "SELF",
              "ALL",
              "user"
            ]
          },
          "id2": {
            "type": "string"
          }
        }
      }
    }
  }`
}
