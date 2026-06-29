# Docker Interview Prep

> The 20% that shows up 80% of the time in DevOps/backend interviews.

Docker is containerization technology that packages applications with their dependencies. Every fullstack dev should know these core concepts.

---

## 📦 Core Concepts

### 1. What is Docker?

**Docker** packages software into **containers** — lightweight, standalone, executable units that include everything needed to run: code, runtime, system tools, libraries, and settings.

**Containers vs Virtual Machines:**

| | Containers | Virtual Machines |
|---|---|---|
| **OS** | Shares host OS kernel | Has full guest OS |
| **Startup** | Milliseconds | Seconds to minutes |
| **Size** | MBs | GBs |
| **Performance** | Near-native | Some overhead |
| **Isolation** | Process-level | Full isolation |

**Key terms:**
- **Image** — Blueprint/read-only template
- **Container** — Running instance of an image
- **Dockerfile** — Recipe to build an image
- **Registry** — Where images are stored (Docker Hub)
- **Volume** — Persistent data storage
- **Network** — How containers communicate

---

### 2. Dockerfile Basics

**What:** A text file with instructions to build a Docker image.

```dockerfile
# Choose base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
```

**Optimized Dockerfile (multi-stage):**

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**Why multi-stage?** The final image is ~90% smaller (no build tools, source code, etc.).

---

### 3. Docker Commands Cheatsheet

| Command | Description |
|---------|-------------|
| `docker build -t myapp .` | Build image from Dockerfile |
| `docker run -p 3000:3000 myapp` | Run container |
| `docker run -d -p 3000:3000 --name app myapp` | Run in background |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker stop container_id` | Stop container |
| `docker rm container_id` | Remove container |
| `docker rmi image_name` | Remove image |
| `docker logs container_id` | View logs |
| `docker exec -it container_id sh` | Shell into container |
| `docker images` | List images |
| `docker pull node:18` | Download image from registry |
| `docker push username/repo:tag` | Upload image to registry |

---

### 4. Docker Compose

**What:** Define and run multi-container applications with a single command.

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - NODE_ENV=production
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:alpine
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

**Common commands:**
```bash
docker-compose up -d          # Start services
docker-compose down           # Stop and remove
docker-compose logs           # View logs
docker-compose ps             # List services
docker-compose exec app sh    # Shell into service
docker-compose restart app    # Restart service
docker-compose up --build     # Rebuild and start
```

---

### 5. Volumes (Persistence)

**What:** Data that survives container restarts/removal.

**Types of volumes:**
```bash
# Named volume (managed by Docker)
docker volume create mydata
docker run -v mydata:/app/data myapp

# Bind mount (maps host directory)
docker run -v /host/path:/container/path myapp

# Anonymous volume (created automatically)
docker run -v /app/data myapp
```

**In Docker Compose:**
```yaml
services:
  app:
    volumes:
      - ./uploads:/app/uploads          # Bind mount
      - postgres_data:/var/lib/postgresql/data  # Named volume

volumes:
  postgres_data:
```

**Common interview question:** *"What's the difference between a volume and a bind mount?"*

> **Answer:** Volumes are managed by Docker, stored in Docker's storage directory, and work on all platforms. Bind mounts map a specific host directory to the container and depend on the host's filesystem structure.

---

### 6. Networks

**What:** How containers communicate.

```bash
# Create a network
docker network create my-network

# Run containers on the network
docker run --network my-network --name app myapp
docker run --network my-network --name db postgres

# App can reach db at 'db:5432' (hostname = container name)
```

**Network drivers:**
| Driver | Use Case |
|--------|----------|
| **bridge** | Default for single-host containers |
| **host** | Container uses host's network (no isolation) |
| **overlay** | Multi-host Docker Swarm networking |
| **none** | No network access |

**In Docker Compose:** Networks are created automatically.

---

### 7. Environment Variables

**Methods to pass env vars:**

```bash
# Command line
docker run -e NODE_ENV=production -e DATABASE_URL=postgres://... myapp

