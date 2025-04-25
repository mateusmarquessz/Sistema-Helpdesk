package com.github.mateusmarquessz.HelpDesk.Controller;

import com.github.mateusmarquessz.HelpDesk.Dto.LoginRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.RegisterRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.ResponseDTO;
import com.github.mateusmarquessz.HelpDesk.Enum.Role;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import com.github.mateusmarquessz.HelpDesk.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;


    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody LoginRequestDTO body) {
        return usuarioService.login(body);
    }

    @PostMapping("/cadastro")
    public ResponseEntity<ResponseDTO> register(@RequestBody RegisterRequestDTO body) {
        return usuarioService.register(body);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> atualizaRole(@PathVariable("id") Integer usuarioId,
                                                @RequestBody Role novoRole) {
        try {
            Usuario usuarioAtualizado = usuarioService.AtualizaRole(usuarioId, novoRole);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
    //Admin Login
    //admin@dominio.com
    //senhaSegura123
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }
}
