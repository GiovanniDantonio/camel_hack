from pydantic import BaseModel


class Vulnerability(BaseModel):
    endpoint: str
    expected_status: int