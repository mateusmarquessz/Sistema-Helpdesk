package com.github.mateusmarquessz.HelpDesk.Repository;

import com.github.mateusmarquessz.HelpDesk.Model.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
    List<Chamado> findByTecnicoId(Integer tecnicoId);
    long countByTecnicoId(Integer tecnicoId);
}