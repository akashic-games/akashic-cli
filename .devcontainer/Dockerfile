FROM node:22

# Install basic development tools
RUN apt update && apt install -y less \
    git \
    procps \
    sudo \
    vim \
    fzf \
    zsh \
    man-db \
    unzip \
    gnupg2 \
    gh \
    jq \
    cloc

# Ensure default node user has access to /usr/local/share
RUN mkdir -p /usr/local/share/npm-global && \
  chown -R node:node /usr/local/share

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Persist bash history.
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace && \
  chown -R node:node /workspace

WORKDIR /workspace

# RUN ARCH=$(dpkg --print-architecture) && \
#   wget "https://github.com/dandavison/delta/releases/download/0.18.2/git-delta_0.18.2_${ARCH}.deb" && \
#   sudo dpkg -i "git-delta_0.18.2_${ARCH}.deb" && \
#   rm "git-delta_0.18.2_${ARCH}.deb"

# Set up non-root user
USER node

# Install global packages
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh

# Default powerline10k theme
# RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.2.0/zsh-in-docker.sh)" -- \
#   -p git \
#   -p fzf \
#   -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
#   -a "source /usr/share/doc/fzf/examples/completion.zsh" \
#   -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
#   -x

