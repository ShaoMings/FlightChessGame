package com.game.controller.index;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author shaoming
 */
@Controller
public class IndexController {
    @GetMapping(value = {"/","/index"})
    public String index(){
        return "index";
    }
}
