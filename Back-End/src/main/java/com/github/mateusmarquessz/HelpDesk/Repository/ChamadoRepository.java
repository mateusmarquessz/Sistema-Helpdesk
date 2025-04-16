package com.github.mateusmarquessz.HelpDesk.Repository;

import com.github.mateusmarquessz.HelpDesk.Model.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {

}