package com.github.mateusmarquessz.HelpDesk.Dto;

import com.github.mateusmarquessz.HelpDesk.Enum.StatusChamado;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarChamadoDTO {
    private String novoTitulo;
    private String novaDescricao;
    private StatusChamado novoStatus;
}
