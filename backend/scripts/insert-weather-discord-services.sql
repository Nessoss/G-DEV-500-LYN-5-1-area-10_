-- Insert Weather service
INSERT INTO "Service" (slug, name, enabled) VALUES ('weather', 'Weather', true) ON CONFLICT (slug) DO NOTHING;

-- Insert Discord service  
INSERT INTO "Service" (slug, name, enabled) VALUES ('discord', 'Discord', true) ON CONFLICT (slug) DO NOTHING;

-- Insert Weather actions
INSERT INTO "Action" ("serviceId", key, description, "configSchema")
SELECT s.id, 'check_weather', 'Check weather for a city', '{
  "type": "object",
  "properties": {
    "city": {
      "type": "string",
      "description": "Name of the city to check weather for",
      "minLength": 1,
      "maxLength": 100
    }
  },
  "required": ["city"]
}'::json
FROM "Service" s WHERE s.slug = 'weather'
ON CONFLICT ("serviceId", key) DO NOTHING;

INSERT INTO "Action" ("serviceId", key, description, "configSchema")
SELECT s.id, 'check_rain', 'Check if it is raining in a city', '{
  "type": "object",
  "properties": {
    "city": {
      "type": "string",
      "description": "Name of the city to check for rain",
      "minLength": 1,
      "maxLength": 100
    }
  },
  "required": ["city"]
}'::json
FROM "Service" s WHERE s.slug = 'weather'
ON CONFLICT ("serviceId", key) DO NOTHING;

-- Insert Discord reactions
INSERT INTO "Reaction" ("serviceId", key, description, "configSchema")
SELECT s.id, 'send_message', 'Send a message to Discord via webhook', '{
  "type": "object",
  "properties": {
    "webhookUrl": {
      "type": "string",
      "format": "uri",
      "description": "Discord webhook URL",
      "pattern": "^https://discord(app)?\\.com/api/webhooks/[0-9]+/[A-Za-z0-9_-]+$"
    },
    "message": {
      "type": "string",
      "description": "Message content to send",
      "minLength": 1,
      "maxLength": 2000
    },
    "username": {
      "type": "string",
      "description": "Username to display (optional)",
      "maxLength": 80
    }
  },
  "required": ["webhookUrl", "message"]
}'::json
FROM "Service" s WHERE s.slug = 'discord'
ON CONFLICT ("serviceId", key) DO NOTHING;

INSERT INTO "Reaction" ("serviceId", key, description, "configSchema")
SELECT s.id, 'send_weather_alert', 'Send a weather alert to Discord', '{
  "type": "object",
  "properties": {
    "webhookUrl": {
      "type": "string",
      "format": "uri",
      "description": "Discord webhook URL",
      "pattern": "^https://discord(app)?\\.com/api/webhooks/[0-9]+/[A-Za-z0-9_-]+$"
    }
  },
  "required": ["webhookUrl"]
}'::json
FROM "Service" s WHERE s.slug = 'discord'
ON CONFLICT ("serviceId", key) DO NOTHING;
