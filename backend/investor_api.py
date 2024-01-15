from fastapi import FastAPI, Depends, HTTPException, Query, Form
from fastapi.security.oauth2 import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
import httpx


app = FastAPI()

BASE_API_URL = "https://api.preqin.com/api"

# OAuth2 configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")
AUTH_TOKEN_URL = "https://api.preqin.com/connect/token"
AUTH_REFRESH_TOKEN_URL = "https://api.preqin.com/connect/refresh_token"


# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Endpoint to get an access token
@app.post("/connect/token")
async def get_access_token(username: str = Form(...), apikey: str = Form(...)):
    data = {
        "username": username,
        "apikey": apikey,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            AUTH_TOKEN_URL,
            data=data,
        )
        if response.status_code == 200:
            token_data = response.json()
            return token_data

    raise HTTPException(status_code=401, detail="Unauthorized")


async def fetch_investor_data(firm_id, access_token):
    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await client.get(
            f"{BASE_API_URL}/Investor?FirmID={firm_id}",
            headers=headers,
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to fetch investor data for FirmId {firm_id}"}

        
@app.get("/api/Investor")
async def get_investor_by_id(FirmID: str, access_token: str = Depends(oauth2_scheme)):
    investor_data = await fetch_investor_data(FirmID, access_token)
    return investor_data


@app.get("/api/Investor/commitment/{commitment_class}/{investor_id}")
async def get_investor_commitment(
    commitment_class: str,
    investor_id: str,
    page: int = Query(default=1, description="Page number", ge=1),
    size: int = Query(default=200, description="Number of items per page", le=200),
    access_token: str = Depends(oauth2_scheme)
):
    preqin_api_url = f"{BASE_API_URL}/Investor/commitment/{commitment_class}/{investor_id}"

    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {"Page": page, "Size": size}
        response = await client.get(preqin_api_url, headers=headers, params=params)

        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch commitment data")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)