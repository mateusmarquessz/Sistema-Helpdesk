package com.github.mateusmarquessz.HelpDesk.Model;

import com.github.mateusmarquessz.HelpDesk.Enum.TipoMensagem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chamado_id")
    private Chamado chamado;

    @ManyToOne
    @JoinColumn(name = "remetente_id")
    private Usuario remetente;

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    @Enumerated(EnumType.STRING)
    private TipoMensagem tipo;

    private String arquivoUrl;

    private LocalDateTime criadoEm;
}
