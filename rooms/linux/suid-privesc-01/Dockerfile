FROM ubuntu:24.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    net-tools \
    openssh-server \
    sudo \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged student user
RUN useradd -m -s /bin/bash hacker && echo "hacker:hacker123" | chpasswd

# Create secret root flag
RUN echo "HC{gtfobins_suid_privesc_complete_9901}" > /root/root.txt && chmod 600 /root/root.txt

# Create custom vulnerable diagnostic binary with SUID bit
RUN echo '#include <stdlib.h>\n#include <unistd.h>\nint main() { setuid(0); system("netstat -tlpn"); return 0; }' > /tmp/diag.c && \
    gcc -o /usr/local/bin/sys-diag /tmp/diag.c && \
    rm /tmp/diag.c && \
    chmod 4755 /usr/local/bin/sys-diag

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
