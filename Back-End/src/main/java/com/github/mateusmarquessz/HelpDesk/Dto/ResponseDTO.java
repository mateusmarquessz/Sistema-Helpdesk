package com.github.mateusmarquessz.HelpDesk.Dto;

import com.github.mateusmarquessz.HelpDesk.Enum.Role;

public record ResponseDTO(String nome, String token, Integer id, Role role) {

}

