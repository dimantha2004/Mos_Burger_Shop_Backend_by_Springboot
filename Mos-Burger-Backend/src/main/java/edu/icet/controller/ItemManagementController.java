package edu.icet.controller;

import edu.icet.dto.Item;
import edu.icet.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Item")
@CrossOrigin
@RequiredArgsConstructor
public class ItemManagementController {

    final ItemService itemService;

    @PostMapping("/add")
    public void addItem(@RequestBody Item item) {
        itemService.addItem(item);
    }

    @GetMapping("/getAll")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteItem(@PathVariable("id") Integer id) {
        itemService.deleteItem(id);
    }

    @PutMapping("/update")
    public void updateItem(@RequestBody Item item) {
        itemService.updateItem(item);
    }

    @GetMapping("/search/{id}")
    public Item searchItemById(@PathVariable Integer id) {
        return itemService.searchItemById(id);
    }
}