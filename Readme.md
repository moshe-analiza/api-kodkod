# Gemini Data Generator API

## Overview

This API allows clients to send a prompt and a schema to Google's Gemini API (`gemini-2.0-flash`). The response returned will be a JSON structure based on the provided schema.

---

## Endpoint

**POST** `/genData`

---

## Request Format

The request body must be a JSON object with the following fields:

```json
{
  "schema": {
    "type": "ARRAY",
    "items": {
      "type": "OBJECT",
      "properties": {
        "name": { "type": "STRING" },
        "codeName": { "type": "STRING" }
      }
    },
    "propertyOrdering": ["name", "codeName"]
  },
  "api_key": "your-gemini-api-key",
  "prompt": "Generate a list of commanders with names and code names."
}



Validation Rules
schema:

Must be an object with:

type: "ARRAY"

items.type: "OBJECT"

items.properties: an object

propertyOrdering: an array of strings

All keys in propertyOrdering must exist in items.properties

api_key:

Must be a non-empty string

prompt:

Must be a non-empty string

Response
Success
{
  "result": "[{\"name\":\"General Marcus Steele\",\"codeName\":\"Ironhawk\"}, ...]"
}

Error
{ "error": "Invalid schema structure" }
Or other relevant error messages, such as:

Missing fields

Invalid types

API key issues

Example cURL Request

curl -X POST https://api-kodkod.onrender.com/api/genData
  -H "Content-Type: application/json" \
  -d "{
    \"schema\": {
      \"type\": \"ARRAY\",
      \"items\": {
        \"type\": \"OBJECT\",
        \"properties\": {
          \"name\": { \"type\": \"STRING\" },
          \"codeName\": { \"type\": \"STRING\" }
        }
      },
      \"propertyOrdering\": [\"name\", \"codeName\"]
    },
    \"api_key\": \"your-gemini-api-key\",
    \"prompt\": \"Generate a list of commanders with names and code names.\"
  }"


Notes
This API forwards your request to Gemini using the provided schema and prompt.

Ensure your Gemini API key is valid and kept secure.

The Gemini API may have rate limits or usage restrictions.


gemini client:

using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class GeminiIntelClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiIntelClient(string apiKey)
    {
        _httpClient = new HttpClient();
        _apiKey = apiKey;
    }

    public async Task<string> GetIntelAsync(string prompt)
    {
        string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={_apiKey}";

        var body = new
        {
            contents = new[]
            {
                new {
                    parts = new[] {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(body);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(url, content);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync();
    }
}
