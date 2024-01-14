# FastAPI Investor Data Service

This FastAPI service provides a RESTful API wrapper to interact with investor data, leveraging the Preqin API for data retrieval. It includes endpoints for obtaining access tokens, refreshing them, and fetching detailed investor information and commitments.

## Features

- OAuth2 authentication for secure API access.
- Endpoints to obtain and refresh access tokens.
- Fetching investor data and investment commitment information.
- CORS configuration for frontend integration.

## Installation

To run this service, ensure you have Python 3.8+ and FastAPI installed. You can install the required dependencies using pip:

```bash
pip install -r requirements.txt
```

# Running the Service

```shell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```


# Running the Service

To run the test suite, use the pytest command.