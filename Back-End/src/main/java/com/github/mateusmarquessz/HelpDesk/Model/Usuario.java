package com.github.mateusmarquessz.HelpDesk.Model;


import com.github.mateusmarquessz.HelpDesk.Enum.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String email;
    private String senha;

    @Enumerated(EnumType.STRING)
    private Role role;
}
