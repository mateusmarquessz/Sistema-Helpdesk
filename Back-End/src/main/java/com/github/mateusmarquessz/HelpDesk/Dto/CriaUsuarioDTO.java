package com.github.mateusmarquessz.HelpDesk.Dto;
import com.github.mateusmarquessz.HelpDesk.Enum.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CriaUsuarioDTO {
    private String nome;
    private String email;
    private String senha;
    private Role role;
}