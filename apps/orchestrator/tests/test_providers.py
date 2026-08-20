from orchestrator.providers.docker import DockerProvider
from orchestrator.providers.virtualbox import VirtualBoxProvider


def test_docker_provider_lifecycle():
    provider = DockerProvider()

    # Healthcheck
    health = provider.health()
    assert health["status"] == "ok"
    assert health["provider"] == "docker"

    # Create & Start
    created = provider.create("sess-100", "sql-injection-01")
    assert created.session_id == "sess-100"
    assert created.state == "created:sql-injection-01"

    started = provider.start("sess-100")
    assert started.state == "running"
    assert started.target_ip == "10.100.50.10"

    # Status & IP
    status = provider.status("sess-100")
    assert status.state == "running"
    assert provider.get_ip("sess-100") == "10.100.50.10"

    # Reset, Stop, Destroy
    reset = provider.reset("sess-100")
    assert reset.state == "resetting"

    stopped = provider.stop("sess-100")
    assert stopped.state == "stopped"

    destroyed = provider.destroy("sess-100")
    assert destroyed.state == "destroyed"


def test_virtualbox_provider_lifecycle():
    provider = VirtualBoxProvider()

    # Healthcheck
    health = provider.health()
    assert health["status"] == "planned"
    assert health["provider"] == "virtualbox"

    # Create & Start
    created = provider.create("sess-200", "kerberos-enum-01")
    assert created.session_id == "sess-200"
    assert created.state == "created:kerberos-enum-01"

    started = provider.start("sess-200")
    assert started.state == "running"
    assert provider.get_ip("sess-200") is None

    # Reset, Stop, Destroy
    reset = provider.reset("sess-200")
    assert reset.state == "resetting"

    stopped = provider.stop("sess-200")
    assert stopped.state == "stopped"

    destroyed = provider.destroy("sess-200")
    assert destroyed.state == "destroyed"
