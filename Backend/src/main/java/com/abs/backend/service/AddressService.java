package com.abs.backend.service;

import com.abs.backend.dto.AddressRequest;
import com.abs.backend.entity.Address;
import com.abs.backend.entity.User;
import com.abs.backend.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    public List<Address> getUserAddresses(User user) {

        return addressRepository.findByUser(user);

    }

    public Address addAddress(User user, AddressRequest request) {

        Address address = Address.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .isDefault(false)
                .user(user)
                .build();

        return addressRepository.save(address);

    }

    public void deleteAddress(Long id) {

        addressRepository.deleteById(id);

    }

    public Address updateAddress(Long id, AddressRequest request) {

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        return addressRepository.save(address);
    }
}