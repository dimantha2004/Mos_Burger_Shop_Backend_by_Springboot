package edu.icet.service;

import edu.icet.dto.Item;

import java.util.List;

    public interface ItemService {
        void addItem(Item item);
        List<Item> getAllItems();
        void deleteItem(Integer id);
        void updateItem(Item item);
        Item searchItemById(Integer id);
    }

