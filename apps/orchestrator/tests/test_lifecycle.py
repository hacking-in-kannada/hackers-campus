from orchestrator.providers.docker import DockerProvider
from orchestrator.providers.virtualbox import VirtualBoxProvider
from orchestrator.services.lifecycle import LifecycleService


def test_lifecycle_provision_docker():
    provider = DockerProvider()
    service = LifecycleService(provider)

    result = service.provision(session_id="sess-001", room_id="sql-injection-01")

    assert result["session_id"] == "sess-001"
    assert result["state"] == "created:sql-injection-01"
    assert result["target_ip"] == "10.100.50.10"


def test_lifecycle_provision_virtualbox():
    provider = VirtualBoxProvider()
    service = LifecycleService(provider)

    result = service.provision(session_id="sess-002", room_id="kerberos-enum-01")

    assert result["session_id"] == "sess-002"
    assert result["state"] == "created:kerberos-enum-01"
    assert result["target_ip"] is None
