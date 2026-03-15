package com.abs.backend.repository;

import com.abs.backend.entity.Address;
import com.abs.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);

}