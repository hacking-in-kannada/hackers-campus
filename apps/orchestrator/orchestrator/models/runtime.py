from dataclasses import dataclass
from typing import Literal


RuntimeKind = Literal["docker", "virtualbox", "vmware", "kvm"]


@dataclass(slots=True)
class RuntimeStatus:
    session_id: str
    state: str
    target_ip: str | None = None

