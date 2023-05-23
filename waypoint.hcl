project = "parser"

app "db" {
  build {
    use "docker-pull" {
      image = "mysql"
      tag   = "5.7.42"
    }
  }

  deploy {
    use "nomad-jobspec" {
      jobspec = templatefile("${path.app}/nomad/db.nomad.tpl", {
        mysql_root_password = "${var.mysql_root_password}",
        prisma_database = "${var.prisma_database}",
        prisma_user = "${var.prisma_user}",
        prisma_password = "${var.prisma_password}",
      })
    }
    hook {
      when = "after"
      command = ["echo", "migrate"]
      # command = ["pnpm", "prisma", "migrate", "deploy"]
      on_failure = "fail"
    }
  }
}

app "nestjs" {
  build {
    use "docker" {
      context = "."
      dockerfile = "${path.app}/Dockerfile"
    }

    registry {
      use "docker-pull" {
        image = "${var.docker_username}/parser"
        tag   = "latest"
      }
    }
  }

  deploy {
    use "nomad-jobspec" {
      jobspec = templatefile("${path.app}/nomad/nestjs.nomad.tpl", {
        prisma_database = "${var.prisma_database}",
        prisma_user = "${var.prisma_user}",
        prisma_password = "${var.prisma_password}",
        jwt_secret = "${var.jwt_secret}",
        hash_salt = "${var.hash_salt}",
        node_env = "${var.node_env}",
        docker_username = "${var.docker_username}",
      })
    }
  }
}

variable "mysql_root_password" {
  description = "Mysql root password"
  type        = string
}

variable "prisma_database" {
  description = "prisma database name"
  type        = string
}

variable "prisma_user" {
  description = "mysql user name"
  type        = string
}

variable "prisma_password" {
  description = "mysql user password"
  type        = string
}

variable "hash_salt" {
  description = "hash salt for pass generation"
  type        = string
}

variable "jwt_secret" {
  description = "jwt secret key"
  type        = string
}

variable "node_env" {
  description = "node js env"
  type        = string
  default = "production"
}

variable "docker_username" {
  description = "docker registry username"
  type        = string
}
