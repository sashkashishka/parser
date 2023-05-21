job "database" {
  type = "service"

  group "db_group" {
    count = 1

    volume "db_data" {
      type = "host"
      source = "db_data_storage"
    }

    network {
      mode = "host"
      port "db" {
        to = 3306
      }
    }

    task "db" {
      driver = "docker"

      volume_mount {
        volume      = "db_data"
        destination = "/var/lib/mysql"
        propagation_mode = "private"
      }

      config {
        image = "mysql:5.7.42"
        ports =  ["db"]
        mount {
          type = "bind"
          source = "local"
          target = "/docker-entrypoint-initdb.d"
       }
      }

      restart {
        attempts = 1
      }

       template {
        data = <<EOH
          CREATE DATABASE IF NOT EXISTS $${PRISMA_DATABASE};
          CREATE USER IF NOT EXISTS '$${PRISMA_USER}'@'%' IDENTIFIED BY '$${PRISMA_PASSWORD}';
          GRANT ALTER,CREATE,DELETE,DROP,INDEX,INSERT,SELECT,UPDATE,TRIGGER,ALTER ROUTINE, CREATE ROUTINE, EXECUTE, CREATE TEMPORARY TABLES ON $${PRISMA_DATABASE}.* TO '$${PRISMA_USER}'@'%';
        EOH

        destination = "$${NOMAD_TASK_DIR}/init.sql"
      }

      env {
        MYSQL_ROOT_PASSWORD = ${mysql_root_password}
        PRISMA_DATABASE = ${prisma_database}
        PRISMA_USER = ${prisma_user}
        PRISMA_PASSWORD = ${prisma_password}
      }
    }
  }
}
