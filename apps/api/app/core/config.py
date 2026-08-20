from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Hackers Campus API"
    environment: str = Field(default="development", alias="API_ENV")
    host: str = Field(default="0.0.0.0", alias="API_HOST")
    port: int = Field(default=8000, alias="API_PORT")
    api_prefix: str = "/api"
    secret_key: str = Field(default="change-me", alias="SECRET_KEY")
    database_url: str = Field(
        default="postgresql+psycopg://hackers:campus@localhost:5432/hackers_campus",
        alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    # Configure these per college deployment. Do not hard-code a campus LAN here.
    lab_network_name: str = Field(default="hc-labs", alias="LAB_NETWORK_NAME")
    lab_network_driver: str = Field(default="bridge", alias="LAB_NETWORK_DRIVER")
    lab_network_subnet: str = Field(default="172.31.0.0/16", alias="LAB_NETWORK_SUBNET")
    lab_network_gateway: str = Field(default="172.31.0.1", alias="LAB_NETWORK_GATEWAY")
    lab_network_parent: str | None = Field(default=None, alias="LAB_NETWORK_PARENT")
    lab_network_ip_range: str | None = Field(default=None, alias="LAB_NETWORK_IP_RANGE")
    vpn_pki_dir: str = Field(default="/home/hacker/hc-vpn", alias="VPN_PKI_DIR")
    vpn_remote_host: str = Field(default="10.68.118.3", alias="VPN_REMOTE_HOST")
    vpn_remote_port: int = Field(default=1194, alias="VPN_REMOTE_PORT")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
