package com.github.mateusmarquessz.HelpDesk.Service;

import com.github.mateusmarquessz.HelpDesk.Dto.CriarChamadoDTO;
import com.github.mateusmarquessz.HelpDesk.Enum.Role;
import com.github.mateusmarquessz.HelpDesk.Enum.StatusChamado;
import com.github.mateusmarquessz.HelpDesk.Model.Chamado;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import com.github.mateusmarquessz.HelpDesk.Repository.ChamadoRepository;
import com.github.mateusmarquessz.HelpDesk.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RequiredArgsConstructor
@Service
public class ChamadoService {

    private final ChamadoRepository chamadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AtomicInteger indiceRoundRobin = new AtomicInteger(0);


    public Chamado criarChamado(CriarChamadoDTO dto, Usuario cliente) {
        Chamado chamado = new Chamado();
        chamado.setTitulo(dto.getTitulo());
        chamado.setDescricao(dto.getDescricao());
        chamado.setPrioridade(dto.getPrioridade());
        chamado.setStatus(StatusChamado.ABERTO);
        chamado.setCliente(cliente);
        chamado.setCriadoEm(LocalDateTime.now());
        chamado.setAtualizadoEm(LocalDateTime.now());
        Usuario tecnicoSelecionado = buscarTecnicoRoundRobin();
        chamado.setTecnico(tecnicoSelecionado);

        return chamadoRepository.save(chamado);
    }


    public void atribuirTecnico(Long chamadoId, Integer tecnicoId) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado"));

        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        if (tecnico.getRole() != Role.TECNICO) {
            throw new RuntimeException("Usuário não é um técnico");
        }

        chamado.setTecnico(tecnico);
        chamado.setAtualizadoEm(LocalDateTime.now());
        chamadoRepository.save(chamado);
    }

    public List<Chamado> listarChamadosDoCliente(Integer clienteId) {
        return chamadoRepository.findByClienteId(clienteId);
    }

    public List<Chamado> listarTodosOsChamados(){
        return chamadoRepository.findAll();
    }

    public List<Chamado> listarChamadosDoTecnico(Integer tecnicoId) {
        return chamadoRepository.findByTecnicoId(tecnicoId);
    }

    private Usuario buscarTecnicoRoundRobin() {
        List<Usuario> tecnicos = usuarioRepository.findByRole(Role.TECNICO);
        if (tecnicos.isEmpty()) {
            throw new RuntimeException("Nenhum técnico disponível para atribuição");
        }

        int totalTecnicos = tecnicos.size();
        int startIndex = indiceRoundRobin.get();
        int currentIndex = startIndex;

        for (int i = 0; i < totalTecnicos; i++) {
            Usuario tecnico = tecnicos.get(currentIndex);
            boolean tecnicoLivre = chamadoRepository.countByTecnicoAndStatusIn(
                    tecnico,
                    List.of(StatusChamado.ABERTO, StatusChamado.EM_ATENDIMENTO)
            ) == 0;

            if (tecnicoLivre) {
                indiceRoundRobin.set((currentIndex + 1) % totalTecnicos);
                return tecnico;
            }

            currentIndex = (currentIndex + 1) % totalTecnicos;
        }

        Usuario tecnicoFallback = tecnicos.get(startIndex);
        indiceRoundRobin.set((startIndex + 1) % totalTecnicos);
        return tecnicoFallback;
    }

}
