export function batchInputValidator() {
  return {
    "type": "object",
    "properties": {
      "endpoint": {
        "type": "object",
        "properties": {
          "verb": {
            "type": "string",
            "enum": ["GET", "POST", "PUT", "PATCH", "DELETE"]
          },
          "url": {
            "type": "string",
            "format": "uri"
          }
        },
        "required": ["verb", "url"]
      },
      "payload": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "body": {
              "type": "object"
            }
          }
        }
      }
    },
    "required": ["endpoint", "payload"]
  };
}