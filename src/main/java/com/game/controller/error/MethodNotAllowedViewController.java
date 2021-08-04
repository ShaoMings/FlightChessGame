package com.game.controller.error;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author shaoming
 */
@Controller
@RequestMapping("/method")
public class MethodNotAllowedViewController {
    @GetMapping("/405")
    public String methodNotAllowed(){
        return "/error/405";
    }
}
