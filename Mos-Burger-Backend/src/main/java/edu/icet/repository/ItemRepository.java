package edu.icet.repository;

import edu.icet.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

    @Repository
    public interface ItemRepository extends JpaRepository<ItemEntity, Integer> {
    }

