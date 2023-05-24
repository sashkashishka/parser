job "nestjs" {
  type = "service"

  group "nestjs_group" {
    count = 1

    volume "nestjs_data" {
      type = "host"
      source = "nestjs_storage"
    }

    network {
      mode = "host"
      port "nestjs" {
        to = 8000
        static = 8000
      }
    }

    service {
      name     = "nestjs"
      provider = "nomad"
      port     = "nestjs"
      check {
        name = "nestjs_check"
        type = "http"
        method = "get"
        path = "/api/healthcheck"
        timeout = "30s"
        interval = "5s"
      }
    }

    task "nestjs" {
      driver = "docker"

      volume_mount {
        volume      = "nestjs_data"
        destination = "/usr/app/host-content"
        propagation_mode = "private"
      }

      config {
        image = "${docker_username}/parser"
        ports =  ["nestjs"]
      }

       restart {
         attempts = 2
       }

       template {
        data = <<EOH
        {{- range nomadService "db" }}
        DATABASE_URL=mysql://${prisma_user}:${prisma_password}@{{ .Address }}:{{ .Port }}/${prisma_database}
        {{- end }}
        EOH

        destination = "$${NOMAD_TASK_DIR}/.env"
        env = true
      }

      env {
        HASH_SALT = "${hash_salt}"
        JWT_SECRET = "${jwt_secret}"
        NODE_ENV = "${node_env}"
        COMMIT_HASH = "${commit_hash}"
      }
    }
  }
}

