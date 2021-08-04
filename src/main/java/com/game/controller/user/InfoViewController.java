package com.game.controller.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author shaoming
 */
@Controller
@RequestMapping("/user")
public class InfoViewController {
    @GetMapping("/info")
    public String userInfo(){
        return "info";
    }
}
