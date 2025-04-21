package com.github.mateusmarquessz.HelpDesk.Controller;

import com.github.mateusmarquessz.HelpDesk.Dto.LoginRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.RegisterRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.ResponseDTO;
import com.github.mateusmarquessz.HelpDesk.Enum.Role;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import com.github.mateusmarquessz.HelpDesk.Repository.UsuarioRepository;
import com.github.mateusmarquessz.HelpDesk.Security.TokenService;
import com.github.mateusmarquessz.HelpDesk.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;


    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody LoginRequestDTO body) {
        Usuario usuario = this.usuarioRepository.findByEmail(body.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (passwordEncoder.matches(body.senha(), usuario.getSenha())) {
            String token = this.tokenService.generateToken(usuario);
            return ResponseEntity.ok(new ResponseDTO(usuario.getNome(), token, usuario.getId(), usuario.getRole()));
        }
        return ResponseEntity.badRequest().body(new ResponseDTO("Credenciais inválidas", null, null, null));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<ResponseDTO> register(@RequestBody RegisterRequestDTO body) {
        Optional<Usuario> usuario = this.usuarioRepository.findByEmail(body.email());

        if (usuario.isEmpty()) {
            Usuario newUser = new Usuario();
            newUser.setNome(body.nome());
            newUser.setEmail(body.email());
            newUser.setSenha(passwordEncoder.encode(body.senha()));
            newUser.setRole(Role.valueOf(body.role()));
            this.usuarioRepository.save(newUser);
            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getNome(), token, newUser.getId(), newUser.getRole()));
        }
        return ResponseEntity.badRequest().body(new ResponseDTO("Usuário já existe", null, null, null));
    }
}
