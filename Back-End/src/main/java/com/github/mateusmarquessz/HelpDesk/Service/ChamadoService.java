package com.github.mateusmarquessz.HelpDesk.Service;

import com.github.mateusmarquessz.HelpDesk.Dto.CriarChamadoDTO;
import com.github.mateusmarquessz.HelpDesk.Dto.RelatorioSLA;
import com.github.mateusmarquessz.HelpDesk.Enum.PrioridadeChamado;
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

        LocalDateTime agora = LocalDateTime.now();
        switch (dto.getPrioridade()) {
            case ALTA -> {
                chamado.setPrazoResposta(agora.plusMinutes(30));
                chamado.setPrazoResolucao(agora.plusHours(4));
            }
            case MEDIA -> {
                chamado.setPrazoResposta(agora.plusHours(2));
                chamado.setPrazoResolucao(agora.plusHours(12));
            }
            case BAIXA -> {
                chamado.setPrazoResposta(agora.plusHours(4));
                chamado.setPrazoResolucao(agora.plusHours(24));
            }
            default -> {
                chamado.setPrazoResposta(agora.plusHours(2));
                chamado.setPrazoResolucao(agora.plusHours(12));
            }
        }

        return chamadoRepository.save(chamado);
    }

    public void atualizarPrioridade(Long chamadoId, PrioridadeChamado novaPrioridade) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado"));

        chamado.setPrioridade(novaPrioridade);
        LocalDateTime agora = LocalDateTime.now();

        switch (novaPrioridade) {
            case ALTA -> {
                chamado.setPrazoResposta(agora.plusMinutes(30));
                chamado.setPrazoResolucao(agora.plusHours(4));
            }
            case MEDIA -> {
                chamado.setPrazoResposta(agora.plusHours(2));
                chamado.setPrazoResolucao(agora.plusHours(12));
            }
            case BAIXA -> {
                chamado.setPrazoResposta(agora.plusHours(4));
                chamado.setPrazoResolucao(agora.plusHours(24));
            }
        }

        chamado.setAtualizadoEm(agora);
        chamadoRepository.save(chamado);
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

    public void atualizarChamado(Long chamadoId,String novoTitulo, String novaDescricao, StatusChamado novoStatus) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado"));

        if(novoTitulo != null){
            chamado.setTitulo(novoTitulo);
        }

        if (novaDescricao != null && !novaDescricao.isEmpty()) {
            chamado.setDescricao(novaDescricao);
        }
        if (novoStatus != null) {
            chamado.setStatus(novoStatus);
        }
        chamado.setAtualizadoEm(LocalDateTime.now());
        chamadoRepository.save(chamado);
    }

    public RelatorioSLA gerarRelatorioSLA(LocalDateTime inicio, LocalDateTime fim) {
        List<Chamado> chamados = chamadoRepository.findByAtualizadoEmBetween(inicio, fim);

        long totalChamados = chamados.size();
        long chamadosDentroSLA = chamados.stream().filter(Chamado::getSlaCumprido).count();
        long chamadosForaSLA = totalChamados - chamadosDentroSLA;

        double percentualCumprimento = totalChamados > 0
                ? (chamadosDentroSLA * 100.0) / totalChamados
                : 0.0;

        RelatorioSLA relatorio = new RelatorioSLA();
        relatorio.setChamadosFechados(totalChamados);
        relatorio.setChamadosDentroSLA(chamadosDentroSLA);
        relatorio.setChamadosForaSLA(chamadosForaSLA);
        relatorio.setPercentualCumprimento(percentualCumprimento);

        return relatorio;
    }

    public void recusarChamado(Long chamadoId, Integer tecnicoId) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado"));

        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        if (tecnico.getRole() != Role.TECNICO) {
            throw new RuntimeException("Usuário não é um técnico");
        }

        if (!chamado.getTecnico().equals(tecnico)) {
            throw new RuntimeException("O técnico não é o responsável por este chamado");
        }

        chamado.setStatus(StatusChamado.PENDENTE);
        chamado.setTecnico(null);
        chamado.setAtualizadoEm(LocalDateTime.now());
        Usuario tecnicoNovo = buscarTecnicoRoundRobin();
        chamado.setTecnico(tecnicoNovo);

        chamadoRepository.save(chamado);
    }

    public void concluirChamado(Long chamadoId) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado"));

        if (chamado.getStatus() == StatusChamado.FECHADO) {
            throw new RuntimeException("Chamado já está fechado");
        }

        chamado.setStatus(StatusChamado.RESOLVIDO);
        chamado.setAtualizadoEm(LocalDateTime.now());

        if (chamado.getPrazoResolucao() != null && chamado.getPrazoResolucao().isBefore(LocalDateTime.now())) {
            chamado.setSlaCumprido(false);
        } else {
            chamado.setSlaCumprido(true);
        }

        chamadoRepository.save(chamado);
    }


}
