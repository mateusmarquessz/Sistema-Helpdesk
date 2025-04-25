package com.github.mateusmarquessz.HelpDesk.Controller;

import com.github.mateusmarquessz.HelpDesk.Dto.CriarChamadoDTO;
import com.github.mateusmarquessz.HelpDesk.Model.Chamado;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import com.github.mateusmarquessz.HelpDesk.Service.ChamadoService;
import com.github.mateusmarquessz.HelpDesk.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
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
    //teste@teste.com
    //123

    @GetMapping("/todas")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Chamado> listarTodasChamados() {
        return chamadoService.listarTodosOsChamados();
    }
}
