package com.github.mateusmarquessz.HelpDesk.Controller;

import com.github.mateusmarquessz.HelpDesk.Dto.LoginRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.RegisterRequestDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.ResponseDTO;
import com.github.mateusmarquessz.HelpDesk.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
