bind_addr = "0.0.0.0"
data_dir = "$HOME/nomad/datadir"

server {
  enabled = true
  bootstrap_expect = 1
}

client {
  enabled = true

  host_volume "wp-server-vol" {
    path = "$HOME/nomad/host-volumes/wp-server"
    read_only = false
  }

  host_volume "wp-runner-vol" {
    path = "$HOME/nomad/host-volumes/wp-runner"
    read_only = false
  }

  host_volume "db_data_storage" {
    path = "$HOME/nomad/host-volumes/mysql"
    read_only = false
  }

  host_volume "nestjs_storage" {
    path = "$HOME/nomad/host-volumes/nestjs"
    read_only = false
  }
}
