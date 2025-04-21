package com.github.mateusmarquessz.HelpDesk.Controller;

import com.github.mateusmarquessz.HelpDesk.Dto.CriarChamadoDTO;
import com.github.mateusmarquessz.HelpDesk.Model.Chamado;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import com.github.mateusmarquessz.HelpDesk.Service.ChamadoService;
import com.github.mateusmarquessz.HelpDesk.Service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chamados")
public class ChamadoController {

    private final ChamadoService chamadoService;
    private final UsuarioService usuarioService;

    public ChamadoController(ChamadoService chamadoService, UsuarioService usuarioService) {
        this.chamadoService = chamadoService;
        this.usuarioService = usuarioService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Chamado> criarChamado(@RequestBody CriarChamadoDTO dto, Principal principal) {
        Usuario cliente = usuarioService.getUsuarioByEmail(principal.getName());
        Chamado chamado = chamadoService.criarChamado(dto, cliente);
        return ResponseEntity.ok(chamado);
    }


    @PutMapping("/{chamadoId}/atribuir-tecnico/{tecnicoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> atribuirTecnico(@PathVariable Long chamadoId, @PathVariable Integer tecnicoId) {
        chamadoService.atribuirTecnico(chamadoId, tecnicoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/meus")
    @PreAuthorize("hasRole('TECNICO')")
    public ResponseEntity<List<Chamado>> listarChamadosDoTecnico(Principal principal) {
        Usuario tecnico = usuarioService.getUsuarioByEmail(principal.getName());
        List<Chamado> chamados = chamadoService.listarChamadosDoTecnico(tecnico.getId());
        return ResponseEntity.ok(chamados);
    }
}
