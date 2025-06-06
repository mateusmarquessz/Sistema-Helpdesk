package com.github.mateusmarquessz.HelpDesk.Repository;

import com.github.mateusmarquessz.HelpDesk.Model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

}