# Environment file
docker run --env-file .env myapp

# In compose
environment:
  - NODE_ENV=production
  - DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@db:5432/myapp

# Using env_file
env_file:
  - .env

# Build-time args (during build, not runtime)
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine
```

---

## 🔥 Most Asked Interview Topics

### 1. Container vs Image vs Registry

| Concept | Analogy | Real Example |
|---------|---------|--------------|
| **Image** | Blueprint/Recipe | `node:18-alpine` |
| **Container** | Built house (running) | `docker run node:18-alpine` |
| **Registry** | Library of blueprints | Docker Hub, ECR, GCR |
| **Dockerfile** | The recipe text | Instructions to build the image |

**Interview answer:** *"An image is a read-only template with instructions for creating a container. A container is a runnable instance of an image. A registry is where images are stored and distributed."*

---

### 2. Image Layers & Caching

```dockerfile
FROM node:18        # Layer 1
WORKDIR /app        # Layer 2
COPY package*.json ./ # Layer 3
RUN npm install     # Layer 4  ← Most expensive
COPY . .            # Layer 5
RUN npm run build   # Layer 6
```

**Key insight:** Docker caches each layer. If a layer changes, all subsequent layers rebuild.

**Optimization trick:** Copy `package.json` before application code. Dependencies only rebuild when `package.json` changes, not when code changes.

```
✅ Good:  COPY package*.json ./ → RUN npm install → COPY . .
❌ Bad:   COPY . . → RUN npm install  (rebuilds on every code change)
```

---

### 3. How do you reduce image size?

| Technique | Size Reduction |
|-----------|----------------|
| **Use alpine images** | node:18-alpine (50MB vs 900MB for full) |
| **Multi-stage builds** | Remove build tools from final image |
| **Combine RUN commands** | `RUN apt-get update && apt-get install -y ...` |
| **Remove package manager cache** | `RUN npm ci --only=production && npm cache clean --force` |
| **Use .dockerignore** | Exclude unnecessary files |
| **Distroless images** | Minimal, no shell or package manager |

```dockerfile
# Example: Minimal production image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

### 4. What's the difference between CMD and RUN?

| Command | When executed | Purpose |
|---------|---------------|---------|
| `RUN` | **Build time** | Execute commands during image build (install packages, compile) |
| `CMD` | **Runtime** | Default command when container starts |
| `ENTRYPOINT` | **Runtime** | Main command, can't be overridden (easily) |

```dockerfile
FROM node:18
RUN npm install           # Executes during build
CMD ["node", "app.js"]    # Executes when container starts

# Container can be run with: docker run myapp
# Or override: docker run myapp node other.js
```

**ENTRYPOINT vs CMD:**
```dockerfile
ENTRYPOINT ["npm"]
CMD ["start"]
# Can be run: docker run myapp    → npm start
# Or override: docker run myapp test → npm test
```

---

### 5. Health Checks

**Why:** Tell Docker if your container is healthy, so it can restart if needed.

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node /app/health.js || exit 1
```

```yaml
# In docker-compose.yml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 10s
```

**States:** `starting` → `healthy` → `unhealthy` → container restarts.

---

### 6. Logging in Docker

```bash
# View logs
docker logs container_name

# Follow logs (tail -f)
docker logs -f container_name

# View recent logs
docker logs --tail 100 container_name

# Logs with timestamps
docker logs -t container_name
```

**Log drivers:**
| Driver | Use Case |
|--------|----------|
| `json-file` | Default, stores JSON logs |
| `local` | Faster, lower disk usage |
| `syslog` | Send logs to syslog |
| `fluentd` | Send to Fluentd |
| `awslogs` | Send to CloudWatch |

**In compose:**
```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

### 7. Security Best Practices

| Practice | Why |
|----------|-----|
| **Don't run as root** | Create a user |
| **Use specific tags** | `node:18-alpine` not `node:latest` |
| **Scan images** | `docker scan myapp` (vulnerabilities) |
| **Keep images minimal** | Remove unnecessary tools |
| **Secret management** | Use secrets, not env vars |
| **Read-only filesystem** | `docker run --read-only` |
| **Drop capabilities** | `--cap-drop ALL --cap-add NET_BIND_SERVICE` |

