package edu.icet.service.Impl;

import edu.icet.dto.Item;
import edu.icet.entity.ItemEntity;
import edu.icet.repository.ItemRepository;
import edu.icet.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

    @Service
    @RequiredArgsConstructor
    public class ItemServiceImpl implements ItemService {

        final ItemRepository repository;
        final ModelMapper modelMapper;

        @Override
        public void addItem(Item item) {
            ItemEntity itemEntity = modelMapper.map(item, ItemEntity.class);
            repository.save(itemEntity);
        }

        @Override
        public List<Item> getAllItems() {
            List<Item> itemList = new ArrayList<>();
            List<ItemEntity> all = repository.findAll();

            all.forEach(itemEntity -> {
                itemList.add(modelMapper.map(itemEntity, Item.class));
            });
            return itemList;
        }

        @Override
        public void deleteItem(Integer id) {
            repository.deleteById(id);
        }

        @Override
        public void updateItem(Item item) {
            repository.save(modelMapper.map(item, ItemEntity.class));
        }

        @Override
        public Item searchItemById(Integer id) {
            Optional<ItemEntity> itemEntity = repository.findById(id);
            return itemEntity.map(entity -> modelMapper.map(entity, Item.class))
                    .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        }
    }

