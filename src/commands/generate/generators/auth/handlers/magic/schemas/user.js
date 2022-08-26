module.exports = function (){
  return `{
      "id": "User",
      "type": "object",
      "required": [
        "email"
      ],
      "properties": {
        "firstname": {
          "type": "string"
        },
        "lastname": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "key": {
          "type": "string"
        },
        "roles": {
          "type": "object",
          "properties": {
            "role1": {
              "type": "string"
            },
            "role2": {
              "type": "string"
            },
            "role3": {
              "type": "string"
            }
          }
        }
      }
    }`
}
