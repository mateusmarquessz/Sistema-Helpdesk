package com.github.mateusmarquessz.HelpDesk.Repository;

import com.github.mateusmarquessz.HelpDesk.Enum.StatusChamado;
import com.github.mateusmarquessz.HelpDesk.Model.Chamado;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
    List<Chamado> findByTecnicoId(Integer tecnicoId);
    long countByTecnicoAndStatusIn(Usuario tecnico, List<StatusChamado> statusList);
    List<Chamado> findByClienteId(Integer clienteId);
}