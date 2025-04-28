package com.github.mateusmarquessz.HelpDesk.Controller;

import com.github.mateusmarquessz.HelpDesk.Dto.AtualizarChamadoDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.AtualizarPrioridadeDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.CriarChamadoDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.RelatorioSLA;
import com.github.mateusmarquessz.HelpDesk.Model.Chamado;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import com.github.mateusmarquessz.HelpDesk.Service.ChamadoService;
import com.github.mateusmarquessz.HelpDesk.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chamados")
@RequiredArgsConstructor
public class ChamadoController {

    private final ChamadoService chamadoService;
    private final UsuarioService usuarioService;


    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Chamado> criarChamado(@RequestBody CriarChamadoDTO dto, @RequestParam Integer usuarioId) {
        Usuario usuario = usuarioService.getUsuarioById(usuarioId);
        Chamado chamado = chamadoService.criarChamado(dto, usuario);
        return ResponseEntity.ok(chamado);
    }

    @GetMapping("/cliente")
    @PreAuthorize("hasRole('CLIENTE')")
    public List<Chamado> listarChamadosDoCliente(@AuthenticationPrincipal Usuario cliente) {
        return chamadoService.listarChamadosDoCliente(cliente.getId());
    }

    @PutMapping("/{chamadoId}/atribuir-tecnico/{tecnicoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> atribuirTecnico(@PathVariable Long chamadoId, @PathVariable Integer tecnicoId) {
        chamadoService.atribuirTecnico(chamadoId, tecnicoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/todas")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Chamado> listarTodasChamados() {
        return chamadoService.listarTodosOsChamados();
    }

    @GetMapping("/tecnico/{id}")
    @PreAuthorize("hasRole('TECNICO')")
    public ResponseEntity<List<Chamado>> listarChamadosDoTecnicoPorId(@PathVariable Integer id) {
        Usuario tecnico = usuarioService.getUsuarioById(id);
        List<Chamado> chamados = chamadoService.listarChamadosDoTecnico(tecnico.getId());
        return ResponseEntity.ok(chamados);
    }


    @PutMapping("/{id}/atualizar")
    @PreAuthorize("hasRole('TECNICO')")
    public ResponseEntity<String> atualizarChamado(@PathVariable Long id,
                                                   @RequestBody AtualizarChamadoDTO dto, @AuthenticationPrincipal Usuario tecnico) {
        try {
            chamadoService.atualizarChamado(id, dto.getNovoTitulo(), dto.getNovaDescricao(), dto.getNovoStatus());
            return ResponseEntity.ok("Chamado atualizado com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sla")
    public RelatorioSLA gerarRelatorioSLA(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam("fim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        return chamadoService.gerarRelatorioSLA(inicio, fim);
    }

    @PutMapping("/{id}/prioridade")
    public void atualizarPrioridade(
            @PathVariable Long id,
            @RequestBody AtualizarPrioridadeDTO dto
    ) {
        chamadoService.atualizarPrioridade(id, dto.getPrioridade());
    }

    @PutMapping("/{id}/recusar")
    @PreAuthorize("hasRole('TECNICO')")
    public ResponseEntity<String> recusarChamado(@PathVariable Long id, @AuthenticationPrincipal Usuario tecnico) {
        try {
            chamadoService.recusarChamado(id, tecnico.getId());
            return ResponseEntity.ok("Chamado recusado e atribuído a outro técnico.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
