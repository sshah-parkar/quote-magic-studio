# QuoteWiz Pro - Docker Deployment Guide

## Quick Start

### Build and Run with Docker Compose
```bash
# Build and start the application
docker-compose up --build -d

# View logs
docker-compose logs -f quotewiz

# Stop the application
docker-compose down
```

### Build and Run with Docker
```bash
# Build the image
docker build -t quotewiz-pro .

# Run the container
docker run -d \
  --name quotewiz-app \
  -p 12345:12345 \
  --restart unless-stopped \
  quotewiz-pro

# View logs
docker logs -f quotewiz-app
```

## Access Your Application

Once deployed, your QuoteWiz Pro application will be available at:
- **Local**: http://localhost:12345
- **Server**: http://your-server-ip:12345

## Features

### 🎨 Professional Blue Design
- Clean, modern interface with professional blue color scheme
- Responsive design that works on all devices
- Smooth animations and hover effects

### 🔧 Advanced Conversion Options
- Multiple quote styles (none, single, double, backticks)
- Various separators (comma, semicolon, pipe, space, newline, custom)
- Smart text processing (trim whitespace, remove empty lines)

### 🚀 Production Ready
- Optimized Nginx configuration
- Gzip compression enabled
- Security headers included
- Health check endpoint at `/health`
- Docker multi-stage build for minimal image size

## Configuration

### Port Configuration
The application is configured to run on port **12345**. To change this:

1. Update `docker-compose.yml`:
   ```yaml
   ports:
     - "YOUR_PORT:12345"
   ```

2. Or for Docker run:
   ```bash
   docker run -p YOUR_PORT:12345 quotewiz-pro
   ```

### Environment Variables
- `NODE_ENV=production` - Set to production mode

### Nginx Configuration
The application uses a custom Nginx configuration with:
- Gzip compression for better performance
- Security headers for protection
- Client-side routing support
- Static asset caching
- Health check endpoint

## Monitoring

### Health Check
Visit `/health` endpoint to check application status:
```bash
curl http://localhost:12345/health
```

### Docker Health Check
The container includes automated health checks:
```bash
docker ps  # Check container health status
```

## Troubleshooting

### Check Container Status
```bash
docker-compose ps
```

### View Application Logs
```bash
docker-compose logs quotewiz
```

### Restart Application
```bash
docker-compose restart quotewiz
```

### Rebuild After Changes
```bash
docker-compose down
docker-compose up --build -d
```

## Production Deployment

For production deployment:

1. **Update domain** in `docker-compose.yml` labels section
2. **Configure SSL** with reverse proxy (Traefik, Nginx, etc.)
3. **Set up monitoring** with tools like Prometheus/Grafana
4. **Configure backups** if needed
5. **Set up log rotation** for container logs

## Performance

The application is optimized for performance with:
- Multi-stage Docker build (smaller image size)
- Nginx static file serving
- Gzip compression
- Asset caching
- Minimal dependencies

Enjoy your professional QuoteWiz Pro application! 🎉