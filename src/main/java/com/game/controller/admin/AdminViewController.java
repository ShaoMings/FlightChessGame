package com.game.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author shaoming
 */
@Controller
@RequestMapping("/admin")
public class AdminViewController {

    @GetMapping("/index")
    public String adminIndex(){

        return "admin/admin";
    }

    @GetMapping("/userlist")
    public String userList(){
        return "admin/userlist";
    }

    @GetMapping("/adduser")
    public String addUser(){
        return "admin/adduser";
    }
}
