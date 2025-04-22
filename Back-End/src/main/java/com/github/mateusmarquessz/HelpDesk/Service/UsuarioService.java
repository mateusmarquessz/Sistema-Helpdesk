package com.github.mateusmarquessz.HelpDesk.Service;


import com.github.mateusmarquessz.HelpDesk.Dto.LoginRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.RegisterRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.ResponseDTO;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import com.github.mateusmarquessz.HelpDesk.Repository.UsuarioRepository;
import com.github.mateusmarquessz.HelpDesk.Security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.github.mateusmarquessz.HelpDesk.Enum.Role;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public Usuario getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
    }

    public Usuario getUsuarioById(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    public ResponseEntity<ResponseDTO> login(LoginRequestDTO body) {
        Usuario usuario = usuarioRepository.findByEmail(body.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (passwordEncoder.matches(body.senha(), usuario.getSenha())) {
            String token = tokenService.generateToken(usuario);
            return ResponseEntity.ok(new ResponseDTO(usuario.getNome(), token, usuario.getId(), usuario.getRole()));
        }

        return ResponseEntity.badRequest().body(new ResponseDTO("Credenciais inválidas", null, null, null));
    }

    public ResponseEntity<ResponseDTO> register(RegisterRequestDTO body) {
        Optional<Usuario> existingUser = usuarioRepository.findByEmail(body.email());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(new ResponseDTO("Usuário já existe", null, null, null));
        }

        Usuario newUser = new Usuario();
        newUser.setNome(body.nome());
        newUser.setEmail(body.email());
        newUser.setSenha(passwordEncoder.encode(body.senha()));
        newUser.setRole(Role.CLIENT);
        usuarioRepository.save(newUser);

        String token = tokenService.generateToken(newUser);
        return ResponseEntity.ok(new ResponseDTO(newUser.getNome(), token, newUser.getId(), newUser.getRole()));
    }

}