**Non-root user example:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN chown -R node:node /app
USER node
CMD ["node", "app.js"]
```

---

### 8. Docker vs Alternatives

| Tool | Use Case |
|------|----------|
| **Docker** | Local development, single-host containers |
| **Kubernetes** | Production orchestration at scale |
| **Podman** | Daemonless, more secure alternative |
| **Buildkit** | Modern Docker build system |
| **Containerd** | Industry-standard container runtime |

---

## 🛠️ Practical Scenarios

### Scenario 1: "Container exits immediately after starting"

**Problem:** Container has no long-running process.

```bash
# ❌ Wrong - exits immediately
FROM node:18
CMD ["npm", "run", "build"]  # Build completes, container exits

# ✅ Correct - keep it running
FROM node:18
CMD ["npm", "start"]  # Starts a server that keeps running

# ✅ Or for debugging
docker run -it myapp sh  # Interactive shell
```

**Common fix:** Ensure CMD/ENTRYPOINT starts a process that doesn't exit (server, tail, etc.).

---

### Scenario 2: "Port already in use"

```bash
# Error: port 3000 already in use
docker run -p 3000:3000 myapp

# Fix: Map to different host port
docker run -p 3001:3000 myapp

# Or: Kill existing container
docker kill $(docker ps -q --filter "publish=3000")
```

---

### Scenario 3: "How to debug a failing container"

```bash
# 1. Check logs
docker logs container_id

# 2. Check container status
docker ps -a

# 3. Shell into container if running
docker exec -it container_id sh

# 4. Inspect container details
docker inspect container_id

# 5. Check Docker daemon logs
journalctl -u docker.service

# 6. Run with debugging
docker run --rm -it myapp sh
```

---

### Scenario 4: "Persist data between container restarts"

```bash
# ❌ Data lost when container removed
docker run -d --name app myapp

# ✅ Data persists
docker volume create mydata
docker run -d --name app -v mydata:/app/data myapp

# With bind mount
docker run -d --name app -v /host/data:/app/data myapp
```

---

## 🔥 Top 20 Interview Questions

### 1. What is Docker and why use it?

> **Answer:** Docker packages applications with dependencies into lightweight containers, ensuring consistency across development, testing, and production. Benefits: reproducibility, isolation, portability, and efficient resource use.

### 2. What's the difference between a container and an image?

> **Answer:** An image is a read-only template (blueprint) with instructions. A container is a running instance of that image. You can create many containers from one image.

### 3. Explain Dockerfile instructions: FROM, RUN, CMD, ENTRYPOINT, COPY, ADD

> **Answer:** 
> - `FROM` — Base image
> - `RUN` — Executes commands during build
> - `CMD` — Default command at runtime (can be overridden)
> - `ENTRYPOINT` — Main command at runtime (harder to override)
> - `COPY` — Copy files from host to image
> - `ADD` — Same as COPY but supports URL and tar extraction

### 4. How do you handle environment variables in Docker?

> **Answer:** Use `-e` flag, `--env-file`, or Docker Compose `environment`/`env_file`. For secrets, use Docker secrets or external vaults.

### 5. What are Docker volumes and why use them?

> **Answer:** Volumes persist data beyond container lifecycle. They allow sharing data between containers and persist across restarts/removals.

### 6. What's the difference between `docker stop` and `docker kill`?

> **Answer:** `docker stop` sends SIGTERM (graceful, 10s timeout), `docker kill` sends SIGKILL (immediate). Always try `stop` first.

### 7. Explain Docker networking

> **Answer:** Docker provides bridge (default, single-host), host (shares host network), overlay (multi-host), and none (isolated). Containers on same user-defined bridge can communicate by service name.

### 8. What's the difference between COPY and ADD?

> **Answer:** `ADD` can download from URLs and auto-extract tar files. `COPY` is simpler and preferred for plain file copying. `ADD` is considered "magical" and less transparent.

### 9. How do you reduce Docker image size?

> **Answer:** Use alpine images, multi-stage builds, combine RUN commands, clean package caches, use `.dockerignore`, and distroless images.

### 10. What's a multi-stage build?

> **Answer:** A Dockerfile with multiple `FROM` statements. Build dependencies in one stage, copy only artifacts to the final stage, keeping the image small and secure.

### 11. How do you handle logging in Docker?

> **Answer:** Use `docker logs` for stdout/stderr. Configure log drivers (`json-file`, `local`, `syslog`, `fluentd`, `awslogs`). Set rotation policies in compose.

### 12. What are Docker layers and how does caching work?

> **Answer:** Each instruction creates a layer. Docker caches layers. If a layer changes, all subsequent layers rebuild. Order instructions from least to most frequently changed.

### 13. What's the difference between `docker run`, `docker start`, and `docker exec`?

> **Answer:** `docker run` creates and starts a new container. `docker start` starts an existing stopped container. `docker exec` runs a command in a running container.

### 14. Explain health checks in Docker

> **Answer:** Health checks let Docker know if your container is healthy. If unhealthy, Docker can restart it. Configure with `HEALTHCHECK` instruction or compose `healthcheck`.

### 15. What's a `.dockerignore` file?

> **Answer:** Like `.gitignore`, excludes files from the Docker build context. Reduces build size and prevents secrets from being in the image.

### 16. How do you communicate between containers?

> **Answer:** Place them on the same Docker network. Use container names as hostnames. Example: `http://app:3000` from another container.

