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
      command = ["pnpm", "prisma", "migrate", "deploy"]
      on_failure = "fail"
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
