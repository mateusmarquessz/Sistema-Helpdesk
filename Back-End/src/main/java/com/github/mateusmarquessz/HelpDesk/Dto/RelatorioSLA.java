package com.github.mateusmarquessz.HelpDesk.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RelatorioSLA {
    private long chamadosFechados;
    private long chamadosDentroSLA;
    private long chamadosForaSLA;
    private double percentualCumprimento;
}
