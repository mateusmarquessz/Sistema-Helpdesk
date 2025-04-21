package com.github.mateusmarquessz.HelpDesk.Dto;

public record RegisterRequestDTO(String nome, String email, String senha, String role) {
}