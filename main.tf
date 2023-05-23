terraform {
  required_providers {
    nomad = {
      source  = "hashicorp/nomad"
      version = "1.4.20"
    }
  }
}

provider "nomad" {
  address = var.nomad_addr
  secret_id = var.nomad_token
}

resource "nomad_job" "db" {
  jobspec = templatefile(
    "${path.module}/nomad/db.nomad.tpl",
    {
      mysql_root_password = var.mysql_root_password,
      prisma_database = var.prisma_database,
      prisma_user = var.prisma_user,
      prisma_password = var.prisma_password,
    }
  )
}

resource "nomad_job" "nestjs" {
  jobspec = templatefile(
    "${path.module}/nomad/nestjs.nomad.tpl",
    {
      prisma_database = var.prisma_database,
      prisma_user = var.prisma_user,
      prisma_password = var.prisma_password,
      jwt_secret = var.jwt_secret,
      hash_salt = var.hash_salt,
      node_env = var.node_env,
      docker_username = var.docker_username,
    }
  )
  depends_on = [
    nomad_job.db
  ]
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

variable "nomad_token" {
  description = "nomad token"
  type        = string
}

variable "nomad_addr" {
  description = "nomad addr"
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