### 17. What's the difference between Docker and Kubernetes?

> **Answer:** Docker runs containers on a single host. Kubernetes orchestrates containers across clusters, handling scaling, load balancing, and self-healing.

### 18. How do you update a running container?

> **Answer:** Build a new image, stop the old container, run a new one. In compose: `docker-compose up -d --build`. For zero downtime, use rolling updates (Kubernetes) or blue-green deployments.

### 19. What are Docker secrets?

> **Answer:** Securely manage sensitive data (passwords, API keys). Only available in Docker Swarm mode. Store encrypted, mounted as temporary files in containers.

### 20. How do you inspect container resource usage?

> **Answer:** `docker stats` (real-time), `docker ps -s` (size), `docker system df` (disk usage), `docker container inspect` (details).

---

## 📝 Quick Docker Cheatsheet

```bash
# 📦 Images
docker build -t myapp:latest .
docker images
docker rmi myapp:latest
docker tag myapp:latest username/myapp:latest
docker push username/myapp:latest

# 🏃 Containers
docker run -d -p 3000:3000 --name app myapp:latest
docker ps
docker ps -a
docker stop app
docker start app
docker rm app
docker rm -f app  # Force remove

# 📊 Logs
docker logs app
docker logs -f app
docker logs --tail 100 app

# 🔍 Inspect
docker exec -it app sh
docker inspect app
docker stats app

# 📂 Volumes
docker volume create mydata
docker run -v mydata:/app/data myapp
docker run -v /host/data:/app/data myapp

# 🌐 Networks
docker network create mynet
docker run --network mynet myapp
docker network ls

# 🧹 Cleanup
docker system prune
docker system prune -a  # Remove all unused
docker container prune
docker image prune
docker volume prune

# 📄 Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose exec app sh
docker-compose up -d --build
```

---



## 🔗 Useful Commands Pattern

```bash
# Clean up everything!
docker system prune -a --volumes

# See disk usage
docker system df

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# View logs across compose services
docker-compose logs -f --tail=50

# Shell into a compose service
docker-compose exec service_name sh

# Rebuild and restart a single service
docker-compose up -d --build service_name
```

---

## 📚 Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Container Best Practices](https://cloud.google.com/architecture/best-practices-for-building-containers)

---

**Remember:** In Docker interviews, they care about **practical experience** as much as theory. Always mention real scenarios where Docker helped you or where you faced issues! 🐳