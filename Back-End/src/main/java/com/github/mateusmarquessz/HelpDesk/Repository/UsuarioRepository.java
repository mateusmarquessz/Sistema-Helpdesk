package com.github.mateusmarquessz.HelpDesk.Repository;

import com.github.mateusmarquessz.HelpDesk.Enum.Role;
import com.github.mateusmarquessz.HelpDesk.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByRole(Role role);
}
