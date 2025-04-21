package com.github.mateusmarquessz.HelpDesk.Dto;


import com.github.mateusmarquessz.HelpDesk.Enum.PrioridadeChamado;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CriarChamadoDTO {
    private String titulo;
    private String descricao;
    private PrioridadeChamado prioridade;
}

